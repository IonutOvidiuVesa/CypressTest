// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
let selectors;
let message;
    before(function () {
        cy.fixture('selectors').then(function (fData){
          selectors = fData;
        })
        cy.fixture('texts').then(function (fMessage){
            message = fMessage;
          })
    })

Cypress.Commands.add('userValidation', (users) => {
    Object.keys(users).forEach((key) =>{
        cy.get(selectors.userNameField).clear().click();
        cy.get(selectors.userNameField).type(users[key]);
        cy.get(selectors.passwordField).clear().click();
        if(key === 'WrongPass'){
            cy.get(selectors.passwordField).type(message.wrongPassword);
        }else{
            cy.get(selectors.passwordField).type(message.rightPassword);
        }
        cy.get(selectors.loginButton).click();
        if(users[key] === 'wrong_user' || key === 'WrongPass'){
            cy.wrongCredentialsValidation();
        }else if(users[key] === 'locked_out_user'){
            cy.blockedUserValidation();
        }else{
            cy.get(selectors.span).contains(message.products);
            cy.logout();
        }
    })
  })

Cypress.Commands.add('loginSingle', (user) => {
        cy.get(selectors.userNameField).clear().click();
        cy.get(selectors.userNameField).type(user);
        cy.get(selectors.passwordField).clear().click();
        cy.get(selectors.passwordField).type(message.rightPassword);
        cy.get(selectors.loginButton).click();
        cy.get(selectors.span).contains(message.products);
})

Cypress.Commands.add('logout', () => {
    cy.get(selectors.burgerMenu).click();
    cy.get(selectors.logoutButton).click();
    cy.get(selectors.form).find(selectors.userNameField);
})

Cypress.Commands.add('wrongCredentialsValidation', () => {
    cy.get(selectors.div).find(selectors.errorMessage).contains(message.wrongCredential);
})

Cypress.Commands.add('blockedUserValidation', () => {
    cy.get(selectors.form).find(selectors.errorMessage).contains(message.lockedUser);
})

Cypress.Commands.add('addProductToBasket', () => {
    cy.get(selectors.inventoryList).find(selectors.inventoryName).first().invoke('text').as('title')
    cy.get(selectors.inventoryList).find(selectors.itemPrice).first().invoke('text').as('price')
    cy.get(selectors.inventoryList).find(selectors.addToCart).first().click();
    cy.get("#shopping_cart_container").click();
    cy.get('@title').then(text => {
        const article = text;
        cy.get(selectors.cartList).find(selectors.inventoryName).should('have.text', article);
    });
    cy.get('@price').then(text => {
        const price = text;
        cy.get(selectors.cartList).find(selectors.itemPrice).first().should('have.text', price);
    });
})

Cypress.Commands.add('removeProductFromBasket', () => {
    cy.get(selectors.cartList).find("[class = 'btn btn_secondary btn_small cart_button']").first().click();
    cy.get(selectors.cartList).find('div').should('have.class', 'removed_cart_item');
});

Cypress.Commands.add('checkout', (firstName, lastName, zip) => {
    cy.get(selectors.cartFooter).find(selectors.checkoutButton).click();
    cy.get(selectors.checkoutInfo).find(selectors.firstNameField).should('be.visible');
    cy.get(selectors.checkoutInfo).find(selectors.firstNameField).clear()
    cy.get(selectors.checkoutInfo).find(selectors.firstNameField).type(firstName);
    cy.get(selectors.checkoutInfo).find(selectors.lastNameField).clear();
    cy.get(selectors.checkoutInfo).find(selectors.lastNameField).type(lastName);
    cy.get(selectors.checkoutInfo).find(selectors.zipField).clear();
    cy.get(selectors.checkoutInfo).find(selectors.zipField).type(zip);
    cy.get(selectors.checkoutButtonSection).find(selectors.continueButton).click();
    cy.get('@title').then(text => {
        const article = text;
        cy.get(selectors.cartList).find(selectors.inventoryName).should('have.text', article);
    });
    cy.get('@price').then(text => {
        const price = text;
        cy.get(selectors.cartList).find(selectors.itemPrice).first().should('have.text', price);
    });
    cy.get(selectors.summaryInfoSection).find(selectors.summaryValue).first().should('have.text', message.payInfo);
    cy.get(selectors.summaryInfoSection).find(selectors.summaryValue).eq(1).should('have.text', message.shipInfo);
    cy.get(selectors.summaryInfoSection).find(selectors.summaryTax).invoke('text').then(number => +number.replace('Tax: $', '').trim()).as('tax');
    cy.get('@tax').then(number => {
        const tax = number;
        cy.get('@price').then(price => {
            const number = +price.replace('$', '').trim();
            const sum = number + tax;
            cy.get(selectors.summaryInfoSection).find(selectors.totalField).should('have.text', `Total: $${sum}`);
        })
    })
})

