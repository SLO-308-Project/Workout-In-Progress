import React, {useCallback, useMemo, useRef} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import {Machine} from "@/types/machine";

type Props = {
    machine: Machine | null;
};

export default function MachineSlide({machine}: Props)
{
    // renders
    return (
        <BottomSheetView>
            <Text>This is {machine?.name}</Text>
        </BottomSheetView>
    );
}
