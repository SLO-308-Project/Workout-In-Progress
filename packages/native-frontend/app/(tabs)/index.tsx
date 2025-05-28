// import { Text, View } from 'react-native';
import {fetchGetTemplates} from "@/fetchers/templateFetchers";
import {useTemplateContext} from "@/util/templateContext";
import {Redirect} from "expo-router";

export default function Index()
{
    //Setup all data needed.
    const {templates, setTemplates} = useTemplateContext();
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

    return <Redirect href="./pastSessions" />;
}