Cypress.Commands.add('loginAutomation', function(username, password){
    cy.get("div.header_user_info").find("[class='login']").click();
    cy.get("#login_form").find("div.form-group").find("[data-validate='isEmail']").clear().type(username);
    cy.get("div.form-group").find("[data-validate = 'isPasswd']").clear().type(password);
    cy.get("#SubmitLogin").click();
})

Cypress.Commands.add('landingPageCheckup', function(url){
    cy.visit(url);
    cy.url().should('eq', url);
})

Cypress.Commands.add('loginCheckup', function(email){
    cy.get("ul.myaccount-link-list").find("[title='Information']").should('have.text', "My personal information").click();
    cy.get("div").find("[data-validate='isEmail']").should('have.attr', 'value', email);
});

Cypress.Commands.add('addToBascket', function(){
    cy.get("#block_top_menu").find("[class='submenu-container clearfix first-in-line-xs']").first().trigger('mouseover', {force: true}).find("a").contains('Evening Dresses').click({force: true}); //eq(5)
    cy.get('#center_column').find("ul").find("li").find("div.product-container").find('div.right-block').find('h5').invoke('text').then(text => text.replace(/\s+/g, ' ').trim()).as('dress');
    cy.get('#center_column').find("ul").find("li").find("div.product-container").find('div.right-block').find('div.content_price').invoke('text').then(text => text.replace(/\s+/g, ' ').trim()).as('price');
    cy.get('#center_column').find("ul").find("li").find("div.product-container").find('div.button-container').find('a').contains('Add to cart').click({force: true});
    cy.get('#layer_cart', { timeout: 10000 }).should('be.visible').find('h2').contains('Product successfully added to your shopping cart').then(($div) => {
        expect($div).to.contain.text('Product successfully added to your shopping cart')});
    cy.get('div.layer_cart_row').find('span.ajax_cart_shipping_cost').invoke('text').then(text => text.replace(/\s+/g, ' ').trim()).as('shipping');
    cy.get('#layer_cart').find('div.clearfix').find('span.cross').click();
})

Cypress.Commands.add('logOutMarket', function(){
    cy.get("div.header_user_info").find("[class='logout']").should("have.attr", "title", "Log me out").click();
})

Cypress.Commands.add('logOutCheckUp', function(){
    cy.get("div.header_user_info").then(($div) => {
        expect($div).to.contain.text('Sign in');
    })
})

Cypress.Commands.add('checkoutValidation', function(){
    cy.get('div.shopping_cart').find("b").click()
    cy.get('@dress').then(text =>{
        const name = text;
        cy.get('td.cart_description').find('p.product-name').should('have.text', name);
    })
    cy.get('tr.cart_total_tax').find('#total_tax').invoke('text').then(text => text.replace(/\s+/g, ' ').trim()).as('tax')
    cy.get('@tax').then(number => {
        const tax = +number.replace('$', '').trim();
        cy.get('@price').then(price => {
            const value = +price.replace('$', '').trim();
            cy.get('@shipping').then(shipping => {
                const ship = +shipping.replace('$', '').trim();
                const sum = value + tax + ship;
                cy.get('tr.cart_total_price').find('#total_price_container').then(($div) => {
                    expect($div).to.contain.text(`$${sum}`)});
            })
        })
    })
})

Cypress.Commands.add('removeFirstItem', function(){
    cy.get('div.shopping_cart').find("b").click()
    cy.get('tbody').find('tr').first().find('a.cart_quantity_delete').click();
    cy.get('#order-detail-content', { timeout: 10000 }).should('not.exist');
});

Cypress.Commands.add('signUp', function(email, password){
    cy.get("div.header_user_info").find("[class='login']").click();
    cy.get("#create-account_form").find('#email_create').clear().type(email);
    cy.get('#create-account_form').find('#SubmitCreate').click();
    cy.get('div.account_creation', { timeout: 100000 }).find('#id_gender1').click();
    cy.get('div.account_creation').find('#customer_firstname').clear().type(message.firstName);
    cy.get('div.account_creation').find('#customer_lastname').clear().type(message.lastName);
    cy.get('div.account_creation').find('#passwd').clear().type(password);
    cy.get('div.account_creation').find('#firstname').clear().type(message.firstName);
    cy.get('div.account_creation').find('#lastname').clear().type(message.lastName);
    cy.get('div.account_creation').find('#address1').clear().type(message.address);
    cy.get('div.account_creation').find('#city').clear().type(message.city);
    cy.get('div.account_creation').find('#id_state').select(message.city);
    cy.get('div.account_creation').find('#postcode').clear().type(message.zip);
    cy.get('div.account_creation').find('#phone_mobile').clear().type(message.phone);
    cy.get('#center_column').find("[class = 'submit clearfix']").find('#submitAccount').click();
})

