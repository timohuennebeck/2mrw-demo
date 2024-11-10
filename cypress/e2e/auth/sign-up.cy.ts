import { TextConstants } from "../../../src/constants/TextConstants";

describe("sign up", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-up");
    });

    it("check if sign in navigation is working", () => {
        cy.get('[data-testid="signup-toggle"]').should("be.visible").click();
        cy.url().should("include", "/auth/sign-in");
    });

    describe("error flows", () => {
        it("should show error message when first name is missing", () => {
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__FIRST_NAME_IS_MISSING).should("be.visible");
        });

        it("should show error message when email is missing", () => {
            cy.get('[data-testid="first-name-input"]').should("be.visible").type("Timo");
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__EMAIL_IS_MISSING).should("be.visible");
        });

        it("should show error message when email is invalid", () => {
            cy.get('[data-testid="email-input"]').should("be.visible").type("invalid-email");
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__INVALID_EMAIL).should("be.visible");
        });

        it("should show error message when password is missing", () => {
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__PASSWORD_IS_MISSING).should("be.visible");
        });

        it("should show email already in use message", () => {
            cy.get('[data-testid="first-name-input"]').should("be.visible").type("Timo");
            cy.get('[data-testid="email-input"]')
                .should("be.visible")
                .type("timo.huennebeck+e2e@outlook.de");
            cy.get('[data-testid="password-input"]').should("be.visible").type("password");
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__EMAIL_ALREADY_IN_USE).should("be.visible");
        });

        it("should show password is too weak message", () => {
            cy.get('[data-testid="first-name-input"]').should("be.visible").type("Timo");
            cy.get('[data-testid="email-input"]').should("be.visible").type("example@example.com");
            cy.get('[data-testid="password-input"]').should("be.visible").type("123456");
            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains("Password should contain at least one character of each").should(
                "be.visible",
            );
        });
    });

    it("should show password strength checker when focused", () => {
        cy.get('[data-testid="password-input"]').should("be.visible").focus();
        cy.get('[data-testid="password-strength-checker"]').should("be.visible");
    });

    it("should show password when clicking on icon", () => {
        cy.get('[data-testid="password-input"]')
            .should("have.attr", "type", "password")
            .type("password");

        cy.get('[data-testid="password-toggle"]').should("be.visible").click();
        cy.get('[data-testid="password-input"]')
            .should("have.attr", "type", "text")
            .should("have.value", "password");

        cy.get('[data-testid="password-toggle"]').should("be.visible").click();
        cy.get('[data-testid="password-input"]')
            .should("have.attr", "type", "password")
            .should("have.value", "password");
    });

    describe("success flow", () => {
        it.only("should show success message when signing up", () => {
            cy.get('[data-testid="first-name-input"]').should("be.visible").type("Timo");

            const randomlyGeneratedEmail = `example${Math.random().toString(36).substring(2, 15)}@example.com`;
            cy.get('[data-testid="email-input"]').should("be.visible").type(randomlyGeneratedEmail);

            const randomlyGeneratedPassword = `${Math.random().toString(36).substring(2, 15)}Hg1`;
            cy.get('[data-testid="password-input"]')
                .should("be.visible")
                .type(randomlyGeneratedPassword);

            cy.get('[data-testid="sign-up-button"]').should("be.visible").click();
            cy.contains(TextConstants.TEXT__SIGNUP_CONFIRMATION_SENT).should("be.visible");

            cy.contains(TextConstants.TEXT__DIDNT_RECEIVE_EMAIL, { timeout: 5000 }).should(
                "be.visible",
            );
        });
    });
});
