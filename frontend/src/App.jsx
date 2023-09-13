import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./components/Home"
import ImageUpload from "./components/ImageUpload"
import Error404 from "./components/Error404"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Dashboard from "./components/Dashboard"

import PrivateRoutes from "./utils/PrivateRoutes"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/image/upload" element={<ImageUpload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
