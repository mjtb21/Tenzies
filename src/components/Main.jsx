import Die from "./Die.jsx";
import {useEffect, useRef, useState} from "react";
import Confetti from 'react-confetti'
import {nanoid} from "nanoid";

export default function Main() {
    const [started, setStarted] = useState(false)
    const [dies, setDies] = useState(() => generateNewDice(1));
    const [counter, setCounter] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const buttonRef = useRef(null);
    const intervalRef = useRef(null);

    const gameWon = dies.every(item => item.isStopped) &&
        dies.every(item => item.value === dies[0].value);

    useEffect(() => {
        if (buttonRef) {
            buttonRef.current.focus();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [gameWon]);

    function generateNewDice(value = null) {
        return Array
            .from({length: 10})
            .map(() => ({
                id: nanoid(),
                value: value === null ? Math.ceil(Math.random() * 6) : value,
                isStopped: false,
            }))
    }

    function stopDie(e, props) {
        if (
            started &&
            dies.filter(item => item.isStopped).every(item => item.value === props.value)
        ) {
            setDies(prevDies => prevDies.map(item => {
                return props.id === item.id ? {...item, isStopped: ! item.isStopped} : item;
            }))
        }
    }

    function rollDices() {
        if (! started) {
            startGame()
        }
        else if (gameWon) {
            resetGame()
        }
        else {
            setCounter(prevCounter => prevCounter + 1)

            setDies(prevDies => prevDies.map(item => {
                return ! item.isStopped ? {...item, value: Math.ceil(Math.random() * 6)} : item;
            }))
        }
    }

    function startGame() {
        setStarted(true)
        setDies(generateNewDice())

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setSeconds(prevSecond => prevSecond + 1);
        }, 1000)
    }

    function resetGame() {
        setStarted(false)
        setCounter(0)
        setSeconds(0)
        setDies(generateNewDice(1))

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }

    function timerFormat() {
        const min = ("0" + Math.floor(seconds / 60)).slice(-2);
        let sec = ("0" + (seconds % 60)).slice(-2);

        return `${min}:${sec}`;
    }

    return (
        <main>
            <h1 className="title">Tenzies</h1>
            <p className="text">
                Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.
            </p>

            <div className="dices">
                {dies.map(die => (
                    <Die
                        key={die.id}
                        id={die.id}
                        value={die.value}
                        isStopped={die.isStopped}
                        stopDie={stopDie}
                        isStarted={started}
                    />
                ))}
            </div>

            <button ref={buttonRef} className="roll" onClick={rollDices}>
                {started ? (gameWon ? "New Game" : "Roll") : "Start"}
            </button>

            <div className="data">
                <div className="timer data-item">{timerFormat(seconds)}</div>
                <div className="counter data-item">{counter}</div>
            </div>

            <button className="reset" onClick={resetGame}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                    <path d="M22.719 12A10.719 10.719 0 0 1 1.28 12h.838a9.916 9.916 0 1 0 1.373-5H8v1H2V2h1v4.2A10.71 10.71 0 0 1 22.719 12z"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
            </button>

            {gameWon &&
                <Confetti
                    className={"confetti"}
                    width={400}
                    height={400}
                />
            }

        </main>
    )
}