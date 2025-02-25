function TableBody(props) {
    const rows = props.timeData.map((row, index: number) =>
    {
        return (
            <tr key={index}>
                <td>{row.time}</td>
                <td>{Math.round(row.deltaTime/1000)}</td>
            </tr>
        );
    });
    return <tbody> {rows} </tbody>;
}

function CurrentSessionStartButton(props) {
    return <div>
        Current Session: 1
        Duration: 1 sec
        <button onClick={props.setTime}>
            +
        </button>
        <table>
            <TableBody timeData={props.timeData} />
        </table>

    </div>
}

export default CurrentSessionStartButton;

