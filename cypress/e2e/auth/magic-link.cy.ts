import { TextConstants } from "../../../src/constants/TextConstants";

describe("magic link authentication", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-in");
    });

    describe("error flows", () => {
        it("should show error message when email is missing", () => {
            cy.get("button")
                .contains(TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK)
                .should("be.visible")
                .click();
            cy.contains(TextConstants.ERROR__EMAIL_IS_MISSING).should("be.visible");
        });

        it("should show error message when email is invalid", () => {
            cy.get("input[name='email']").should("be.visible").type("invalid-email");
            cy.get("button")
                .contains(TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK)
                .should("be.visible")
                .click();
            cy.contains(TextConstants.ERROR__INVALID_EMAIL).should("be.visible");
        });
    });

    describe("success flows", () => {
        it("should show success message when email has been sent", () => {
            cy.get("input[name='email']").should("be.visible").type("example@example.com");
            cy.get("button")
                .contains(TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK)
                .should("be.visible")
                .click();
            cy.contains(TextConstants.TEXT__MAGIC_LINK_SENT).should("be.visible");
        });
    });
});
