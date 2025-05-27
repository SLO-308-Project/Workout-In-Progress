export interface PasswordValidationResult
{
    isValid: boolean;
    errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult
{
    const errors: string[] = [];

    if (!password)
    {
        errors.push("Password is required");
        return {isValid: false, errors};
    }

    if (password.length < 8)
    {
        errors.push("Password must be at least 8 characters long");
    }

    if (!/[a-z]/.test(password))
    {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password))
    {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password))
    {
        errors.push("Password must contain at least one number");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
