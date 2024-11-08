import { TextConstants } from "../../src/constants/TextConstants";

describe("magic link authentication", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-in");
    });

    it("should show error toast when email is empty", () => {
        cy.contains(TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK).should("be.visible").click();
        cy.contains(TextConstants.ERROR__EMAIL_IS_MISSING).should("be.visible");
    });
});
