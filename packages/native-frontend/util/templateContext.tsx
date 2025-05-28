import {Template} from "@/types/template";
import {createContext, useContext, useState} from "react";

type Props = {
    children: JSX.Element;
};

type TemplateContextType = {
    templates: Template[];
    setTemplates: (templates: Template[]) => void;
};

const TemplateContext = createContext<TemplateContextType | undefined>(
    undefined,
);

export const TemplateProvider = ({children}: Props) =>
{
    const [templates, setTemplates] = useState<Template[]>([]);

    return (
        <TemplateContext.Provider value={{templates, setTemplates}}>
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplateContext = () =>
{
    const context = useContext(TemplateContext);
    if (!context)
    {
        throw new Error(
            "useTemplateContext must be used within a templateProvider",
        );
    }
    return context;
};
