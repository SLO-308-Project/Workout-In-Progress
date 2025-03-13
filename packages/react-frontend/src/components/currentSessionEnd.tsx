function SessionData(props)
{
    if (props.sessionData === null)
    {
        return <div> CREATE SESSION </div>;
    }
    else
    {
        return (
            <div>
                Session: {props.sessionNum} <br />
                Start Date: {props.sessionData.date} <br />
                Duration:{" "}
                {(Date.now() - new Date(props.sessionData.date).getTime()) /
                    1000}
            </div>
        );
    }
}

function CurrentSessionStartButton(props)
{
    return (
        <div>
            <SessionData
                sessionData={props.sessionData}
                sessionNum={props.sessionNum}
            />
            <button onClick={props.createSession}>+</button>
        </div>
    );
}

export default CurrentSessionStartButton;
