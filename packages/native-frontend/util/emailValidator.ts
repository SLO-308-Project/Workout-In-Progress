export interface EmailValidationResult
{
    isValid: boolean;
    error?: string;
}

export const validateEmail = (email: string): EmailValidationResult =>
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
