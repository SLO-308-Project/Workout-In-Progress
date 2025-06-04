export {};

declare global
{
    interface Window
    {
        __IS_CYPRESS__?: boolean;
    }
}
