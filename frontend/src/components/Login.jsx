import React, { useState } from 'react'
import styles from '../stylesheets/Login.module.css'

import user from '../assets/user.png'
import password from '../assets/password.png'
import { useNavigate } from 'react-router-dom'

import { SyncLoader } from 'react-spinners'

const Login = () => {

    const [abha, setabha] = useState(0)
    const [pass, setpass] = useState("")

    const [error, seterror] = useState(null)
    const [loader, setloader] = useState(false)

    const navigate = useNavigate()

    const onchange1 = (event) => {
        setabha(event.target.value)
    }

    const onchange2 = (event) => {
        setpass(event.target.value)
    }

    const handlesubmit = async (e) => {
        e.preventDefault()

        setloader(true)

        const response = await fetch("http://52.66.197.159:5000/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ abhaid: abha, password: pass }),
            }
        )

        const json = await response.json()

        if (json.success) {
            setloader(false)
            localStorage.setItem("Token", json.authToken)
            navigate("/dashboard")
        }

        if (json.error) {
            setloader(false)
            seterror(json.error)
            setTimeout(() => {
                seterror(null)
            }, 4500)
        }

    }

    return (
        <div className={styles.outer}>
            <div className={styles.container}>
                <p className={styles.heading}>Login</p>

                <form className={styles.form} onSubmit={handlesubmit}>
                    <div className={styles.field}>
                        <img src={user} className={styles.img} />
                        <input className={styles.input} placeholder='ABHA Id' type='number' onChange={onchange1} />
                    </div>

                    <div className={styles.field}>
                        <img src={password} className={styles.img2} />
                        <input className={styles.input} placeholder='Password' type='password' onChange={onchange2} />
                    </div>
                    <div className={styles.btndiv}>
                        {!error && !loader && <button className={styles.buttons}>Login</button>}
                        {error && <p className={styles.error}>{error}</p>}
                        {loader &&
                        <div className={styles.loadctn}>
                            <SyncLoader
                            color="#ae98e1"
                            margin={5}
                            size={13}
                            loading={true}
                            speedMultiplier={1}
                            className={styles.loading}
                        />
                        </div> 
                        }
                    </div>
                </form>

                <p className={styles.tagline} >Not a member yet? <a href='/signup' className={styles.link}>SignUp</a> </p>

            </div>
        </div>
    )
}

export default Login