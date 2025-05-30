import {fetchGetMachine} from "@/fetchers/machineFetchers";
import {fetchGetTemplates} from "@/fetchers/templateFetchers";
import {useMachineContext} from "@/util/machineContext";
import {useTemplateContext} from "@/util/templateContext";
import {Redirect} from "expo-router";
import {useState} from "react";

export default function Index()
{
    const {templates, setTemplates} = useTemplateContext();
    const {machines, setMachines} = useMachineContext();
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);

    //Will only run once.
    if (!hasInitialized)
    {
        Promise.all([
            // Populate Templates.
            fetchGetTemplates()
                .then((res) =>
                {
                    if (res.status === 200)
                    {
                        res.json()
                            .then((json) =>
                            {
                                setTemplates(json);
                                console.log("SETUP: " + templates);
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
                }),
            // Populate Machines.
            fetchGetMachine()
                .then((res: Response) =>
                {
                    if (res.ok)
                    {
                        return res.json();
                    }
                })
                .then((res_data) =>
                {
                    setMachines(res_data);
                    console.log("SETUP: " + machines);
                })
                .catch((error: unknown) => console.log(error)),
        ])
            .then(() =>
            {
                setHasInitialized(true);
                return <Redirect href="./pastSessions" />;
            })
            .catch((err) =>
            {
                console.log("index initialization error: " + err);
            });
    }
    else
    {
        return <Redirect href="./pastSessions" />;
    }
}
