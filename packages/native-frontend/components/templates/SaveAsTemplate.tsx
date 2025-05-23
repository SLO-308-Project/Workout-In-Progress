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

type Props = {
    id: string;
    fromSession: boolean;
};

export default function SaveAsTemplate({id, fromSession}: Props)
{
    const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [validName, setValidName] = useState<boolean>(true);
    const [templateName, setTemplateName] = useState<string>("");

    function saveTemplate()
    {
        //Input Validation
        if (templateName.length <= 2)
        {
            setValidName(false);
            return;
        }
        //creates template.
        fetchCreateTemplate(id, templateName, fromSession)
            .then((res) =>
            {
                if (res.status === 201)
                {
                    setModelVisible(false);
                }
                else
                {
                    console.log(`status ${res.status}: Not Created, but okay`);
                }
            })
            .catch((err) =>
            {
                console.log("Error Creating Template: ", err);
            });
    }

    return (
        <View>
            <Pressable
                onPress={() =>
                {
                    setModelVisible(true);
                    setValidName(true);
                }}
            >
                <Feather name="save" size={30} color={"black"} />
            </Pressable>
            <Modal
                // className="flex-1 backdrop-brightness-75 justify-center items-center"
                visible={modelVisible}
                transparent={true}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModelVisible(false)}
                >
                    <View className="flex-1 backdrop-brightness-75 justify-center items-center">
                        <TouchableWithoutFeedback>
                            <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
                                <TextInput
                                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
                                    value={templateName}
                                    placeholder="Enter Template Name"
                                    placeholderTextColor="#A0A0A0"
                                    onChangeText={(text) =>
                                        setTemplateName(text)
                                    }
                                />
                                {!validName && (
                                    <Text className="text-red-500 text-sm text-center mb-4">
                                        Invalid Name
                                    </Text>
                                )}
                                <View className="flex-row justify-center items-center">
                                    <Pressable
                                        onPress={() => setModelVisible(false)}
                                    >
                                        <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
                                            Cancel
                                        </Text>
                                    </Pressable>
                                    <View className="px-2" />
                                    <Pressable onPress={() => saveTemplate()}>
                                        <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 hover:bg-gray-300">
                                            Save
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
