import React, { useState, useEffect } from "react"
import styles from "../stylesheets/Dashboard.module.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const condition = ['Mild', 'Moderate', 'No DR', 'Proliferative DR', 'Severe']

const Dashboard = () => {
    const navigate = useNavigate()

    const gohome = () => {
        navigate("/")
    }

    const upload = () => {
        navigate('/image/upload')
    }

    const logout = () => {
        localStorage.removeItem('ID')
        localStorage.removeItem('Token')
        navigate("/")
    }

    const [alldata, setAllData] = useState([])
    let once = true

    useEffect(() => {
        const getdata = async () => {
            const id = localStorage.getItem("ID")
            const response = await axios.post("http://52.66.197.159:5000/getdata", { abhaid: id })
            setAllData(response.data.data)
        }
        getdata()
    }, [])

    return (
        <>
            <div className={styles.dashboard}>
                <div className={styles.buttonsflex}>
                    <p className={styles.welcomeabha}>Previous History</p>
                    <button className={styles.buttons} onClick={gohome}>Home</button>
                    <button className={styles.buttons} onClick={upload}>
                        Upload
                    </button>
                    <button className={styles.buttons} onClick={logout}>
                        Logout
                    </button>
                </div>
                <section>

                    <center>
                        <div className={styles.box}>
                            <div className={styles.tablecontent}>
                                <div className={styles.tableouter}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Image</th>
                                                <th>Diagnosis</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alldata.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td><img src={data.url}></img></td>
                                                        <td>{condition[data.diag]}</td>
                                                        <td>{data.date}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </center>
                </section>
            </div>
        </>
    )
}

export default Dashboard
