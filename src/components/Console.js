import backboardImg from "../img/backboard.png";
import outputBg from "../img/console-output.svg";
import inputBg from "../img/console-input.svg";

import typeSoundEffect from "../audio/type.mp3";

import { useState, useRef, useEffect } from "react";

const Console = (props) => {
    const [input, setInput] = useState("");
    const inputRef = useRef();

    const typeSound = new Audio(typeSoundEffect);
    typeSound.volume = 0.75;

    return (
        <div className="console">
            <img className="console-bg" src={backboardImg} alt="backboard" />
            <div className="console-inner">
                <div className="console-output">
                    <img
                        className="console-output-bg"
                        src={outputBg}
                        alt="output"
                    />
                    <div className="console-output-inner">
                        {props.output.map((line) => (
                            <div className="console-output-line">
                                {line[0] !== "%" ? (
                                    <div>
                                        <span className="console-carat">
                                            {">"}
                                        </span>
                                        {line}
                                    </div>
                                ) : (
                                    line.slice(1)
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="console-input"
                    onClick={(e) => {
                        inputRef.current.focus();
                    }}
                >
                    <img
                        className="console-input-bg"
                        src={inputBg}
                        alt="output"
                    />
                    <div className="console-input-inner">
                        <span className="console-carat">$</span>
                        <input
                            ref={inputRef}
                            className="console-input-text"
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                typeSound.play();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && input !== "") {
                                    props.addOutput(input);
                                    props.execCommand(input.toLowerCase());
                                    setInput("");
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Console;
