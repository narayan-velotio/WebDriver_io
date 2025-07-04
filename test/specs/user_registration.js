const { expect } = require('chai');
const RegistrationPage = require('../pageobjects/registration.page');
const testData = require('../utils/testData');

describe('User Registration Test', () => {
    it('should register a new user successfully', async () => {
        console.log('Starting user registration test...');
        
        try {
            // 1. Launch browser and navigate to URL
            console.log('Step 1: Opening browser and navigating to URL...');
            await RegistrationPage.open();
            console.log('✓ Browser opened and navigated to URL');
            
            // 2. Verify that home page is visible successfully
            console.log('Step 2: Verifying home page is visible...');
            const isHomePageVisible = await RegistrationPage.verifyHomePageVisible();
            expect(isHomePageVisible).to.be.true;
            console.log('✓ Home page is visible successfully');
            
            // 3. Click on 'Signup / Login' button
            console.log('Step 3: Clicking on Signup / Login button...');
            await RegistrationPage.clickSignupLogin();
            console.log('✓ Clicked on Signup / Login button');
            
            // 4. Verify 'New User Signup!' is visible
            console.log('Step 4: Verifying New User Signup! is visible...');
            const isSignupVisible = await RegistrationPage.verifyNewUserSignupVisible();
            expect(isSignupVisible).to.be.true;
            console.log('✓ New User Signup! is visible');
            
            // 5. Enter name and email address
            console.log('Step 5: Entering name and email address...');
            await RegistrationPage.fillSignupForm(testData.user.name, testData.user.email);
            console.log(`✓ Entered name: ${testData.user.name} and email: ${testData.user.email}`);
            
            // 6. Click 'Signup' button
            console.log('Step 6: Clicking Signup button...');
            await RegistrationPage.clickSignup();
            console.log('✓ Clicked Signup button');
            
            // 7. Verify that 'ENTER ACCOUNT INFORMATION' is visible
            console.log('Step 7: Verifying Enter Account Information is visible...');
            const isAccountInfoVisible = await RegistrationPage.verifyEnterAccountInfoVisible();
            expect(isAccountInfoVisible).to.be.true;
            console.log('✓ Enter Account Information is visible');
            
            // 8. Fill details: Title, Name, Email, Password, Date of birth
            console.log('Step 8: Filling account information details...');
            await RegistrationPage.fillAccountInformation(testData.user);
            console.log('✓ Filled account information details');
            
            // 9. Select checkbox 'Sign up for our newsletter!'
            // 10. Select checkbox 'Receive special offers from our partners!'
            // (These are handled in fillAccountInformation method)
            console.log('✓ Selected newsletter and special offers checkboxes');
            
            // 11. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
            console.log('Step 11: Filling address information details...');
            await RegistrationPage.fillAddressInformation(testData.address);
            console.log('✓ Filled address information details');
            
            // 12. Click 'Create Account button'
            console.log('Step 12: Clicking Create Account button...');
            await RegistrationPage.clickCreateAccount();
            console.log('✓ Clicked Create Account button');
            
            // 13. Verify that 'ACCOUNT CREATED!' is visible
            console.log('Step 13: Verifying account creation...');
            const isAccountCreated = await RegistrationPage.verifyAccountCreatedVisible();
            expect(isAccountCreated).to.be.true;
            console.log('✓ Account creation verified');
            
            // 14. Click 'Continue' button
            console.log('Step 14: Clicking Continue button...');
            await RegistrationPage.clickContinue();
            console.log('✓ Clicked Continue button');
            
            // 15. Verify that 'Logged in as username' is visible
            console.log('Step 15: Verifying logged in as username is visible...');
            const isLoggedIn = await RegistrationPage.verifyLoggedInAsUsername(testData.user.name);
            expect(isLoggedIn).to.be.true;
            console.log('✓ Logged in as username is visible');
            
            // 16. Click 'Delete Account' button
            console.log('Step 16: Clicking Delete Account button...');
            await RegistrationPage.clickDeleteAccount();
            console.log('✓ Clicked Delete Account button');
            
            // 17. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
            console.log('Step 17: Verifying account deletion...');
            const isAccountDeleted = await RegistrationPage.verifyAccountDeletedVisible();
            expect(isAccountDeleted).to.be.true;
            console.log('✓ Account deletion verified');
            
            await RegistrationPage.clickContinue();
            console.log('✓ Clicked Continue button after account deletion');
            
            console.log('User registration test completed successfully!');
        } catch (error) {
            console.error('Test failed with error:', error.message);
            // Take a screenshot on failure
            await browser.saveScreenshot('./test_failure.png');
            console.log('Screenshot saved as test_failure.png');
            throw error;
        }
    });
}); 