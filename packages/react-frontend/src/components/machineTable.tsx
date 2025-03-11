import image from "../assets/plus.svg";

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
        // return (
        //     <tr key={index}>
        //         <td>{row.name}</td>
        //         <td>{row.muscle}</td>
        //         <td>
        //             <button onClick={() => props.removeMachine(row.name)}>
        //                 Delete
        //             </button>
        //         </td>
        //     </tr>
        // );
        return (
            <div key={index}>
                <div>{row.name}</div>
                <div>{row.muscle}</div>
                <div>
                    <button onClick={() => props.removeMachine(row.name)}>
                        Delete
                    </button>
                </div>
            </div>
        );
    });
    return <tbody> {rows} </tbody>;
}

function MachineTable(props)
{
    return (
        <div>
            <div className="flex justify-between items-center bg-gray-500 p-2 rounded-xl">
                <h1 className="text-4xl">Machines:</h1>
                <input
                    className="text-2xl hover:opacity-50"
                    type="image"
                    src={image}
                    width={50}
                    height={50}
                    alt="add">
                </input>
            </div>
            <MachineTableBody
                machineData={props.machineData}
                removeMachine={props.removeMachine}
            />

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
