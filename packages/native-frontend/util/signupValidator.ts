export interface ValidationResult
{
    isValid: boolean;
    error?: string;
}

export const validateUsername = (username: string): ValidationResult =>
{
    if (!username || username.trim().length === 0)
    {
        return {
            isValid: false,
            error: "Username is required",
        };
    }

    return {
        isValid: true,
    };
};

export const validateEmail = (email: string): ValidationResult =>
{
    if (!email || email.trim().length === 0)
    {
        return {
            isValid: false,
            error: "Email is required",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim()))
    {
        return {
            isValid: false,
            error: "Please enter a valid email address",
        };
    }

    return {
        isValid: true,
    };
};

export const validatePassword = (password: string): ValidationResult =>
{
    if (!password || password.length === 0)
    {
        return {
            isValid: false,
            error: "Password is required",
        };
    }

    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber)
    {
        return {
            isValid: false,
            error: "Password does not meet requirements",
        };
    }

    return {
        isValid: true,
    };
};
