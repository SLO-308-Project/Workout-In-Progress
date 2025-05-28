import {useState} from "react";
import {Modal, Pressable, View, TouchableWithoutFeedback} from "react-native";

type Props = {
    Icon: JSX.Element;
    Content: (setModalVisible: (visible: boolean) => void) => JSX.Element;
};

export default function ModalTemplate({Icon, Content}: Props)
{
    const [modelVisible, setModelVisible] = useState<boolean>(false);

    return (
        <View>
            <Pressable
                onPress={() =>
                {
                    setModelVisible(true);
                }}
            >
                {Icon}
            </Pressable>
            <Modal visible={modelVisible} transparent={true}>
                <TouchableWithoutFeedback
                    onPress={() => setModelVisible(false)}
                >
                    <View className="flex-1 backdrop-brightness-75 justify-center items-center">
                        <TouchableWithoutFeedback>
                            {Content(setModelVisible)}
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
