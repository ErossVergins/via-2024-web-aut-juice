import { HomePage } from "../pageObjects/HomePage";

describe("Juice-shop scenarios", () => {
  context("Without auto login", () => {
    beforeEach(() => {
      HomePage.visit();
      HomePage.dismissButton.click();
      HomePage.meWantItButton.click();
    });

    it("Login", () => {
      // Click Account button
      cy.get('#navbarAccount').click();

      // Click Login button
      cy.get('#navbarLoginButton').click();

      // Set email value to "demo"
      cy.get('#email').type('demo');

      // Set password value to "demo"
      cy.get('#password').type('demo');

      // Click Log in
      cy.get('#loginButton').click();

      // Click Account button again
      cy.get('#navbarAccount').click();

      // Validate that "demo" account name appears in the menu section
      cy.get('.mat-menu-item.ng-tns-c129-2').should('contain', 'demo');
    });

    it("Registration", () => {
      // Click Account button
      cy.get('#navbarAccount').click();

      // Click Login button
      cy.get('#navbarLoginButton').click();

      // Click "Not yet a customer?"
      cy.contains('Not yet a customer?').click();

      // Generate a random number
      const randomNumber = Math.floor(Math.random() * 10000);

      // Generate a unique email address using the random number
      const email = `email_${randomNumber}@ebox.com`;

      // Save the email address to a variable
      cy.wrap(email).as('newEmail');

      // Fill in email field
      cy.get('#emailControl').type(email);

      // Fill in password field and repeat password field with the same password
      const password = 'testpassword';
      cy.get('#passwordControl').type(password);
      cy.get('#repeatPasswordControl').type(password);

      // Click on Security Question menu
      cy.get('#mat-select-2').click();

      // Select "Name of your favorite pet?"
      cy.contains('Name of your favorite pet?').click();

      // Fill in answer
      cy.get('#securityAnswerControl').type('mydog');

      // Click Register button
      cy.get('#registerButton').click();

      // Set email value to previously created email
      cy.get('@newEmail').then((email) => {
        cy.get('#email').type(email);
      });

      // Set password value to previously used password value
      cy.get('#password').type(password);

      // Click login button
      cy.get('#loginButton').click();

      // Click Account button again
      cy.get('#navbarAccount').click();

      // Validate that account name (with previously created email address) appears in the menu section
      cy.get('.mat-menu-item.ng-tns-c129-2').should('contain', email);
    });
  });

  context("With auto login", () => {
    beforeEach(() => {
      cy.login("demo", "demo");
      HomePage.visit();
    });

    it("Search and validate Lemon", () => {
      // Click on search icon
      cy.wait(100);
      cy.get('#searchQuery').click();
    
      // Search for Lemon
      cy.get('.mat-search_field').type('Lemon');
    
      // Select a product card - Lemon Juice (500ml)
      cy.contains('Lemon Juice (500ml)').click();
    
      // Validate that the card description contains "Sour but full of vitamins."
      cy.get('.mat-dialog-content').should('exist').within(() => {
        cy.contains('Sour but full of vitamins.').should('exist');
      });
    });
    
    it("Search 500ml and validate Lemon, while having multiple cards", () => {
      // Click on search icon
      cy.wait(100);
      cy.get('#searchQuery').click();
    
      // Search for 500ml
      cy.get('.mat-search_field').type('500ml');
    
      // Select a product card - Lemon Juice (500ml)
      cy.contains('Lemon Juice (500ml)').click();
    
      // Validate that the card contains "Sour but full of vitamins."
      cy.get('.mat-dialog-content').should('exist').within(() => {
        cy.contains('Sour but full of vitamins.').should('exist');
      });
    });

    it("Search 500ml and validate cards", () => {
      // Click on search icon
      cy.wait(100);
      cy.get('#searchQuery').click();
    
      // Search for 500ml
      cy.get('.mat-search_field').type('500ml').type('{enter}');
    
      // Select a product card - Eggfruit Juice (500ml)
      cy.contains('Eggfruit Juice (500ml)').click();

      // Validate that the card (should) contains "Now with even more exotic flavour."
      cy.get('.mat-dialog-content').should('exist').within(() => {
        cy.contains('Now with even more exotic flavour.').should('exist');
      });
    
      // Close the card
      cy.get('button[aria-label="Close Dialog"]')
      .find('i.material-icons')
      .parent('span')
      .click();
    
      // Select a product card - Lemon Juice (500ml)
      cy.contains('Lemon Juice (500ml)').click();

      // Validate that the card contains "Sour but full of vitamins."
      cy.get('.mat-dialog-content').should('exist').within(() => {
        cy.contains('Sour but full of vitamins.').should('exist');
      });

      // Close the card
      cy.get('button[aria-label="Close Dialog"]')
      .find('i.material-icons')
      .parent('span')
      .click();
    
      // Select a product card - Strawberry Juice (500ml)
      cy.contains('Strawberry Juice (500ml)').click();
      cy.get('.mat-dialog-content').should('exist').within(() => {
        cy.contains('Sweet & tasty!').should('exist');
      });
    });

    it("Read a review", () => {
      // Click on search icon
      cy.wait(100);
      cy.get('#searchQuery').click();

      // Search for "King"
      cy.get('.mat-search_field').type('King');

      // Press Enter to perform the search
      cy.get('.mat-search_field').type('{enter}');

      // Select a product card - OWASP Juice Shop "King of the Hill" Facemask
      cy.contains('OWASP Juice Shop "King of the Hill" Facemask').click();

      // Wait for the reviews section to load and expand reviews
      cy.wait(1000); // Without this line it doesn't work
      cy.contains('Reviews').click();

      // Wait for the reviews to appear (you might need to adjust the timeout)
      cy.get('.ng-star-inserted', { timeout: 10000 }).should('be.visible');

      // Validate the review content
      cy.contains('K33p5 y0ur ju1cy 5plu773r 70 y0ur53lf!').should('exist');
    }); 

    it("Add a review", () => {
      // Click on search icon
      cy.wait(100);
      cy.get('#searchQuery').click();
    
      // Search for "Raspberry"
      cy.get('.mat-search_field').type('Raspberry');
    
      // Press Enter to perform the search
      cy.get('.mat-search_field').type('{enter}');
    
      // Select a product card - Raspberry Juice (1000ml)
      cy.contains('Raspberry Juice (1000ml)').click();
    
      // Type in the review - "Tastes like metal"
      cy.wait(1000);
      cy.get('textarea').type('Tastes like metal');
    
      // Click Submit button for the review
      cy.wait(1000);
      cy.contains('Submit').click();
    
      // Click expand reviews button/icon (wait for reviews to appear)
      cy.wait(1000); // Without this line it doesn't work
      cy.contains('Reviews').click();
    
      // Validate review - "Tastes like metal"
      cy.contains('Tastes like metal').should('exist');
    });

    it("Validate product card amount", () => {
      // Validate that the default amount of cards is 12
      cy.get('.mat-select-min-line.ng-star-inserted').should('contain.text', 12);
    
      // Change items per page to 24
      cy.get('.mat-form-field.mat-paginator-page-size-select').click();
      cy.contains('.mat-option-text', '24').click();

      // Wait for the cards to update based on the new selection
      cy.get('.mat-select-min-line.ng-star-inserted').should('contain.text', 24);
    
      // Change items per page to 36
      cy.get('.mat-form-field.mat-paginator-page-size-select').click();
      cy.contains('.mat-option-text', '36').click();
    
      // Wait for the cards to update again based on the new selection
      cy.get('.mat-select-min-line.ng-star-inserted').should('contain.text', 36);
    });

    it("Buy Girlie T-shirt", () => {
      // Click on search icon and search for "Girlie"
      cy.get('#searchQuery').click();
      cy.get('.mat-search_field').type('Girlie').type('{enter}');;

      // Add "Girlie" item to basket
      cy.contains('Add to Basket').click();

      // Click on "Your Basket" button to proceed to checkout
      cy.contains('Your Basket').click();

      // Click on "Checkout" button
      cy.contains('Checkout').click();

      // Select address containing "United Fakedom" and click Continue button
      cy.contains('United Fakedom').click();
      cy.contains('Continue').click();

      // Select delivery speed Standard Delivery and click Continue button
      cy.contains('Standard Delivery').click();
      cy.contains('Continue').click();

      // Create page object - PaymentOptionsPage (if needed)

      // Select card that ends with "5678" and click Continue button
      cy.contains('5678').parent('mat-row').find('.mat-radio-button').click();
      cy.contains('Continue').click();

      // Click on "Place your order and pay"
      cy.contains('Place your order and pay').click();

      // Validate confirmation message "Thank you for your purchase!"
      cy.contains('Thank you for your purchase!').should('be.visible');
    });

    it("Adds a new address and validates its visibility", () => {
      // Click on Account
      cy.get('#navbarAccount').click();

      // Click on Orders & Payment
      cy.get('.mat-menu-content').contains('Orders & Payment').click();

      // Click on My saved addresses
      cy.contains('My saved addresses').click();

      // Click on Add New Address
      cy.contains('Add New Address').click();

      // Fill in the necessary information (assuming input fields have unique IDs or classes)
      cy.get('#mat-input-1').type('United States');
      cy.get('#mat-input-2').type('John');
      cy.get('#mat-input-3').type('1234567890');
      cy.get('#mat-input-4').type('12345');
      cy.get('#address').type('123 Main St');
      cy.get('#mat-input-6').type('Anytown');
      cy.get('#mat-input-7').type('State');

      // Click Submit button
      cy.contains('Submit').click();

      // Validate that previously added address is visible
      cy.contains('123 Main St, Anytown').should('be.visible');
    });

    it("Adds a new payment option and validates its presence", () => {
      // Click on Account
      cy.get('#navbarAccount').click();

      // Wait for the dropdown to appear
      cy.get('.mat-menu-content').should('be.visible');

      // Click on Orders & Payment
      cy.get('.mat-menu-content').contains('Orders & Payment').click();

      // Wait for the page to load
      cy.wait(1000);

      // Click on My payment options
      cy.contains('My Payment Options').click();

      // Click Add new card
      cy.contains('Add new card').click();

      // Fill in Name
      cy.get('input').eq(1).type('John Doe');

      // Fill in Card Number
      cy.get('input').eq(2).type('4111111111111111'); // Example card number

      // Set expiry month to 7
      cy.get('select').eq(0).select('7'); // Assuming this is a dropdown

      // Set expiry year to 2090
      cy.get('select').eq(1).select('2090'); // Assuming this is a dropdown

      // Click Submit button
      cy.contains('Submit').click();

      // Validate that the card shows up in the list
      cy.contains('John Doe').should('be.visible');
    });
  });
});