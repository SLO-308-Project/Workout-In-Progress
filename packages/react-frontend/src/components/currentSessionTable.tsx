function CurrentSessionHeader()
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

function CurrentSessionTableBody(props)
{
    const rows = props.workoutData.map((row, index: number) =>
    {
        return (
            <tr key={index}>
                <td>{"Workout: " + row.machineId}</td>
                <td>{row.name}</td>
                <td>
                    <button onClick={() => props.removeWorkout(row.name)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return <tbody> {rows} </tbody>;
}

function CurrentSessionTable(props)
{
    return (
        <table>
            <CurrentSessionHeader />
            <CurrentSessionTableBody
                workoutData={props.workoutData}
                removeWorkout={props.removeWorkout}
            />
        </table>
    );
}

export default CurrentSessionTable;
