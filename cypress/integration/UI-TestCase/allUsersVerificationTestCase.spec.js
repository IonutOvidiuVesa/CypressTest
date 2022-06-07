describe("Title Contains Product For Each User", function () {
    let data;
    before(function () {
        cy.fixture('users').then(function (fData) {
          data = fData;
        })
    })

it("Visits the Sauce Demo Page and check the presence of products for multiple users ...", function () {

    // Visit the Sauce Demo Website
    cy.visit("https://www.saucedemo.com/");
});

it("Verifing the login of the standard User", function () {

    // Enter user name and password and click on log-in button
    cy.userValidation({"username" : data.Standard});

})

it("Verifying the login of the problem User", function() {

     cy.userValidation({"username" : data.Problem});

})

it("Verifying the login of the performance User", function() {

    cy.userValidation({"username" : data.Performance});

})

it("Verifying the login of the wrong User", function() {

    cy.userValidation({"username" : data.WrongUser});

})

it("Verifying the login of the wrong password", function() {

    cy.userValidation({"WrongPass" : data.WrongPass});

})

it("Verifying the login of the locked User", function() {

    cy.userValidation({"username" : data.Locked});

})

});