import { SubscriptionTier } from "@/enums/subscription";


Cypress.Commands.add("selectSubscriptionPlan", () => {
    cy.get('[data-testid="monthly-subscription-button"]').should("be.visible").click();
    const selectedPlan = `[data-testid="subscription-plan-${SubscriptionTier.ESSENTIALS.toLowerCase()}"]`;
    cy.get(selectedPlan).should("be.visible").click();
});
