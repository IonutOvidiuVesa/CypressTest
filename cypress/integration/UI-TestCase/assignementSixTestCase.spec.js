describe("Assignement 6 Test Case", function () {
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

it("Visits the Automation Page and verify its url for matching homepage ...", function () {
    cy.landingPageCheckup(text.landingPage);
});

//the account should be changed each time a test is runned as the accounts can not be deleted from the page
it("Signing up for a new account", function(){
    cy.signUp('test5@automation.qa', text.rightPassword)
    cy.loginCheckup('test5@automation.qa');
    cy.logOutMarket();
    cy.logOutCheckUp();
})

it("Login with a custom user", function () {
    cy.loginAutomation('test5@automation.qa', text.rightPassword);
})

it("Check log-in succesfull of email", function(){
    cy.loginCheckup('test5@automation.qa');
})

it("Add first item to basket and check contents of basket", function(){
    cy.addToBascket();
    cy.checkoutValidation();
})

it("Remove the dress and check-up if cart is empty", function(){
    cy.removeFirstItem();
})

it("Log out from app and check-up", function(){
    cy.logOutMarket();
    cy.logOutCheckUp();
})
});