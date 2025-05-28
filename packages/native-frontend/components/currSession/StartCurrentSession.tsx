import {FlatList, Pressable, View, Text, TextInput} from "react-native";
import ModalTemplate from "../ModalTemplate";
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
                    <Pressable onPress={startBlank}>
                        <Text className="text-2xl px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg bg-gray-200 hover:bg-gray-300">
                            Create Blank Session
                        </Text>
                    </Pressable>
                    <View className="py-1" />
                    <View className="flex-row text-base px-3 py-1 rounded-xl outline outline-1 outline-gray-300 bg-gray-200">
                        <Text>Templates: </Text>
                        <TextInput
                            placeholder="Search"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#606060"
                        />
                    </View>
                    <View className="max-h-28">
                        <FlatList
                            data={filterTemplates()}
                            renderItem={({item, index}) => (
                                <Pressable
                                    onPress={() => startTemplate(item)}
                                    className="px-1"
                                >
                                    <Text className="pl-3 hover:outline hover:outline-1 rounded-md">
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <Text className="px-1 pl-3 ">No Templates</Text>
                            }
                            className="flex-1 py-1"
                            initialNumToRender={3}
                        />
                    </View>
                </View>
            )}
        />
    );
}
