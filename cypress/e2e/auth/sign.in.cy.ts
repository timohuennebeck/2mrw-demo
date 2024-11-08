import { TextConstants } from "../../../src/constants/TextConstants";

describe("magic link authentication", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-in");
        cy.get('[data-testid="password-sign-in-toggle"]').should("be.visible").click();
    });

    describe("error flows", () => {
        it("should show error message when email is missing", () => {
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__EMAIL_IS_MISSING).should("be.visible");
        });

        it("should show error message when email is invalid", () => {
            cy.get('[data-testid="email-input"]').should("be.visible").type("invalid-email");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__INVALID_EMAIL).should("be.visible");
        });

        it("should show error message when email is missing but password is present", () => {
            cy.get('[data-testid="password-input"]').should("be.visible").type("password");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__EMAIL_IS_MISSING).should("be.visible");
        });

        it("should show error message when password is missing but email is present", () => {
            cy.get('[data-testid="email-input"]').should("be.visible").type("example@example.com");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.ERROR__PASSWORD_IS_MISSING).should("be.visible");
        });

        it("should show error message when email and password are invalid", () => {
            cy.get('[data-testid="email-input"]').should("be.visible").type("example@example.com");
            cy.get('[data-testid="password-input"]').should("be.visible").type("invalid-password");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.TEXT__INVALID_CREDENTIALS).should("be.visible");
        });
    });

    describe("success flows", () => {
        it("shoud login user with credentials", () => {
            cy.get('[data-testid="email-input"]')
                .should("be.visible")
                .type("timo.huennebeck+e2e@outlook.de");
            cy.get('[data-testid="password-input"]').should("be.visible").type("JH7pYHEj4#Gzh$X8");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.TEXT__SIGN_IN_SUCCESSFUL).should("be.visible");
            cy.url().should("include", "/");
        });
    });
});
