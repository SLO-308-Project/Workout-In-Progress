// import immage from "../assets/plus2.jpg";

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
        <div>
            <div className="flex justify-between bg-gray-500 p-2 rounded-xl">
                <h1 className="text-3xl">Machines:</h1>
                <input
                    className="text-2xl origin-center hover:opacity-70"
                    type="image"
                    src="/plus.svg"
                    height={10}
                    alt="add">
                </input>
                <img
                alt="test"
                src="/plus2.jpg"
                height={100}>   
                </img>
            </div>

<table className="block justify-between bg-gray-400 p-2 rounded-xl">
            <MachineTableHeader />
            <MachineTableBody
                machineData={props.machineData}
                removeMachine={props.removeMachine}
            />
        </table>
        </div>
        
    );
}

export default MachineTable;
