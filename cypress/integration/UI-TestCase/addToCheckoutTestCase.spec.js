describe("Add product To bascket and checkout", function () {
    let data;
    let text;
    before(function () {
        cy.fixture('users').then(function (fData) {
          data = fData;
        })
    })
    before(function () {
        cy.fixture('texts').then(function (fText) {
          text = fText;
        })
    })

it("Visits the Sauce Demo Page and check if we can add first product to basket ...", function () {
    // Visit the Sauce Demo Website
    cy.visit("https://www.saucedemo.com/");
});

it("Login with a standard user", function () {

    // Enter user name and password and click on log-in button
    cy.loginSingle(data.Standard);
    
})

it("Add to checkout and verify the details", function(){
    cy.addProductToBasket();
    cy.checkout(text.firstName, text.lastName, text.zip);
})

it("Logging out from user", function(){
   cy.logout();
})

});