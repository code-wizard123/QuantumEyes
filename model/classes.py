from PIL import Image
from flask import Flask, request, jsonify
import io
import numpy as np

import torch
import torch.nn as nn
from torch.autograd import Function
from torchvision import transforms

import qiskit
from qiskit.visualization import *

QC_outputs = ['000', '001', '010', '011', '100', '101', '110', '111']

class QuantumCircuit:
  # This is the initialization
    def __init__(self, n_qubits, backend, shots):
        # Define how many lanes we want
        self._circuit = qiskit.QuantumCircuit(n_qubits)

        # Just a list of 0 to the number of qubits... Just useful so we can just define the circuit (with all it's little parts super quickly)
        all_qubits = [i for i in range(n_qubits)]
        # There are 7 placeholder variables
        self.theta_0 = qiskit.circuit.Parameter('theta0')
        self.theta_1 = qiskit.circuit.Parameter('theta1')
        self.theta_2 = qiskit.circuit.Parameter('theta2')
        self.theta_3 = qiskit.circuit.Parameter('theta3')
        self.theta_4 = qiskit.circuit.Parameter('theta4')
        self.theta_5 = qiskit.circuit.Parameter('theta5')
        self.theta_6 = qiskit.circuit.Parameter('theta6')
        self.theta_7 = qiskit.circuit.Parameter('theta7')

        # Shove in the Hardav gate, a barrier (visual), and a rotation about the y plane of theta degrees
        self._circuit.h(all_qubits)
        self._circuit.barrier()
        self._circuit.ry(self.theta_0, all_qubits)
        # Now comes the custom thing for 3 qubits specifically. I adapted it from a paper
        self._circuit.cz(0, 1)
        self._circuit.cz(1, 2)
        self._circuit.ry(self.theta_1, 0)
        self._circuit.ry(self.theta_2, 1)
        self._circuit.ry(self.theta_3, 2)
        self._circuit.cz(0, 2)
        self._circuit.ry(self.theta_4, 0)
        self._circuit.cz(0,2)
        self._circuit.ry(self.theta_5, 1)
        self._circuit.ry(self.theta_6, 2)
        self._circuit.ry(self.theta_7, 0)

        self._circuit.measure_all()

        # save these varaibles for later so we don't have to call them again during the forwarding
        self.backend = backend
        self.shots = shots

    # forwarding through the quantum circuit
    def run(self, thetas):
        # prep the execution. Link to circuit, Define backend and number of shots... And then fill in the placeholder variables (theta) with the thing we pass through when we forward
        job = qiskit.execute(self._circuit,
                             self.backend,
                             shots=self.shots,
                             parameter_binds=[{self.theta_0: thetas[0],
                                               self.theta_1: thetas[1],
                                               self.theta_2: thetas[2],
                                               self.theta_3: thetas[3],
                                               self.theta_4: thetas[4],
                                               self.theta_5: thetas[5],
                                               self.theta_6: thetas[6],
                                               self.theta_7: thetas[7]}])

        # execution
        counts = job.result().get_counts()
        expects = np.zeros(8)
        for k in range(8):
            key = QC_outputs[k]
            perc = counts.get(key, 0) / self.shots
            expects[k] = perc
        return expects

# This class defines what our hybrid layer does. It allows it to go forward, and also backprop


class HybridFunction(Function):

    @staticmethod
    def forward(ctx, input, quantum_circuit, shift):
        ctx.shift = shift
        ctx.quantum_circuit = quantum_circuit

        parameter = []

        # A very scrapy but functional way of loading the parameters in this format
        for x in input:
            for y in x:
                parameter.append([y])
        # print(parameter)

        # Aka we run the input into our circuit
        # Might need to change this when have multi-layer
        expectation_z = ctx.quantum_circuit.run(parameter)
        # Shoves to pytorch tesnor

        result = torch.tensor(np.array([expectation_z]))
        # Save the input and result for backpropagation
        ctx.save_for_backward(input, result)
        # return output
        return result

    @staticmethod
    def backward(ctx, grad_output):
        # Regrabing the input and the output
        input, expectation_z = ctx.saved_tensors
        # input_list = np.array(input.tolist())
        # print(input)

        input_list = list(input)[0]
        # print(input_list)

        # input_list = input_list.cuda()

        # A list of all the gradients
        gradients = torch.Tensor()

        # We're going to go through the inputs and then calculate the gradient for each one
        for i in range(6):
            # In order to get the gradients for each one, we shift one of the parameters a tiny bit and find the difference in the outputs... Since we can't do backprop on it, we use something called shift parameter
            shift_right = []
            for a in input_list.detach().clone():
                shift_right.append([a])

            shift_left = []
            for a in input_list.detach().clone():
                shift_left.append([a])

            shift_right[i][0] = shift_right[i][0] + ctx.shift
            shift_left[i][0] = shift_left[i][0] - ctx.shift

            # So we take the shifted ones and just compute it
            expectation_right = ctx.quantum_circuit.run(shift_right)
            expectation_left = ctx.quantum_circuit.run(shift_left)
            # Gradient = appox the difference (division by 2*shift isn't necessary since it'll just be a scaled version (which can be counteracted by lr))
            gradient = torch.tensor(
                np.array([expectation_right])) - torch.tensor(np.array([expectation_left]))
            # Append the gradient to the meta list
            gradients = torch.cat((gradients, gradient.float()))

        # Format everything
        result = torch.Tensor(gradients)
        result = result.float()
        result = result.T

        # Just a random varaible that made my life easier when debugging
        Fixer = grad_output.float()
        Fixer = Fixer.T

        # Find the gradients at last!!!
        h = result * Fixer
        # h = h.cuda()
        # then return it for backprop
        return h, None, None

# This defines the acutal thing that we're shoving into the NN


class Hybrid(nn.Module):
    # initialization
    def __init__(self, backend, shots, shift):
        super(Hybrid, self).__init__()
        # Define the real quantum circuit that we'll be using for our thing
        self.quantum_circuit = QuantumCircuit(3, backend, shots)
        # Save this guy for alter
        self.shift = shift

    # When forwarding
    def forward(self, input):
        return HybridFunction.apply(input, self.quantum_circuit, self.shift)


class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv_block1 = nn.Sequential(
            nn.Conv2d(3, 6, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(6, 16, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            # nn.Dropout2d(0.25)
        )

        self.conv_block2 = nn.Sequential(
            nn.Conv2d(16, 40, 3),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            # nn.Dropout2d(0.25)
        )

        self.fc_block = nn.Sequential(
            nn.Linear(25000, 120),
            nn.ReLU(),
            nn.Linear(120, 84),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(84, 8),
            nn.ReLU())
        self.quantum = Hybrid(qiskit.Aer.get_backend(
            'qasm_simulator'), 1000, np.pi/12)
        self.output_layer = nn.Sequential(nn.Linear(8, 5),
                                          # nn.Softmax(dim=1)
                                          )

    def forward(self, x):
        x = self.conv_block1(x)
        x = self.conv_block2(x)
        x = x.view(-1, 25000)
        x = self.fc_block(x)

        theta = x
        x = self.quantum(x)
        x = x.type(dtype=torch.FloatTensor)

        output = self.output_layer(x.float())
        x = output.view(1, -1)
        return x, theta
