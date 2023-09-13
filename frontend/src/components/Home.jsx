import React, { useEffect } from "react"
import AOS from "aos"
import 'aos/dist/aos.css';

import styles from "../stylesheets/Home.module.css"
import navb from "../stylesheets/Navbar.module.css"

import Typewriter from "typewriter-effect"
import { useNavigate } from "react-router-dom"

import uploadimg from "../assets/upload.png"
import brain from "../assets/brain.png"
import eyescanner from "../assets/eye-scanner.png"

import ChatBot from "./ChatBot.jsx"

const Home = () => {
    let navigate = useNavigate()

    const func1 = (e) => {
        navigate("/dashboard")
    }

    const func2 = (e) => {
        navigate("/login")
    }

    useEffect(() => {
        AOS.init({ duration: 2000, once: true });
    }, []);

    return (
        <>
            <div className={styles.desktop}>
                <nav className={navb.navbar}>
                    {localStorage.getItem("Token") ? (
                        <button
                            className={`${styles.buttons} ${navb.buttonhome}`}
                            onClick={func1}
                        >
                            Dashboard
                        </button>
                    ) : (
                        <button
                            className={`${styles.buttons} ${navb.buttonhome}`}
                            onClick={func2}
                        >
                            Get Started
                        </button>
                    )}
                </nav>
                <ChatBot />
                <div className={styles.container}>
                    <div className={styles.headings}>
                        <div>
                            <p className={styles.title}>
                                <Typewriter
                                    options={{
                                        strings: ["QuantumEyes"],
                                        autoStart: true,
                                        deleteSpeed: Infinity,
                                    }}
                                />
                            </p>
                            <p className={styles.tagline}>
                                Diabetic Retinopathy with Quantum Computing
                            </p>
                        </div>
                    </div>

                    <div className={styles.aboutdiv}>
                        <p data-aos="fade-zoom-in" data-aos-duration="1500" data-aos-delay="200" className={styles.aboutus}>About Us</p>

                        <p data-aos="fade-zoom-in" data-aos-duration="1500" data-aos-delay="700" className={styles.abouttxt}>
                            Our website utilizes quantum computing and deep learning
                            to detect diabetic retinopathy from fundus images.
                            Additionally, we offer essential precautions and
                            guidance for a comprehensive approach to managing this
                            eye disorder.
                        </p>
                    </div>

                    <div data-aos="fade-zoom-in" data-aos-duration="1500" data-aos-delay="700" className={styles.stepsheading}>
                        <p className={styles.testedtxt}>Get Tested</p>
                        <p className={styles.steps}>In 3 Simple Steps</p>
                    </div>

                    <div className={styles.stepsdiv} data-aos="fade-zoom-in" data-aos-duration="1500" data-aos-delay="700">
                        <div className={styles.stepparent}>
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={eyescanner}
                                alt="Eye Scanner"
                                className={styles.img}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Click a picture of your eye under a{" "}
                                <a
                                    href="https://en.wikipedia.org/wiki/Fundus_(eye)"
                                    className={styles.link}
                                >
                                    Fundus
                                </a>{" "}
                                or using a 20D lens attachment which matches the
                                image above.
                            </p>
                        </div>

                        <div className={styles.stepparent}>
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={uploadimg}
                                alt="Upload Image"
                                className={styles.img2}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Conveniently upload images by dragging or selecting
                                them directly from your device.
                            </p>
                        </div>

                        <div className={styles.stepparent}>
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={brain}
                                alt="Upload Image"
                                className={styles.img2}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Await AI Assessment:
                                <br /> Attain Instant Results, Detailed Overview
                            </p>
                            {localStorage.getItem("Token") ? (
                                <a href="/image/upload" className={styles.testnow}>
                                    Test Now
                                </a>
                            ) : (
                                <a href="/login" className={styles.testnow}>
                                    Test Now
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>



            <div className={styles.mobile}>
                <nav className={navb.navbar}>
                    {localStorage.getItem("Token") ? (
                        <button
                            className={`${styles.buttons} ${navb.buttonhome}`}
                            onClick={func1}
                        >
                            Dashboard
                        </button>
                    ) : (
                        <button
                            className={`${styles.buttons} ${navb.buttonhome}`}
                            onClick={func2}
                        >
                            Get Started
                        </button>
                    )}
                </nav>
                <ChatBot />
                <div className={styles.container}>
                    <div className={styles.headings}>
                        <div>
                            <p className={styles.title}>
                                <Typewriter
                                    options={{
                                        strings: ["QuantumEyes"],
                                        autoStart: true,
                                        deleteSpeed: Infinity,
                                    }}
                                />
                            </p>
                            <p className={styles.tagline}>
                                Diabetic Retinopathy with Quantum Computing
                            </p>
                        </div>
                    </div>

                    <div data-aos="fade-zoom-in" data-aos-duration="1500" className={styles.aboutdiv}>
                        <p className={styles.aboutus}>About Us</p>

                        <p className={styles.abouttxt}>
                            Our website utilizes quantum computing and deep learning
                            to detect diabetic retinopathy from fundus images.
                            Additionally, we offer essential precautions and
                            guidance for a comprehensive approach to managing this
                            eye disorder.
                        </p>
                    </div>

                    <div data-aos="fade-zoom-in" data-aos-duration="1500" className={styles.stepsheading}>
                        <p className={styles.testedtxt}>Get Tested</p>
                        <p className={styles.steps}>In 3 Simple Steps</p>
                    </div>

                    <div className={styles.stepsdiv}>
                        <div className={styles.stepparent} data-aos="fade-right" data-aos-duration="1500">
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={eyescanner}
                                alt="Eye Scanner"
                                className={styles.img}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Click a picture of your eye under a{" "}
                                <a
                                    href="https://en.wikipedia.org/wiki/Fundus_(eye)"
                                    className={styles.link}
                                >
                                    Fundus
                                </a>{" "}
                                or using a 20D lens attachment which matches the
                                image above.
                            </p>
                        </div>

                        <div className={styles.stepparent} data-aos="fade-left" data-aos-duration="1500">
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={uploadimg}
                                alt="Upload Image"
                                className={styles.img2}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Conveniently upload images by dragging or selecting
                                them directly from your device.
                            </p>
                        </div>

                        <div className={styles.stepparent} data-aos="fade-right" data-aos-duration="1500">
                            {/* <div className={styles.stepimg}> */}
                            <img
                                src={brain}
                                alt="Upload Image"
                                className={styles.img2}
                            />
                            {/* </div> */}
                            <p className={styles.steptxt}>
                                Await AI Assessment:
                                <br /> Attain Instant Results, Detailed Overview
                            </p>
                            {localStorage.getItem("Token") ? (
                                <a href="/image/upload" className={styles.testnow}>
                                    Test Now
                                </a>
                            ) : (
                                <a href="/login" className={styles.testnow}>
                                    Test Now
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
