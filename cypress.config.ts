import {defineConfig} from "cypress";

export default defineConfig({
    projectId: "mj6th7",
    e2e: {
        setupNodeEvents(on, config)
        {
            // implement node event listeners here
        },
        specPattern: "cypress/e2e/*.{ts, tsx}",
        defaultCommandTimeout: 10000,
    },
});
