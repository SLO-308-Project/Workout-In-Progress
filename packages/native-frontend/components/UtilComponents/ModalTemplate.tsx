import {useState} from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    TouchableWithoutFeedback,
} from "react-native";

type Props = {
    Icon: JSX.Element;
    Content: (setModalVisible: (visible: boolean) => void) => JSX.Element;
};

export default function ModalTemplate({Icon, Content}: Props)
{
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View>
            <Pressable
                onPress={() =>
                {
                    setModalVisible(true);
                }}
            >
                {Icon}
            </Pressable>
            <Modal visible={modalVisible} transparent={true}>
                {/* <View className="items-center"> */}
                <Pressable className="absolute top-0 left-0 right-0 bottom-0 bg-black/25" />
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center">
                        <TouchableWithoutFeedback onPress={() =>
                        {}}>
                            <View className="bg-white p-4 rounded-xl rounded-lg">
                                {Content(setModalVisible)}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
