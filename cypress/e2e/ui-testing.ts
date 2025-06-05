import {FRONTEND_URL, BACKEND_URL} from "../support/constants";

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
            cy.visit(`${FRONTEND_URL}/login`).as("login");
            cy.get(".css-textinput-11aywtz.mb-4").click();
            cy.wait(500);
            cy.get(".css-textinput-11aywtz.mb-4").type("cypresstest@gmail.com");
            cy.get(".mb-6").type("E2Etesting");
            cy.contains("Login").click();
        });

        it("GIVEN user on machine creation page", () =>
        {});

        // Combined WHEN AND THEN since app must be navigated through buttons
        it("WHEN user enters name AND muscle AND attribute", () =>
        {
            // Navigate to machines page
            let machinesLength;
            cy.contains("Machines").click();
            cy.get('[data-testid="machine-item"]').then((items) =>
            {
                machinesLength = items.length;
                cy.log(`There are ${machinesLength} machines in the list`);
            });

            // Enters name and muscle since attribute is added by default
            cy.get(
                '[style="z-index: 0;"] > [style="background-color: rgb(242, 242, 242);"] > .r-flex-13awgt0 > .flex-1.pt-4 > .flex-row > .css-view-175oi2r > .css-text-146c3p1',
            ).click();
            cy.get(".w-80").type("Machine");
            cy.get(".flex-1 > .w-40").type("Muscle");
            cy.intercept("POST", `${BACKEND_URL}/machines`).as("addedMachine");
            cy.get(
                ".r-justifyContent-17s6mgv > .css-view-175oi2r > .css-text-146c3p1",
            ).click();
            cy.wait("@addedMachine", {timeout: 15000});
            cy.get(
                ".r-flex-13awgt0.r-flexDirection-18u37iz > :nth-child(2) > .r-touchAction-1otgn73",
            ).click();
            cy.wait(500);
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();

            // THEN new machine with Muscle and Machine
            cy.get('[data-testid="machine-item"]').should((items) =>
            {
                expect(items.length).to.be.equal(machinesLength + 1);
            });
            cy.log("THEN new machine should be present (length increased)");
            cy.get('[data-testid="machine-item"]')
                .last()
                .should("contain", "Machine");
            cy.log("AND name is input");
            cy.get('[data-testid="machine-item"]')
                .last()
                .should("contain", "Muscle");
            cy.log("AND muscle is input");
        });
    });

    context("User fails to create machine", () =>
    {
        // User is logged in
        beforeEach(() =>
        {
            cy.visit(`${FRONTEND_URL}/login`).as("login");
            cy.get(".css-textinput-11aywtz.mb-4").click();
            cy.wait(500);
            cy.get(".css-textinput-11aywtz.mb-4").type("cypresstest@gmail.com");
            cy.get(".mb-6").type("E2Etesting");
            cy.contains("Login").click();
        });

        it("GIVEN user on machine creation page", () =>
        {});

        // Combined WHEN AND THEN since app must be navigated through buttons
        it("WHEN user enters name AND muscle", () =>
        {
            // Navigate to machines page
            let machinesLength;
            cy.contains("Machines").click();
            cy.get('[data-testid="machine-item"]').then((items) =>
            {
                machinesLength = items.length;
                cy.log(`There are ${machinesLength} machines in the list`);
            });

            // Enters name and muscle
            cy.get(
                '[style="z-index: 0;"] > [style="background-color: rgb(242, 242, 242);"] > .r-flex-13awgt0 > .flex-1.pt-4 > .flex-row > .css-view-175oi2r > .css-text-146c3p1',
            ).click();
            cy.get(".w-80").type("Machine2");
            cy.get(".flex-1 > .w-40").type("Non");

            // Remove attributes
            cy.get('[data-testid="attribute-item"]')
                .first()
                .find('[data-testid="attribute-delete"]')
                .click();
            cy.get('[data-testid="attribute-item"]')
                .first()
                .find('[data-testid="attribute-delete"]')
                .click();
            cy.get(
                ".r-justifyContent-17s6mgv > .css-view-175oi2r > .css-text-146c3p1",
            ).click();

            // THEN machine should not be added
            // AND user should be prompted issue (attributes missing)
            // AND new machine should not be present
            cy.log("THEN error prompt for attribute");
            cy.get(
                ".r-WebkitOverflowScrolling-150rngu > :nth-child(1) > .flex-1 > .css-text-146c3p1",
            ).contains("You must have at least 1 attribute.");
            cy.get(
                ".r-justifyContent-1h0z5md > .r-touchAction-1otgn73",
            ).click();
            cy.log("AND machine should not be added");
            cy.get('[data-testid="machine-item"]').then((items) =>
            {
                expect(items.length).to.be.equal(machinesLength);
                cy.log("THEN new machine not should be present (length same)");
            });
            cy.log("AND new machine should not be present");
            cy.get('[data-testid="machine-item"]')
                .last()
                .should("not.contain", "Machine2");
            cy.get('[data-testid="machine-item"]')
                .last()
                .should("not.contain", "Non");
        });
    });
});

