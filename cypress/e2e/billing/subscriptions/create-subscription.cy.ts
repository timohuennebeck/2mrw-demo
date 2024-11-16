import { SubscriptionTier } from "../../../../src/interfaces/SubscriptionTier";
import { TextConstants } from "../../../../src/constants/TextConstants";

describe("subscription flow", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/auth/sign-in");
        cy.get('[data-testid="password-sign-in-toggle"]').should("be.visible").click();

        // login with test credentials
        cy.get('[data-testid="email-input"]')
            .should("be.visible")
            .type("timo.huennebeck+e2e@outlook.de");
        cy.get('[data-testid="password-input"]').should("be.visible").type("JH7pYHEj4#Gzh$X8");
        cy.get('[data-testid="sign-in-button"]').should("be.visible").click();

        // check that the user has been logged in
        cy.contains(TextConstants.TEXT__SIGN_IN_SUCCESSFUL).should("be.visible");
        cy.url().should("include", "/");

        cy.visit("http://localhost:3000/billing");
        cy.url().should("include", "/billing");
    });

    it("should handle monthly subscription plan selection", () => {
        cy.get('[data-testid="monthly-subscription-button"]').should("be.visible").click();
        cy.get('[data-testid="change-subscription-button"]').should("be.disabled");

        const selectedPlan = `[data-testid="subscription-plan-${SubscriptionTier.ESSENTIALS.toLowerCase()}"]`;
        cy.get(selectedPlan).should("be.visible").click();

        cy.get('[data-testid="change-subscription-button"]')
            .should("be.enabled")
            .should("have.text", TextConstants.TEXT__UNLOCK_PLAN);
    });

    it("should handle subscription confirmation popup", () => {
        cy.selectSubscriptionPlan();

        cy.get('[data-testid="change-subscription-button"]').should("be.visible").click();
        cy.get('[data-testid="change-subscription-popup"]').should("be.visible");

        cy.get('[data-testid="custom-popup-primary-button"]')
            .should("be.enabled")
            .should("have.text", TextConstants.TEXT__CONFIRM)
            .click();
    });

    it("should handle successful subscription completion", () => {
        cy.visit("http://localhost:3000/billing?success=true");

        cy.get('[data-testid="subscription-success-popup"]', { timeout: 4000 }).should(
            "be.visible",
        );

        cy.url().should("eq", "http://localhost:3000/billing");

        cy.get('[data-testid="custom-popup-primary-button"]')
            .should("be.visible")
            .should("have.text", TextConstants.TEXT__CONTINUE)
            .click();

        cy.get('[data-testid="subscription-success-popup"]').should("not.exist");
    });
});
