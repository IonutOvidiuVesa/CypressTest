describe("Add product To bascket and check the removal feature", function () {
    let data;
    before(function () {
        cy.fixture('users').then(function (fData) {
          data = fData;
        })
    })
beforeEach(function() {
    Cypress.Cookies.defaults({
        preserve: "session_id"
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

it("Adding the first element of the list to cart and seing if it is added succesfully" , function () {
    cy.addProductToBasket();
})

it("Checking the remove button functionality of the cart", function(){
    cy.removeProductFromBasket();
})

it("Logging out from user", function(){
    cy.logout();
})

});