/**
 * Feature: User saves a session as a template
 *
 * Scenario: User creates the template successfully
 *      GIVEN user on session page
 *      AND user has a session
 *      WHEN user saves session (button)
 *      AND enters a name
 *      THEN template should be added
 *
 * Scenario: User creates the template unsuccessfully
 *      GIVEN user on session page
 *      AND user has a session
 *      WHEN user saves session (button)
 *      THEN template should not be added
 *      AND warning for invalid name
 */
describe("User saves a session as a template", () =>
{
    context("User creates the template successfully", () =>
    {
        // User is logged in
        beforeEach(() =>
        {
            cy.visit(`${FRONTEND_URL}/login`).as("login");
            cy.get(".css-textinput-11aywtz.mb-4").click();
            cy.wait(500);
            cy.get(".css-textinput-11aywtz.mb-4").type("cypresstest@gmail.com");
            cy.get(".mb-6").type("E2Etesting");
            cy.contains("Login").click();
        });

        it("GIVEN user on session page", () =>
        {});

        it("WHEN user clicks save button AND enter name", () =>
        {
            // Save Session
            cy.get(
                ".items-center > :nth-child(2) > .css-view-175oi2r > .css-text-146c3p1",
            ).click();
            cy.get(".css-textinput-11aywtz").type("SESSION COPY");
            cy.intercept("POST", `${BACKEND_URL}/templates`).as("saveTemplate");
            cy.get(":nth-child(3) > .css-text-146c3p1").click();
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();

            let templateLength;
            cy.get('[data-testid="template-item"]').then((items) =>
            {
                templateLength = items.length;
                cy.log(`There is ${templateLength} template items`);
            });

            cy.wait("@saveTemplate", {timeout: 15000});
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();
            cy.wait(500);
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();

            // Template should be added
            cy.log("THEN template should be added");
            cy.get('[data-testid="template-item"]').should((items) =>
            {
                expect(items.length).to.be.greaterThan(templateLength);
            });
            cy.get('[data-testid="template-item"]')
                .last()
                .should("contain", "SESSION COPY");
        });
    });

    context("User creates the template unsuccessfully", () =>
    {
        // User is logged in
        beforeEach(() =>
        {
            cy.visit(`${FRONTEND_URL}/login`).as("login");
            cy.get(".css-textinput-11aywtz.mb-4").click();
            cy.wait(500);
            cy.get(".css-textinput-11aywtz.mb-4").type("cypresstest@gmail.com");
            cy.get(".mb-6").type("E2Etesting");
            cy.contains("Login").click();
        });

        it("GIVEN user on session page", () =>
        {});

        it("WHEN user clicks save button", () =>
        {
            // Get info to ensure template list did not increase
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();
            let templateLength;
            cy.get('[data-testid="template-item"]').then((items) =>
            {
                templateLength = items.length;
                cy.log(`There is ${templateLength} template items`);
            });
            cy.get(
                ".r-flex-13awgt0.r-flexDirection-18u37iz > :nth-child(2) > .r-touchAction-1otgn73",
            ).click();
            cy.get(
                ".p-4 > .items-center > :nth-child(2) > .css-view-175oi2r > .css-text-146c3p1",
            ).click();
            cy.get(":nth-child(3) > .css-text-146c3p1").click();

            // Then warning for invalid name AND template should not be added
            cy.log("THEN warning for invalid name");
            cy.get(".text-red-500").contains("Invalid Name");
            cy.contains("Cancel").should("be.visible").click({force: true});
            cy.get(":nth-child(5) > .r-touchAction-1otgn73").click();
            cy.log("AND template should not be added");
            cy.get('[data-testid="template-item"]').then((items) =>
            {
                expect(items.length).equals(templateLength);
            });
        });
    });
});
