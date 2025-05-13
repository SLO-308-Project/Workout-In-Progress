import React, {createContext, useState, useContext, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {login} from "./loginHelper";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) =>
{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() =>
    {
        setIsLoading(false);
    }, []);

    const loginUser = async (email: string, password: string) =>
    {
        const result = await login(email, password);
        if (result)
        {
            setIsAuthenticated(true);
        }
        return result;
    };

    const logoutUser = async () =>
    {
        try
        {
            await AsyncStorage.removeItem("jwtToken");
            setIsAuthenticated(false);
            return;
        }
        catch (error)
        {
            console.error("Error logging out:", error);
            return;
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        login: loginUser,
        logout: logoutUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () =>
{
    const context = useContext(AuthContext);
    if (context === undefined)
    {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
