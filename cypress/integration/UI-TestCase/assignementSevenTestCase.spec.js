describe("Assignement 7 Test Case", function () {
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
    cy.landingPageCheckup(text.guideLink);
})

it("Set-up the pages network ...", function () {
    cy.setNetwork();
    cy.checkUpNetwork();
})

it("Search for Dermatology in Florida, USA ...", function() {
    cy.searchService(text.department, text.desiredState);
})

it("Validate the results of search ...", function() {
    cy.validateResults(text.noOfHits, text.department);
})

it("Toggle the search as map moves and verify result change", function(){
    cy.mapMoves();
    cy.validateHits(text.newHits);
})

it("Go to advanced search and check the results for Primary Care Provider, and filtered by distance", function(){
    cy.advancedSearch(text.speciality, text.sorting);
})

it("Check the result profile of first entry", function(){
    cy.verifyFirstProfile();
})

it("Filter by English spoken practices", function(){
    cy.switchToEnglish();
})

})