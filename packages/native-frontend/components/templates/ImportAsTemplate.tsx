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
import ModalTemplate from "../UtilComponents/ModalTemplate";
import {useTemplateContext} from "@/util/templateContext";
import {Template} from "@/types/template";
import {useCurrentSessionStatusContext} from "@/util/currentSessionContext";
import {router} from "expo-router";

type Props = {
    fromSession: boolean;
    Icon: JSX.Element;
};

export default function ImportAsTemplate({fromSession, Icon}: Props)
{
    // const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [vaildId, setValidId] = useState<boolean>(true);
    const [id, setId] = useState<string>("");

    const {templates, setTemplates} = useTemplateContext();
    const {currentSessionStatus} = useCurrentSessionStatusContext();

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
                    return res.json();
                }
                else
                {
                    setValidId(false);
                    console.log(
                        `status ${res.status}: Not Created, but okay, ${res.statusText}`,
                    );
                }
            })
            .then((json: Template) =>
            {
                setTemplates([json, ...templates]);
            })
            .catch((err) =>
            {
                console.log("Error Creating Template: ", err);
            });
    }

    return (
        <ModalTemplate
            Icon={Icon}
            onOpen={() =>
            {}}
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
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200">
                                Cancel
                            </Text>
                        </Pressable>
                        <View className="px-2" />
                        <Pressable
                            onPress={() => saveTemplate(setModalVisible)}
                        >
                            <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200">
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        />
    );
}
