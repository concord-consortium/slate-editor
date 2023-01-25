context("Test Slate Editor", () => {
  beforeEach(() => {
    cy.visit("iframe.html?id=slatecontainer--combined");
  });

  describe("Slate Container", () => {
    it("text can be added to it", () => {
      cy.get("[data-testid=ccrte-editor]").type("Hello World");
      cy.get("[data-testid=ccrte-editor]").should("contain", "Hello World");
    });
  });
});