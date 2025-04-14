import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AttributeForm from "./attributeForm";
import AttributeComponent from "./attributeComponent";
import {
    fetchGetAttributes,
    fetchPostAttribute,
    fetchDeleteAttribute,
} from "@/fetchers/machineFetchers";
import { Attribute } from "@/types/attribute";
import { Machine } from "@/types/machine";

type Props = {
    machine: Machine;
    handleDelete: (name: string) => void;
}

export default function MachineComponent({ machine, handleDelete }: Props) {
    const [attributes, setAttributes] = useState<Attribute[]>([]);


    const getAttributes = useCallback(() => {
        console.log(`MACHINE._id = ${machine._id}`);
        fetchGetAttributes(machine._id)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`res_data.attributes = ${res_data.attributes}`);

                console.log(`${JSON.stringify(res_data)}`);
                setAttributes(res_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [machine]);

    useEffect(() => {
        getAttributes();
    }, [getAttributes]);

    function deleteMachine(): void {
        handleDelete(machine.name);
    }

    function addAttribute(attribute: Attribute) {
        console.log(`NAME: ${attribute.name} UNIT: ${attribute.unit}`);
        fetchPostAttribute(machine._id, attribute)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res_data) => setAttributes(res_data.attributes))
            .catch((err) => console.log(err));
    }

    function deleteAttribute(attrName: string) {
        console.log(`DELETING ATTRIBUTE: ${attrName}`)
        fetchDeleteAttribute(machine._id, attrName)
            .then((res) => {
                if (res.ok) {
                    setAttributes(
                        attributes.filter(
                            (attribute) => attribute.name !== attrName,
                        ),
                    );
                }
            })
            .catch((err) => console.log(err));
    }

    const listAttributes = attributes ? (
        attributes.map((attribute: Attribute, index) => (
            <AttributeComponent
                key={index}
                name={attribute.name}
                unit={attribute.unit}
                handleDelete={deleteAttribute}
            />
        ))
    ) : (
        <></>
    );

    return (
        <View>
            <Text>{machine.name}</Text>
            <Text>{machine.muscle}</Text>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl" onPress={deleteMachine}><Text>Delete {machine.name}</Text></Pressable>
            {listAttributes}
            <AttributeForm handleAddAttribute={addAttribute} />
        </View>
    );
}
