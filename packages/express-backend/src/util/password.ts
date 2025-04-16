import argon2 from "argon2";

// Hash passwords
export async function hashPassword(plainPassword: string)
{
    try
    {
        return await argon2.hash(plainPassword);
    }
    catch (err)
    {
        console.error("Password hashing failed:", err);
        throw new Error("Password processing failed");
    }
}

// Compare hashed password to plain password for verification
export async function verifyPassword(
    hashPassword: string,
    plainPassword: string,
): Promise<boolean>
{
    try
    {
        return await argon2.verify(hashPassword, plainPassword);
    }
    catch (err)
    {
        console.error("Password verification failed:", err);
        throw new Error("Password verification failed");
    }
}
