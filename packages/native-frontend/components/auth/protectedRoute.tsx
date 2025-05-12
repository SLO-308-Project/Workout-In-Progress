import React from "react";
import {Redirect} from "expo-router";
import {useAuth} from "@/util/authContext";

type Props = {
    children: React.ReactNode;
};

export default function ProtectedRoute({children}: Props)
{
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading)
    {
        return null;
    }

    if (!isAuthenticated)
    {
        return <Redirect href="/login" />;
    }

    return <>{children}</>;
}
