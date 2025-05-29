import {BACKEND_URL, FRONTEND_URL} from "../support/constants";

/**
 * Feature: User creates a machine
 *
 * Scenario: User creates their machine successfully
 *      GIVEN user on machine creation page
 *      WHEN user enters name
 *      AND muscle
 *      AND attribute
 *      THEN user should be able to add machine
 *      AND redirected to machines page
 *      AND new machine should be present
 *
 * Scenario: User fails to create a machine
 *      GIVEN user on machine creation page
 *      WHEN user enters name
 *      AND muscle
 *      THEN machine should not be added
 *      AND user should be prompted issue (attributes missing)
 *      AND new machine should not be present
 */

describe("User creates a new machine", () =>
{
    context("User creates their machine successfully", () =>
    {
        // User is logged in
        beforeEach(() =>
        {
            let token;
            cy.request("POST", `${BACKEND_URL}/users/login`, {
                email: "cypresstest@gmail.com",
                password: "E2Etesting",
            }).then((response) =>
            {
                if (!response)
                {
                    throw new Error("Unable to login");
                }
                token = response.body;
                return cy.visit(`${FRONTEND_URL}/machines`, {
                    onBeforeLoad: function (window)
                    {
                        window.localStorage.setItem("jwtToken", token);
                    },
                });
            });
        });

        it("GIVEN user on machine creation page", () =>
        {});

        it("WHEN user enters name AND muscle AND attribute", () =>
        {
            cy.visit(`${FRONTEND_URL}/machines`);
            cy.intercept("POST", `${BACKEND_URL}/machines`).as("addMachine");
            cy.get("form").within(() =>
            {
                cy.get('input[name="name"]').type("Test");
            });
        });
    });
});
