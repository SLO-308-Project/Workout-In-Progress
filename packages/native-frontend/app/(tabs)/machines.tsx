// import {useState, useEffect} from "react";
// import MachineForm from "@/components/machineForm";
// import MachineComponent from "@/components/machineComponent";
//
// export default function Machines() {
//   return (
//   <View>
//       <Text>This is machines page.</Text>
//   </View>
//   )
// }
import { Text, View } from 'react-native';
import {useState, useEffect} from "react";
import MachineForm from "@/components/machines/machineForm";
import MachineComponent from "@/components/machines/machineComponent";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "@/fetchers/machineFetchers";

import { Machine } from "@/types/machine";

function MachinePage()
{
    const [machines, setMachine] = useState<Machine[]>([]);

    useEffect(() =>
    {
        getMachines();
    }, []);

    function getMachines(): void
    {
        fetchGetMachine()
            .then((res: Response) => res.json())
            .then((res_data) =>
            {
                console.log(`GETMACHINES RES_DATA=${res_data}`);
                setMachine(res_data);
            })
            .catch((error: unknown) => console.log(error));
    }

    function addOneMachine(machine: Machine): void
    {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine)
            .then((res) =>
            {
                if (res.status == 201)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`);
                setMachine([...machines, res_data]);
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    function removeOneMachine(name: string)
    {
        fetchDeleteMachine(name)
            .then((res) =>
            {
                if (res.ok)
                {
                    setMachine(
                        machines.filter((machine) => machine.name !== name),
                    );
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    const listMachines = machines.map((machine: Machine) => (
        <View key={machine._id}>
            <MachineComponent
                machine={machine}
                handleDelete={removeOneMachine}
            />
        </View >
    ));

    return (
        <View className="container">
            {listMachines}
            <MachineForm handleSubmit={addOneMachine} />
        </View>
    );
}
export default MachinePage;
