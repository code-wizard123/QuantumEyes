import React, { useState } from "react"
import styles from "../stylesheets/Login.module.css"

import user from "../assets/user.png"
import password from "../assets/password.png"
import email from "../assets/email.png"
import otp from "../assets/otp.png"

import { useNavigate } from "react-router-dom"
import { SyncLoader } from "react-spinners"

const Signup = () => {
  const [abha, setabha] = useState(0)
  const [pass, setpass] = useState("")
  const [emailid, setemail] = useState("")
  const [otpin, setotp] = useState("")

  const [error, seterror] = useState(null)
  const [loader, setloader] = useState(false)

  const [part1, setpart1] = useState(true)
  const [part2, setpart2] = useState(false)
  const [part3, setpart3] = useState(false)

  const navigate = useNavigate()

  const onchange1 = (event) => {
    setabha(event.target.value)
  }

  const onchange2 = (event) => {
    setpass(event.target.value)
  }

  const onchange3 = (event) => {
    setemail(event.target.value)
  }

  const onchange4 = (event) => {
    setotp(event.target.value)
  }

  const handlesubmit1 = async (e) => {
    e.preventDefault()

    setloader(true)

    const response = await fetch("http://52.66.197.159:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abhaid: abha, email: emailid }),
    })

    const json = await response.json()

    if (json.success) {
      setloader(false)
      setpart1(false)
      setpart2(true)
    }

    if (json.error) {
      setloader(false)
      seterror(json.error)
      setTimeout(() => {
        seterror(null)
      }, 4000)
    }
  }

  const handlesubmit2 = async (e) => {
    e.preventDefault()

    setloader(true)

    const response = await fetch("http://52.66.197.159:5000/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abhaid: abha, otp: otpin }),
    })

    const json = await response.json()

    if (json.success) {
      setloader(false)
      setpart2(false)
      setpart3(true)
    }

    if (json.error) {
      setloader(false)
      seterror(json.error)
      setTimeout(() => {
        seterror(null)
      }, 4000)
    }
  }

  const handlesubmit3 = async (e) => {
    e.preventDefault()

    setloader(true)

    const response = await fetch("http://52.66.197.159:5000/signup2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abhaid: abha, password: pass }),
    })

    const json = await response.json()

    if (json.success) {
      setloader(false)
      localStorage.setItem("Token", json.authToken)
      navigate("/image/upload")
    }

    if (json.error) {
      setloader(false)
      seterror(json.error)
      setTimeout(() => {
        seterror(null)
      }, 4000)
    }
  }

  return (
    <div className={styles.outer}>
      {part1 && (
        <div className={styles.container}>
          <p className={styles.heading}>SignUp</p>

          <form className={styles.form} onSubmit={handlesubmit1}>
            <div className={styles.field}>
              <img src={user} className={styles.img} />
              <input
                className={styles.input}
                placeholder="ABHA Number"
                type="number"
                onChange={onchange1}
              />
            </div>

            <div className={styles.field}>
              <img src={email} className={styles.img2} />
              <input
                className={styles.input}
                placeholder="Email"
                type="text"
                onChange={onchange3}
              />
            </div>

            <div className={styles.btndiv}>
              {!error && !loader && (
                <button className={styles.buttons}>Next</button>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {loader && (
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
              )}
            </div>
          </form>
          <p className={styles.tagline}>
            Already a member?{" "}
            <a href="/login" className={styles.link}>
              Login
            </a>{" "}
          </p>
        </div>
      )}

      {part2 && (
        <div className={styles.container2}>
          <p className={styles.heading}>Verify</p>
          <p className={styles.tagline2}> OTP sent on mail</p>
          <form className={styles.form} onSubmit={handlesubmit2}>
            <div className={styles.field}>
              <img src={otp} className={styles.img} />
              <input
                className={styles.input}
                placeholder="OTP"
                type="number"
                onChange={onchange4}
              />
            </div>

            <div className={styles.btndiv}>
              {!error && !loader && (
                <button className={styles.buttons}>Verify</button>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {loader && (
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
              )}
            </div>
          </form>

          <p className={styles.tagline}>Kindly do not refresh or press back.</p>
        </div>
      )}

      {part3 && (
        <div className={styles.container2}>
          <p className={styles.heading}>Password</p>
          <p className={styles.tagline2}> Mail verfied successfully !</p>
          <form className={styles.form} onSubmit={handlesubmit3}>
            <div className={styles.field}>
              <img
                src={password}
                className={`${styles.img} ${styles.passimg}`}
              />
              <input
                className={styles.input}
                placeholder="Password"
                type="password"
                onChange={onchange2}
              />
            </div>

            <div className={styles.btndiv}>
              {!error && !loader && (
                <button className={styles.buttons}>Sign Up</button>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {loader && (
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
              )}
            </div>
          </form>

          <p className={styles.tagline}>Kindly do not refresh or press back.</p>
        </div>
      )}
    </div>
  )
}

export default Signup
