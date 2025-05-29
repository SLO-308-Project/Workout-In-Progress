import {fetchGetMachine} from "@/fetchers/machineFetchers";
import {fetchGetTemplates} from "@/fetchers/templateFetchers";
import {useMachineContext} from "@/util/machineContext";
import {useTemplateContext} from "@/util/templateContext";
import {Redirect} from "expo-router";
import {useState} from "react";

export default function Index()
{
    const {setTemplates} = useTemplateContext();
    const {setMachines} = useMachineContext();
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);

    //Will only run once.
    if (!hasInitialized)
    {
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
            })
            .catch((error: unknown) => console.log(error));
        setHasInitialized(true);
    }

    return <Redirect href="./pastSessions" />;
}
