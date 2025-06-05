import {fetchCurrentSession} from "@/fetchers/currentSessionFetchers";
import {fetchGetMachine} from "@/fetchers/machineFetchers";
import {fetchGetTemplates} from "@/fetchers/templateFetchers";
import {useCurrentSessionStatusContext} from "@/util/currentSessionContext";
import {useMachineContext} from "@/util/machineContext";
import {useTemplateContext} from "@/util/templateContext";
import {Redirect} from "expo-router";
import {useState} from "react";

export default function Index()
{
    const {templates, setTemplates} = useTemplateContext();
    const {machines, setMachines} = useMachineContext();
    const {setCurrentSessionStatus} = useCurrentSessionStatusContext();
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);

    console.log(`Calling Index with hasInitialized: ${hasInitialized}`);
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
                                console.log(`SETUP Templates: ${json}`);
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
                    console.log(`SETUP Machines: ${res_data}`);
                })
                .catch((error: unknown) => console.log(error)),
            // Find if there is a current session.
            fetchCurrentSession()
                .then((res) =>
                {
                    if (res.status === 200)
                    {
                        // has session
                        console.log(
                            "SETUP CurrentSession: Current session present 200",
                        );
                        setCurrentSessionStatus(1);
                    }
                    else if (res.status === 204)
                    {
                        //No session
                        console.log(
                            "SETUP CurrentSession: No Current Session 204",
                        );
                        setCurrentSessionStatus(0);
                    }
                })
                .catch((err: unknown) =>
                {
                    console.log("Error getting current session: ", err);
                    throw new Error(`Error getting current session: ${err}`);
                }),
        ])
            .then(() =>
            {
                console.log(`ALL SETUP:`);
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
