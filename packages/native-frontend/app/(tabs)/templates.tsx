import {Template} from "@/types/template";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useCallback, useEffect, useRef, useState} from "react";
import {Text, View, StyleSheet, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {SearchBar} from "@rneui/themed";
import {useIsFocused} from "@react-navigation/native";
import TemplateComponent, {
    Empty,
} from "@/components/templates/TemplateComponent";
import {
    fetchDeleteTemplate,
    fetchGetTemplates,
} from "@/fetchers/templateFetchers";
import ImportAsTemplate from "@/components/templates/ImportAsTemplate";
import {useTemplateContext} from "@/util/templateContext";
import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import TemplateSlide from "@/components/templates/TemplateSlide";

const isCypress =
    typeof window !== "undefined" && window.__IS_CYPRESS__ === true;

export default function TemplatesPage()
{
    const {templates, setTemplates} = useTemplateContext(); //useState<Template[]>([]);
    const [search, setSearch] = useState<string>("");

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null,
    );

    const handleOpenSheet = useCallback((session: Template) =>
    {
        setSelectedTemplate(session);
        bottomSheetModalRef.current?.present();
    }, []);

    const isFocused = useIsFocused(); // is true if the screen is focused and false if not.

    useEffect(() =>
    {
        if (isFocused)
        {
            getTemplates();
            for (const t of templates)
            {
                console.log(t.name);
            }
        }
    }, [isFocused]);

    // Returns all templates for the authorized user.
    function getTemplates(): void
    {
        fetchGetTemplates()
            .then((res) =>
            {
                if (res.ok)
                {
                    res.json()
                        .then((json) =>
                        {
                            setTemplates(json);
                        })
                        .catch((err) =>
                        {
                            console.log("Parsing Templates Error: ", err);
                        });
                }
            })
            .catch((err) =>
            {
                console.log("Error Retrieving Templates: ", err);
            });
    }

    // Called on swipe button to remove a template.
    function removeOneTemplate(_id: string): void
    {
        fetchDeleteTemplate(_id)
            .then((res) =>
            {
                if (res.status === 204)
                {
                    //resource deleted
                    setTemplates(
                        templates.filter((template) => template._id !== _id),
                    );
                }
            })
            .catch((err) =>
            {
                console.log("Error deleting Template: ", err);
            });
    }

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

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
                <Text className="text-3xl font-semibold text-black tracking-tight">
                    Templates
                </Text>
                <ImportAsTemplate
                    fromSession={false}
                    Icon={
                        <MaterialCommunityIcons
                            name="import"
                            size={34}
                            color="black"
                        />
                    }
                />
            </View>
            <SearchBar
                containerStyle={styles.containerStyle}
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder="Search"
                onChangeText={setSearch}
                value={search}
                lightTheme
                round
            />
            <FlatList
                data={filterTemplates()}
                renderItem={({item, index}) => (
                    <View testID={`template-item`} key={index}>
                        <TemplateComponent
                            onPress={() =>
                            {
                                handleOpenSheet(item);
                            }}
                            key={index}
                            template={item}
                            handleDelete={removeOneTemplate}
                        />
                    </View>
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                className="flex-1"
                initialNumToRender={isCypress ? 10000 : 10}
            />
            <BottomSheetModal
                ref={bottomSheetModalRef}
                backgroundStyle={{
                    backgroundColor: "#F9F9F9",
                }}
                index={0}
                snapPoints={["90%"]}
                enableDynamicSizing={false}
                enableHandlePanningGesture={true}
                enableContentPanningGesture={false}
                enablePanDownToClose={true}
            >
                <BottomSheetScrollView>
                    <TemplateSlide template={selectedTemplate} />
                </BottomSheetScrollView>
            </BottomSheetModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "#FFF",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainerStyle: {
        backgroundColor: "#F2F2F7",
        height: 35,
    },
    inputStyle: {
        color: "#000",
        fontSize: 16,
    },
});
