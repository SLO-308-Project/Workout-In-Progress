// app.config.js
require("dotenv").config();

export default {
    expo: {
        name: "native-frontend",
        slug: "native-frontend",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            bundleIdentifier: "com.anonymous.nativefrontend",
            supportsTablet: true,
            ITSAppUsesNonExemptEncryption: false,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.anonymous.nativefrontend",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        // ALL enviroment variables must be added here.
        extra: {
            BACKEND_URL: process.env.EXPO_PUBLIC_API_URL,
            eas: {
                projectId: "96f97430-1ad6-42e6-b17b-dbe6a47f0048",
            },
        },
    },
};
