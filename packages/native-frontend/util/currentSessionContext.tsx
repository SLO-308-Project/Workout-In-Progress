import {createContext, useContext, useState} from "react";

type Props = {
    children: JSX.Element;
};

/*
0: No current Session;
1: Yes current Session;
2: Start a new current Session

*/

type CurrentSessionStatusContextType = {
    currentSessionStatus: number;
    setCurrentSessionStatus: (CurrentSessionStatus: number) => void;
};

const CurrentSessionStatusContext = createContext<
    CurrentSessionStatusContextType | undefined
>(undefined);

export const CurrentSessionStatusProvider = ({children}: Props) =>
{
    const [currentSessionStatus, setCurrentSessionStatus] = useState<number>(1);

    return (
        <CurrentSessionStatusContext.Provider
            value={{currentSessionStatus, setCurrentSessionStatus}}
        >
            {children}
        </CurrentSessionStatusContext.Provider>
    );
};

export const useCurrentSessionStatusContext = () =>
{
    const context = useContext(CurrentSessionStatusContext);
    if (!context)
    {
        throw new Error(
            "useCurrentSessionStatusContext must be used within a CurrentSessionStatusProvider",
        );
    }
    return context;
};
