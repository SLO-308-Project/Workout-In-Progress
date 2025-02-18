import {machineI, machineTableProp} from "./machine";
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

function MachineTableBody(props: machineTableProp)
{
    const rows = props.machineData.map((row: machineI, index: number) =>
    {
        return (
            <tr key={index}>
                <td>{row.name}</td>
                <td>{row.muscle}</td>
                <td>
                    <button onClick={() => props.removeMachine(index)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return <tbody> {rows} </tbody>;
}

function MachineTable(props: machineTableProp)
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
