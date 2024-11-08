import { TextConstants } from "../../../src/constants/TextConstants";

describe("magic link authentication", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-in");
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
    });

    describe("success flows", () => {
        it("should show success message when email has been sent", () => {
            cy.get('[data-testid="email-input"]').should("be.visible").type("example@example.com");
            cy.get('[data-testid="sign-in-button"]').should("be.visible").click();
            cy.contains(TextConstants.TEXT__MAGIC_LINK_SENT).should("be.visible");
        });
    });
});
