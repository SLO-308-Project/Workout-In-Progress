import React, {useCallback, useMemo, useRef} from "react";
import {View, Text, StyleSheet, Button, FlatList} from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import {Machine} from "@/types/machine";
import AttributeComponent, {
    Empty,
} from "@/components/machines/attributeComponent";

type Props = {
    machine: Machine | null;
};

export default function MachineSlide({machine}: Props)
{
    // renders
    return (
        <BottomSheetView className="flex-1 pl-4 pr-4">
            <Text
                className="w-80 px-4 py-3 rounded-lg text-base font-bold text-black"
                style={{fontSize: 28}}
            >
                {machine?.name}
            </Text>
            <Text
                className="w-40 px-4 rounded-lg text-base text-black mb-4"
                style={{fontSize: 16}}
            >
                {machine?.muscle}
            </Text>
            <Text className="px-4 text-2xl font-semibold text-black tracking-tight pt-4">
                Attributes
            </Text>
            <FlatList
                data={machine?.attributes}
                renderItem={({item, index}) => (
                    <AttributeComponent
                        key={index}
                        name={item.name}
                        unit={item.unit}
                    />
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
            />
        </BottomSheetView>
    );
}
