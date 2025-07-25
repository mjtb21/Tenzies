export default function Die(props) {
    const dieCount = `die-${props.value}`;
    const dieState = props.isStarted ? (props.isStopped ? "active" : "") : "disabled"
    return (
        <button
            className={`die ${dieCount} ${dieState}`}
            onClick={(e) => props.stopDie(e, props)}>
            {new Array(props.value).fill(<span className="dot"></span>)}
        </button>
    )
}