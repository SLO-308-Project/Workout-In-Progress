import {FlatList, Pressable, View, Text, TextInput} from "react-native";
import ModalTemplate from "../UtilComponents/ModalTemplate";
import {useTemplateContext} from "@/util/templateContext";
import {useState} from "react";
import {Template} from "@/types/template";
import {router, useRouter} from "expo-router";
import {useCurrentSessionStatusContext} from "@/util/currentSessionContext";

type Props = {
    Icon: JSX.Element;
};

export default function StartCurrentSession({Icon}: Props)
{
    const {currentSessionStatus, setCurrentSessionStatus} =
        useCurrentSessionStatusContext();
    const {templates} = useTemplateContext();
    const [search, setSearch] = useState<string>("");

    const router = useRouter();

    // Called to give the data for FlatList.
    function filterTemplates(): Template[]
    {
        if (search === "")
        {
            return templates;
        }
        else
        {
            return templates.filter((template: Template) =>
            {
                return template.name
                    .toLowerCase()
                    .includes(search.toLowerCase());
            });
        }
    }

    function startBlank()
    {
        if (currentSessionStatus === 1)
        {
            // re route if session already started.
            router.push("/(tabs)/currSession");
        }
        else
        {
            setCurrentSessionStatus(2); // 3 == starting session
            router.push({
                pathname: "/(tabs)/currSession",
            });
        }
    }

    function startTemplate(template: Template)
    {
        if (currentSessionStatus === 1)
        {
            //re route if session already started.
            router.push("/(tabs)/currSession");
        }
        else
        {
            setCurrentSessionStatus(2); // 3 == starting session
            router.push({
                pathname: "/(tabs)/currSession",
                params: {
                    startTemplate_id: template._id,
                },
            });
        }
    }

    // if (currentSessionStatus === 1){
    //     router.push("/(tabs)/currSession");
    //     return null;
    // }
    // else {
    return (
        <ModalTemplate
            Icon={Icon}
            onOpen={(setModalVisible) =>
            {
                console.log("CurrentSessionStatus: ", currentSessionStatus);
                if (currentSessionStatus === 1)
                {
                    router.push("/(tabs)/currSession");
                    setModalVisible(false);
                }
            }}
            Content={(setModalVisible) => (
                <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
                    <Pressable
                        onPress={() =>
                        {
                            setModalVisible(false);
                            startBlank();
                        }}
                    >
                        <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg bg-gray-200">
                            Create Blank Session
                        </Text>
                    </Pressable>
                    <View className="py-1" />
                    <View className="flex-row justify-start items-center px-3 rounded-xl outline outline-1 outline-gray-300 bg-gray-200">
                        <Text className="text-xl">Templates: </Text>
                        <TextInput
                            className="text-xl"
                            placeholder="Search"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#606060"
                        />
                    </View>
                    <View className="h-32">
                        <FlatList
                            data={filterTemplates()}
                            renderItem={({item, index}) => (
                                <Pressable
                                    onPress={() =>
                                    {
                                        setModalVisible(false);
                                        startTemplate(item);
                                    }}
                                    className="px-1 border border-gray-300 rounded-lg"
                                >
                                    <Text className="pl-4 text-xl">
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <Text className="pl-4 text-lg ">
                                    No Templates
                                </Text>
                            }
                            className="flex-1 py-1"
                        />
                    </View>
                </View>
            )}
        />
    );
    // }
}
