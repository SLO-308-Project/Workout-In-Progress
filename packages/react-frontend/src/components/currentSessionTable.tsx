function CurrentSessionHeader()
{
    return (
        <thead>
            <tr>
                <th>Workout</th>
                <th>Machine</th>
                <th>Remove</th>
            </tr>
        </thead>
    );
}

function CurrentSessionTableBody(props)
{
    const rows = props.workouts.map((row, index: number) =>
    {
        return (
            <tr key={index}>
                <td>{"Workout: " + index}</td>
                <td>{MachineIdToName(props.machineOptions, row.machineId)}</td>
                <td>
                    <button onClick={() => props.removeWorkout(row.machineId)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return <tbody> {rows} </tbody>;
}

// Helper function to convert a machineId into a name
function MachineIdToName(machines, machineId) {
    return machines.filter((machine) => machine._id === machineId)[0].name;
}

function CurrentSessionTable(props)
{
    return (
        <table>
            <CurrentSessionHeader />
            <CurrentSessionTableBody
                workouts={props.workoutData}
                machineOptions={props.machineOptions}
                removeWorkout={props.removeWorkout}
            />
        </table>
    );
}

export default CurrentSessionTable;
