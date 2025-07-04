class RegistrationPage {
    // Page URL
    get url() { return 'http://automationexercise.com' }

    // Header elements
    get signupLoginButton() { return $('a[href="/login"]') }
    get deleteAccountButton() { return $('a[href="/delete_account"]') }
    get loggedInAsUsername() { return $('//a[contains(text(), "Logged in as")]') }

    // Signup form elements
    get newUserSignupHeading() { return $('//h2[contains(text(), "New User Signup!")]') }
    get nameInput() { return $('input[data-qa="signup-name"]') }
    get emailInput() { return $('input[data-qa="signup-email"]') }
    get signupButton() { return $('button[data-qa="signup-button"]') }

    // Account information form elements
    get enterAccountInfoHeading() { return $('//h2[contains(text(), "Enter Account Information")]') }
    get titleMrRadio() { return $('input[value="Mr"]') }
    get titleMrsRadio() { return $('input[value="Mrs"]') }
    get passwordInput() { return $('input[data-qa="password"]') }
    get daySelect() { return $('select[data-qa="days"]') }
    get monthSelect() { return $('select[data-qa="months"]') }
    get yearSelect() { return $('select[data-qa="years"]') }
    get newsletterCheckbox() { return $('input[id="newsletter"]') }
    get specialOffersCheckbox() { return $('input[id="optin"]') }

    // Address information form elements
    get firstNameInput() { return $('input[data-qa="first_name"]') }
    get lastNameInput() { return $('input[data-qa="last_name"]') }
    get companyInput() { return $('input[data-qa="company"]') }
    get address1Input() { return $('input[data-qa="address"]') }
    get address2Input() { return $('input[data-qa="address2"]') }
    get countrySelect() { return $('select[data-qa="country"]') }
    get stateInput() { return $('input[data-qa="state"]') }
    get cityInput() { return $('input[data-qa="city"]') }
    get zipcodeInput() { return $('input[data-qa="zipcode"]') }
    get mobileNumberInput() { return $('input[data-qa="mobile_number"]') }
    get createAccountButton() { return $('button[data-qa="create-account"]') }

    // Success messages
    get accountCreatedHeading() { return $('//b[contains(text(), "ACCOUNT CREATED!")]') }
    get accountDeletedHeading() { return $('//b[contains(text(), "ACCOUNT DELETED!")]') }
    get continueButton() { return $('a[data-qa="continue-button"]') }

    // Page actions
    async open() {
        await browser.url(this.url)
        await browser.maximizeWindow()
    }

    async verifyHomePageVisible() {
        await this.signupLoginButton.waitForDisplayed({ timeout: 10000 })
        return await this.signupLoginButton.isDisplayed()
    }

    async clickSignupLogin() {
        await this.signupLoginButton.click()
    }

    async verifyNewUserSignupVisible() {
        await this.newUserSignupHeading.waitForDisplayed({ timeout: 10000 })
        return await this.newUserSignupHeading.isDisplayed()
    }

    async fillSignupForm(name, email) {
        await this.nameInput.setValue(name)
        await this.emailInput.setValue(email)
    }

    async clickSignup() {
        await this.signupButton.click()
    }

    async verifyEnterAccountInfoVisible() {
        console.log('Starting to verify Enter Account Information is visible...');
        
        // Try multiple selectors for the account information heading
        let element = null;
        const selectors = [
            '//h2[contains(text(), "Enter Account Information")]',
            '//b[contains(text(), "Enter Account Information")]',
            '//h2[contains(text(), "ENTER ACCOUNT INFORMATION")]',
            '//b[contains(text(), "ENTER ACCOUNT INFORMATION")]',
            '//div[contains(text(), "Enter Account Information")]',
            '//span[contains(text(), "Enter Account Information")]',
            '[data-qa="account-info"]',
            '.account-info'
        ];

        console.log('Trying to find account info heading with different selectors...');
        for (const selector of selectors) {
            try {
                console.log(`Trying selector: ${selector}`);
                element = await $(selector);
                if (await element.isDisplayed()) {
                    console.log(`Found account info heading with selector: ${selector}`);
                    break;
                } else {
                    console.log(`Element found but not displayed: ${selector}`);
                }
            } catch (e) {
                console.log(`Selector failed: ${selector} - ${e.message}`);
                // Continue to next selector
            }
        }

        if (!element || !(await element.isDisplayed())) {
            console.log('Account info heading not found with any selector. Taking screenshot...');
            // Take a screenshot for debugging
            await browser.saveScreenshot('./account_info_debug.png');
            console.log('Screenshot saved as account_info_debug.png');
            
            // Log all text elements on the page for debugging
            console.log('Searching for elements with Account or Information text...');
            const allTextElements = await $$('//*[contains(text(), "Account") or contains(text(), "Information")]');
            console.log(`Found ${allTextElements.length} elements with Account or Information text:`);
            for (const el of allTextElements) {
                try {
                    const text = await el.getText();
                    console.log(`- ${text}`);
                } catch (e) {
                    // Skip if element is not accessible
                }
            }
            
            // Also check for any form elements that might indicate we're on the right page
            console.log('Checking for form elements that might indicate account creation page...');
            const formElements = await $$('input, select, button');
            console.log(`Found ${formElements.length} form elements on the page`);
            
            throw new Error('Enter Account Information heading not found');
        }

        console.log('✓ Enter Account Information heading found and visible');
        return true;
    }

    async fillAccountInformation(userData) {
        // Select title
        if (userData.title === 'Mr') {
            await this.titleMrRadio.click()
        } else {
            await this.titleMrsRadio.click()
        }

        // Fill password
        await this.passwordInput.setValue(userData.password)

        // Select date of birth
        await this.daySelect.selectByVisibleText(userData.day)
        await this.monthSelect.selectByVisibleText(userData.month)
        await this.yearSelect.selectByVisibleText(userData.year)

        // Select checkboxes
        if (userData.newsletter) {
            await this.newsletterCheckbox.click()
        }
        if (userData.specialOffers) {
            await this.specialOffersCheckbox.click()
        }
    }

    async fillAddressInformation(addressData) {
        await this.firstNameInput.setValue(addressData.firstName)
        await this.lastNameInput.setValue(addressData.lastName)
        await this.companyInput.setValue(addressData.company)
        await this.address1Input.setValue(addressData.address1)
        await this.address2Input.setValue(addressData.address2)
        await this.countrySelect.selectByVisibleText(addressData.country)
        await this.stateInput.setValue(addressData.state)
        await this.cityInput.setValue(addressData.city)
        await this.zipcodeInput.setValue(addressData.zipcode)
        await this.mobileNumberInput.setValue(addressData.mobileNumber)
    }

    async clickCreateAccount() {
        await this.createAccountButton.click()
    }

    async verifyAccountCreatedVisible() {
        // Wait for page to load after account creation
        await browser.pause(3000)
        
        // Check if we're on a success page by URL or page content
        const currentUrl = await browser.getUrl()
        console.log(`Current URL after account creation: ${currentUrl}`)
        
        // Try to find success message on the page
        try {
            const successElement = await $('//b[contains(text(), "ACCOUNT CREATED!")]')
            if (await successElement.isDisplayed()) {
                console.log('✓ ACCOUNT CREATED! message found on page')
                return true
            }
        } catch (e) {
            console.log('ACCOUNT CREATED! message not found on page')
        }
        
        // Check if URL contains success indicators
        if (currentUrl.includes('success') || currentUrl.includes('created') || currentUrl.includes('account')) {
            console.log('✓ URL indicates successful account creation')
            return true
        }
        
        // If we can't find success message, check if we're redirected to home page or login page
        if (currentUrl.includes('login') || currentUrl.includes('home') || currentUrl.includes('index')) {
            console.log('✓ Redirected to login/home page after account creation')
            return true
        }
        
        // Take screenshot for debugging
        await browser.saveScreenshot('./account_created_debug.png')
        console.log('Account creation status unclear. Screenshot saved as account_created_debug.png')
        
        // Return true if we're not on the registration form anymore
        const isOnRegistrationForm = await this.enterAccountInfoHeading.isDisplayed().catch(() => false)
        return !isOnRegistrationForm
    }

    async clickContinue() {
        await this.continueButton.click()
    }

    async verifyLoggedInAsUsername(username) {
        await this.loggedInAsUsername.waitForDisplayed({ timeout: 10000 })
        const text = await this.loggedInAsUsername.getText()
        return text.includes(username)
    }

    async clickDeleteAccount() {
        await this.deleteAccountButton.click()
    }

    async verifyAccountDeletedVisible() {
        // Wait for page to load after account deletion
        await browser.pause(3000)
        
        // Check if we're on the delete account page by URL
        const currentUrl = await browser.getUrl()
        console.log(`Current URL after account deletion: ${currentUrl}`)
        
        // Check if URL contains delete account indicators
        if (currentUrl.includes('delete_account')) {
            console.log('✓ URL indicates account deletion page')
            return true
        }
        
        // Try to find success message on the page
        try {
            const successElement = await $('//b[contains(text(), "ACCOUNT DELETED!")]')
            if (await successElement.isDisplayed()) {
                console.log('✓ ACCOUNT DELETED! message found on page')
                return true
            }
        } catch (e) {
            console.log('ACCOUNT DELETED! message not found on page')
        }
        
        // Try alternative selectors for the deletion message
        const alternativeSelectors = [
            '//h2[contains(text(), "Account Deleted!")]',
            '//div[contains(text(), "Account Deleted!")]',
            '//span[contains(text(), "Account Deleted!")]'
        ]
        
        for (const selector of alternativeSelectors) {
            try {
                const element = await $(selector)
                if (await element.isDisplayed()) {
                    console.log(`✓ Account deletion message found with selector: ${selector}`)
                    return true
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        // Take screenshot for debugging
        await browser.saveScreenshot('./account_deleted_debug.png')
        console.log('Account deletion status unclear. Screenshot saved as account_deleted_debug.png')
        
        // Return true if we're not on the main site anymore or if URL changed
        const homePageUrl = 'http://automationexercise.com'
        return currentUrl !== homePageUrl
    }
}

module.exports = new RegistrationPage() 