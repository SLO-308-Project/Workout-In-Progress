import {FlatList, Pressable, View, Text, TextInput} from "react-native";
import ModalTemplate from "../UtilComponents/ModalTemplate";
import {useTemplateContext} from "@/util/templateContext";
import {useState} from "react";
import {Template} from "@/types/template";

type Props = {
    Icon: JSX.Element;
};

export default function StartCurrentSession({Icon}: Props)
{
    const {templates, setTemplates} = useTemplateContext();
    const [search, setSearch] = useState<string>("");

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
    {}

    function startTemplate(template: Template)
    {}

    return (
        <ModalTemplate
            Icon={Icon}
            Content={(setModalVisible) => (
                <View className="rounded-xl px-4 pt-4 pb-4 bg-white">
                    <Pressable onPress={() => startBlank()}>
                        <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg bg-gray-200">
                            Create Blank Session
                        </Text>
                    </Pressable>
                    <View className="py-1" />
                    <View className="flex-row justify-start items-center px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200">
                        <Text className="text-lg">Templates: </Text>
                        <TextInput
                            className="text-lg"
                            placeholder="Search"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#606060"
                        />
                    </View>
                    <View className="h-28">
                        <FlatList
                            data={filterTemplates()}
                            renderItem={({item, index}) => (
                                <Pressable
                                    onPress={() =>
                                    {
                                        startTemplate(item);
                                    }}
                                    className="px-1 border border-gray-300 rounded-lg"
                                >
                                    <Text className="pl-4 text-lg">
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <Text className="pl-4 pl-3 text-lg ">
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
}
