import {BACKEND_URL} from "../support/constants";
/**
 * Feature: BACKEND (REST API) is listening
 * Scenario: Backend loads and runs successfully
 *      GIVEN I run the backend
 *      WHEN I visit the root endpoint
 *      THEN it does not smoke
 *      AND returns "Hello World"
 *      AND the response code is 200
 */

describe("Backend (REST API) is listening", () =>
{
    context("Backend loads and runs successfully", () =>
    {
        before(() =>
        {});
    });

    it("Given I run the backend", () =>
    {});

    it("When I visit the root endpoint", () =>
    {
        cy.request(`${BACKEND_URL}`).then((response) =>
        {
            assert.isNotNull(response.body, "THEN it does not smoke");
            assert.equal(
                response.body,
                "Hello World",
                'AND returns "Hello World',
            );
            assert.equal(response.status, 200, "AND the response code is 200");
        });
    });
});

/**
 * Feature: API allows a user to login and returns appropiate token
 *
 * Scenario: Successful Login
 *      GIVEN user has valid creditionals
 *      AND user has filled fields (email and password)
 *      WHEN I attempt to login
 *      THEN I receive a successful response (code 200)
 *      AND the response contains a token
 *
 * Scenario: Unsuccessful Login
 *      GIVEN user has invalid creditionals
 *      AND user has filled fields (email and password)
 *      WHEN I attempt to login
 *      THEN I receive a unsuccessful response (code 401)
 *      AND there unathorized response
 */

describe("API allows a user to login and returns appropiate token", () =>
{
    context("Successful login", () =>
    {
        before(() =>
        {});

        let user = {};
        it("GIVEN user has valid creditionals AND user has filled fields (email and password)", () =>
        {
            user = {
                email: "cypresstest@gmail.com",
                password: "E2Etesting",
            };
        });

        it("WHEN I attempt to login", () =>
        {
            cy.request("POST", `${BACKEND_URL}/users/login`, user).then(
                (response) =>
                {
                    assert.equal(
                        response.status,
                        200,
                        "THEN I receive a successful response (code 200)",
                    );
                    Cypress.env("jwtToken", response.body);
                    assert.exists(
                        response.body,
                        "AND the response object contains the token",
                    );
                },
            );
        });
    });

    context("Unsuccessful login", () =>
    {
        before(() =>
        {});

        let user = {};
        it("GIVEN user has invalid creditionals AND user has filled fields (email and password)", () =>
        {
            user = {
                email: "x",
                password: "y",
            };
        });

        it("WHEN I attempt to login", () =>
        {
            cy.request({
                method: "POST",
                url: `${BACKEND_URL}/users/login`,
                body: user,
                failOnStatusCode: false,
            }).then((response) =>
            {
                assert.equal(
                    response.status,
                    401,
                    "THEN I receive a unsuccessful response (code 401)",
                );
                assert.equal(
                    response.body,
                    "Unauthorized",
                    "AND the unauthorized response",
                );
            });
        });
    });
});

/**
 * Feature: API Copy an existing template object
 *
 * Scenario: Copies an existing template successfully
 *      GIVEN source template exists
 *      AND correct template id
 *      WHEN I attempt to post the copy
 *      THEN I receive a successful response (code 201)
 *      AND response object contains the template
 *
 * Scenario: Copies non existing template unsuccessfully
 *      GIVEN incorrect template id
 *      WHEN I attempt to post the copy
 *      THEN I receive a unsuccessful response (code 404)
 *      AND template not found error
 */

describe("API copy an existing template object", () =>
{
    context("Copies an existing template successfully", () =>
    {
        let reqHeader;
        before(() =>
        {
            reqHeader = {
                authorization: `Bearer ${Cypress.env("jwtToken")}`,
            };
        });

        let reqBody = {
            fromSession: "false",
            id: "",
            name: "E2E New",
        };
        it("GIVEN source template exists AND correct template id", () =>
        {
            reqBody.id = "6837b777cccd89d0a4a1040c";
        });

        it("WHEN I attempt to post the copy", () =>
        {
            cy.request({
                method: "POST",
                url: `${BACKEND_URL}/templates`,
                body: reqBody,
                headers: reqHeader,
            }).then((response) =>
            {
                assert.equal(
                    response.status,
                    201,
                    "THEN I receive a successful response (code 201)",
                );
                assert.exists(
                    response.body,
                    "AND the response object contains the template",
                );
            });
        });
    });

    context("Copies non existing template unsuccessfully", () =>
    {
        let reqHeader;
        before(() =>
        {
            reqHeader = {
                authorization: `Bearer ${Cypress.env("jwtToken")}`,
            };
        });

        let reqBody = {
            fromSession: "false",
            id: "",
            name: "E2E New",
        };
        it("GIVEN incorrect template id", () =>
        {
            // Random object id that shouldn't exist
            reqBody.id = "665625d3e2d7e45baf12a9e3";
        });

        it("WHEN I attempt to post the copy", () =>
        {
            cy.request({
                method: "POST",
                url: `${BACKEND_URL}/templates`,
                body: reqBody,
                headers: reqHeader,
                failOnStatusCode: false,
            }).then((response) =>
            {
                assert.equal(
                    response.status,
                    404,
                    "THEN I receive a unsuccessful response (code 404)",
                );
                assert.equal(
                    response.body,
                    "No user templates found",
                    "AND the template not found error",
                );
            });
        });
    });
});
