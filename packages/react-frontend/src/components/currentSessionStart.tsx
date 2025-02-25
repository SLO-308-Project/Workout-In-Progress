function CurrentSessionEndButton(prop) {
    return <div>
        <button onClick={prop.setDeltaTime}>
            End
        </button>
    </div>
}

export default CurrentSessionEndButton;