Cypress.Commands.add('setNetwork', function(){
    cy.get('div.css-bafjer').find("[class='css-1qe7ed2']").contains(message.noLogin).should('have.text', message.noLogin);
    cy.get('div.css-bafjer').find("[class='css-n49xvj']").find('button').click();
    cy.get('div.css-1cbjqet').find("[class='css-oxjh1']").should('have.text', message.noPlan);
    cy.get('#selectyourstate').clear().type(message.desiredState);
    cy.get('[role="menuitem"]').should('have.text', message.desiredState).click();
    cy.get("[data-testid='networkYearSelect']").should('have.attr', 'value', message.anticipatedYear);
    cy.get("div").contains("Filter by county").click();
    cy.get("[role='listbox']").find('li').contains(message.desiredDistrict).click();
    cy.get("[class='css-9kn7ot']").contains("Continue").click();
    cy.get('div.css-1fdtnd7').find("[class='css-1n6muco']").find('h1').should('have.text', message.selectNetwork);
    cy.get("[type='radio']").first().check();
    cy.get('div.css-1fdtnd7').find("[class='css-pl6pw4']").contains(message.startButton).click();
})

Cypress.Commands.add('checkUpNetwork', function(){
    cy.get("#client-snackbar").find("[class='css-1tn081x']").should('have.text', message.networkSuccesfullMessage);
})

Cypress.Commands.add('searchService', function(department, location){
    cy.get("div.css-1fdtnd7").find("[class='css-oxjh1']").should('have.text', message.nearByText);
    cy.get("[data-testid='queryInput']").find("[type='text']").clear().type(department)
    cy.get("[field='[object Object]']").find("[data-testid='locationInput']").clear().type(location);
    cy.get("[class='pac-container pac-logo']").find('div').first().click().wait(2000);
    cy.get("[type='submit']").contains('Search').click();
    cy.wait(10000);
})

Cypress.Commands.add('validateResults', function(hits, string){
    cy.url().should('include', string.toLowerCase());
    cy.get("div.css-136vhfi").find("[data-testid='result-count']").then(($div) => {
        expect($div).to.contain(hits);
    })
})

Cypress.Commands.add('validateHits', function(hits){
    cy.get("div.css-136vhfi").find("[data-testid='result-count']").then(($div) => {
        expect($div).to.contain(hits);
    })
})


Cypress.Commands.add('mapMoves', function(){
    cy.get('div.css-18oxkhi').find("[type='checkbox']").check();
    cy.get("[class='gm-style']").trigger('mousedown')
    .trigger('mousemove', { x: 261, y: 0 })
    .trigger('mouseup')
    .wait(500);
    cy.wait(5000);
})


Cypress.Commands.add('advancedSearch', function(speciality, sortBy){
    cy.get("[href='/advanced-search']").should('have.text', 'Advanced Search').click();
    cy.get('div.css-xvtnrf').find('h1').should('have.text', 'Advanced Search');
    cy.get("[data-testid='queryInput']").find("[type='text']").clear().type(speciality);
    cy.get("[role='listbox']").find("[role='menuitem']").contains(speciality).click();
    cy.get("div.css-1isy5ey").find("[class='css-1n6muco']").contains('Submit').click();
    cy.wait(5000);
    cy.validateHits(message.primaryHits)
    cy.get("[data-testid='searchResults']").find("[data-testid='resultMilesAway']").first().invoke('text').as('miles');
    cy.get("div.css-1k4tg43").find('span').contains('Sorted by').click();
    cy.get("[role='menu']").find('li').contains(sortBy).click();
    cy.wait(10000);
    cy.get('@miles').then(text => {
        const miles = text;
        cy.get("[data-testid='searchResults']").find("[data-testid='resultMilesAway']").first().should('not.have.text', miles);
        cy.validateHits(message.primaryHits)
    })
})

Cypress.Commands.add('verifyFirstProfile', function(){
    cy.get("[data-testid='searchResults'").find("[data-testid='signature-link']").first().invoke('text').as('md');
    cy.get("[data-testid='specialties']").first().invoke('text').as('speciality');
    cy.get("[data-testid='searchResults'").find("[class='css-1erqcfs']").contains('View profile').first().click();
    cy.get('@md').then(medic => {
        cy.get('@speciality').then(spec => {
            const name = medic;
            const dep = spec;
            cy.get('div.css-roynbj').find("[data-copytype='provider name']").should('have.text', name);
            cy.get("[data-testid='specialties-list']").should('have.text', dep);
        })
    })
    cy.get("div.css-16idgeo").should('have.text', 'Back').click();
})

Cypress.Commands.add('switchToEnglish', function(){
    cy.get("[data-testid='card-overlay']").contains('Language').click();
    cy.get("[placeholder='Type to filter options...']").eq(1).clear({force: true}).type('English')
    cy.get("[role='button']").contains('English').click();
    cy.get("[data-testid='primaryButton']").eq(3).click({force: true});
    cy.get("[data-testid='searchResults'").find("[class='css-1erqcfs']").contains('View profile').first().click();
    cy.get("[data-copytype='languages spoken']").then(($div) => {
        expect($div).to.contain.text('English')})
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
