import {fetchCreateTemplate} from "@/fetchers/templateFetchers";
import {useState} from "react";
import {Pressable, View, Text, TextInput} from "react-native";
import ModalTemplate from "../UtilComponents/ModalTemplate";

type Props = {
    id: string;
    fromSession: boolean;
    Icon: JSX.Element;
};

export default function SaveAsTemplate({id, fromSession, Icon}: Props)
{
    // const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [validName, setValidName] = useState<boolean>(true);
    const [templateName, setTemplateName] = useState<string>("");

    function saveTemplate(setModalVisible: (arg0: boolean) => void)
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
                    setModalVisible(false);
                }
                else
                {
                    console.log(
                        `status ${res.status}: Not Created, but okay, ${res.statusText}`,
                    );
                }
            })
            .catch((err) =>
            {
                console.log("Error Creating Template: ", err);
            });
        setModalVisible(false);
    }

    return (
        <ModalTemplate
            Icon={Icon}
            Content={(setModalVisible) => (
                <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
                    <TextInput
                        className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
                        value={templateName}
                        placeholder="Enter Template Name"
                        placeholderTextColor="#A0A0A0"
                        onChangeText={(text) => setTemplateName(text)}
                    />
                    {!validName && (
                        <Text className="text-red-500 text-sm text-center mb-4">
                            Invalid Name
                        </Text>
                    )}
                    <View className="flex-row justify-center items-center">
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 ">
                                Cancel
                            </Text>
                        </Pressable>
                        <View className="px-2" />
                        <Pressable
                            onPress={() => saveTemplate(setModalVisible)}
                        >
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200 ">
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        />
    );
}
