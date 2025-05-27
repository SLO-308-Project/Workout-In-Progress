export interface ValidationResult
{
    isValid: boolean;
    error?: string;
}

export const validateMachineName = (name: string): ValidationResult =>
{
    if (!name || name.trim().length === 0)
    {
        return {
            isValid: false,
            error: "Machine name is required",
        };
    }

    if (!/^[a-zA-Z0-9\s_-]+$/.test(name.trim()))
    {
        return {
            isValid: false,
            error: "Machine name can only contain letters, numbers, spaces, underscores, and hyphens",
        };
    }

    return {
        isValid: true,
    };
};

export const validateMuscleName = (muscle: string): ValidationResult =>
{
    if (!muscle || muscle.trim().length === 0)
    {
        return {
            isValid: false,
            error: "Muscle name is required",
        };
    }

    if (!/^[a-zA-Z\s]+$/.test(muscle.trim()))
    {
        return {
            isValid: false,
            error: "Muscle name can only contain letters and spaces",
        };
    }

    return {
        isValid: true,
    };
};

export const validateAttributeName = (name: string): ValidationResult =>
{
    if (!name || name.trim().length === 0)
    {
        return {
            isValid: false,
            error: "Attribute name is required",
        };
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(name.trim()))
    {
        return {
            isValid: false,
            error: "Attribute name can only contain letters, numbers, and spaces",
        };
    }

    return {
        isValid: true,
    };
};
