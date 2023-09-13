import React, { useState } from "react";
 
import bot from "../assets/bot.png";
import close from "../assets/close2.png";
import styles from "../stylesheets/chatbot.module.css";
 
const ChatBot = () => {
    const [show, setshow] = useState(false);
 
    const activate = () => {
        setshow(!show);
    };
 
    return (
        <div>
            {show && (
                <div>
                    <div className={styles.btncont} onClick={activate}>
                        <button className={styles.button}>
                            <img
                                src={close}
                                className={styles.img}
                                alt="Close button"
                            />
                        </button>
                    </div>
                    <div className={styles.chatcont}>
                        <div className={styles.laptop}>
                            <iframe
                                allow="microphone"
                                src="https://console.dialogflow.com/api-client/demo/embedded/66986b33-d0f9-42ed-9529-ac19a0566e28"
                                style={{
                                    height: "70vh",
                                    width: "23vw",
                                    border: "none",
                                    borderRadius: "4%",
                                    padding: "1%",
                                }}
                            />
                        </div>
                        <div className={styles.mobile}>
                            <iframe
                                allow="microphone"
                                src="https://console.dialogflow.com/api-client/demo/embedded/66986b33-d0f9-42ed-9529-ac19a0566e28"
                                style={{
                                    height: "55vh",
                                    width: "73vw",
                                    border: "none",
                                    borderRadius: "6%/3%",
                                    padding: "1%",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
 
            <div className={styles.icon} onClick={activate}>
                <img
                    className={styles.img}
                    src={bot}
                    alt="Chatbot icon , Click to chat"
                />
            </div>
        </div>
    );
};
 
export default ChatBot;