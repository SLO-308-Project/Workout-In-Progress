function MachineTableHeader()
{
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Muscle</th>
                <th>Remove</th>
            </tr>
        </thead>
    );
}

function MachineTableBody(props)
{
    const rows = props.machineData.map((row, index: number) =>
    {
        return (
            <tr key={index}>
                <td>{row.name}</td>
                <td>{row.muscle}</td>
                <td>
                    <button onClick={() => props.removeMachine(row.name)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return <tbody> {rows} </tbody>;
}

function MachineTable(props)
{
    return (
        <table>
            <MachineTableHeader />
            <MachineTableBody
                machineData={props.machineData}
                removeMachine={props.removeMachine}
            />
        </table>
    );
}

export default MachineTable;
