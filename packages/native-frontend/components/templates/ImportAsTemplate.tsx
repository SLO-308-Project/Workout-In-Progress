import {fetchCreateTemplate} from "@/fetchers/templateFetchers";
import {Feather} from "@expo/vector-icons";
import {useState} from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    TouchableWithoutFeedback,
    TextInput,
} from "react-native";
import ModalTemplate from "../ModalTemplate";

type Props = {
    fromSession: boolean;
    Icon: JSX.Element;
};

export default function ImportAsTemplate({fromSession, Icon}: Props)
{
    // const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [vaildId, setValidId] = useState<boolean>(true);
    const [id, setId] = useState<string>("");

    function saveTemplate(setModalVisible: (arg0: boolean) => void)
    {
        //creates template. Uses the already existing template.
        fetchCreateTemplate(id, "", fromSession)
            .then((res) =>
            {
                if (res.status === 201)
                {
                    setModalVisible(false);
                    setValidId(true);
                }
                else
                {
                    setValidId(false);
                    console.log(
                        `status ${res.status}: Not Created, but okay, ${res.statusText}`,
                    );
                }
            })
            .catch((err) =>
            {
                console.log("Error Creating Template: ", err);
            });
    }

    return (
        <ModalTemplate
            Icon={Icon}
            Content={(setModalVisible) => (
                <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
                    <TextInput
                        className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
                        value={id}
                        placeholder="Paste Template Id"
                        placeholderTextColor="#A0A0A0"
                        onChangeText={(text) => setId(text)}
                    />
                    {!vaildId && (
                        <Text className="text-red-500 text-sm text-center mb-4">
                            Invalid ID
                        </Text>
                    )}
                    <View className="flex-row justify-center items-center">
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
                                Cancel
                            </Text>
                        </Pressable>
                        <View className="px-2" />
                        <Pressable
                            onPress={() => saveTemplate(setModalVisible)}
                        >
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        />

        //         <View>
        //             <Pressable
        //                 onPress={() =>
        //                 {
        //                     setModelVisible(true);
        //                     setValidId(true);
        //                 }}
        //             >
        //                 {Icon}
        //             </Pressable>
        //             <Modal
        //                 // className="flex-1 backdrop-brightness-75 justify-center items-center"
        //                 visible={modelVisible}
        //                 transparent={true}
        //             >
        //                 <TouchableWithoutFeedback
        //                     onPress={() => setModelVisible(false)}
        //                 >
        //                     <View className="flex-1 backdrop-brightness-75 justify-center items-center">
        //                         <TouchableWithoutFeedback>
        //                             <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
        //                                 <TextInput
        //                                     className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
        //                                     value={id}
        //                                     placeholder="Paste Template Id"
        //                                     placeholderTextColor="#A0A0A0"
        //                                     onChangeText={(text) => setId(text)}
        //                                 />
        //                                 {!vaildId && (
        //                                     <Text className="text-red-500 text-sm text-center mb-4">
        //                                         Invalid ID
        //                                     </Text>
        //                                 )}
        //                                 <View className="flex-row justify-center items-center">
        //                                     <Pressable
        //                                         onPress={() => setModelVisible(false)}
        //                                     >
        //                                         <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
        //                                             Cancel
        //                                         </Text>
        //                                     </Pressable>
        //                                     <View className="px-2" />
        //                                     <Pressable onPress={() => saveTemplate()}>
        //                                         <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
        //                                             Save
        //                                         </Text>
        //                                     </Pressable>
        //                                 </View>
        //                             </View>
        //                         </TouchableWithoutFeedback>
        //                     </View>
        //                 </TouchableWithoutFeedback>
        //             </Modal>
        //         </View>
    );
}
