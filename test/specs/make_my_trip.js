const { expect } = require('chai');

describe('Make My Trip flight search', () => {
    it('should search for a flight and count Indigo flights', async () => {
        await browser.url('https://www.makemytrip.com/')
        await browser.maximizeWindow()

        // Wait for page to load
        await browser.pause(3000)

        try {
            // Handle any popups or overlays
            const closeBtn = await $('[data-cy="closeModal"]')
            if (await closeBtn.isDisplayed()) {
                await closeBtn.click()
            }
        } catch (e) {
            console.log('No popup found, continuing...')
        }

        // More generic wait: wait for 'From' or 'To' field
        let fromField, toField
        await browser.waitUntil(async () => {
            fromField = await $('label[for="fromCity"]')
            toField = await $('label[for="toCity"]')
            return (await fromField.isDisplayed()) || (await toField.isDisplayed())
        }, {
            timeout: 15000,
            timeoutMsg: 'Neither From nor To field visible after 15 seconds'
        })

        // If neither field is visible, take a screenshot for debugging
        if (!(await fromField.isDisplayed()) && !(await toField.isDisplayed())) {
            await browser.saveScreenshot('makemytrip_debug.png')
            throw new Error('Neither From nor To field is visible. Screenshot saved as makemytrip_debug.png')
        }

        // Click on From field and enter Bangalore
        await fromField.waitForDisplayed({ timeout: 10000 })
        await fromField.click()
        
        const fromInput = await $('input[placeholder="From"]')
        await fromInput.waitForDisplayed({ timeout: 10000 })
        await fromInput.setValue('Bangalore')
        await browser.pause(2000)
        
        // Select first option from dropdown
        const fromOptions = await $$('li[role="option"]')
        if (fromOptions.length > 0) {
            await fromOptions[0].click()
        }

        // Click on To field and enter Delhi
        await toField.waitForDisplayed({ timeout: 10000 })
        await toField.click()
        
        const toInput = await $('input[placeholder="To"]')
        await toInput.waitForDisplayed({ timeout: 10000 })
        await toInput.setValue('Delhi')
        await browser.pause(2000)
        
        // Select first option from dropdown
        const toOptions = await $$('li[role="option"]')
        if (toOptions.length > 0) {
            await toOptions[0].click()
        }

        // Select departure date
        const departureField = await $('label[for="departure"]')
        let calendarOpen = false
        
        // Wait a moment for the calendar to open automatically after city selection
        await browser.pause(2000)
        
        // Check if calendar is already open
        try {
            calendarOpen = await $(".DayPicker").isDisplayed()
        } catch (e) {
            try {
                calendarOpen = await $("[class*='calendar']").isDisplayed()
            } catch (e2) {
                calendarOpen = false
            }
        }
        
        if (!calendarOpen) {
            try {
                await departureField.waitForDisplayed({ timeout: 10000 })
                await departureField.click()
                await browser.pause(1000)
            } catch (e) {
                // If label is not clickable, try clicking the input
                const departureInput = await $('input[placeholder="Departure"]')
                if (await departureInput.isDisplayed()) {
                    await departureInput.click()
                    await browser.pause(1000)
                } else {
                    throw new Error('Could not open the departure calendar')
                }
            }
        } else {
            console.log('Calendar is already open, proceeding to date selection')
        }
        
        await browser.pause(1000)

        // Select a date 15 days from now
        const departureDate = new Date()
        departureDate.setDate(departureDate.getDate() + 15)
        const dateStr = departureDate.getDate().toString()

        // Try different date selectors
        let dateElement
        try {
            dateElement = await $(`.DayPicker-Day:not(.DayPicker-Day--disabled):contains("${dateStr}")`)
        } catch (e) {
            try {
                dateElement = await $(`[aria-label*="${dateStr}"]`)
            } catch (e2) {
                // Fallback: click on any available date
                const availableDates = await $$('.DayPicker-Day:not(.DayPicker-Day--disabled)')
                if (availableDates.length > 0) {
                    dateElement = availableDates[0]
                }
            }
        }
        
        if (dateElement) {
            await dateElement.click()
        }

        // Click search button
        const searchBtn = await $('a.primaryBtn')
        await searchBtn.waitForDisplayed({ timeout: 10000 })
        await searchBtn.click()

        // Wait for search results to load
        await browser.pause(15000)
        
        // Count IndiGo flights using XPath instead of invalid CSS selector
        const indigoFlights = await $$('//span[contains(text(), "IndiGo")]')
        console.log(`Found ${indigoFlights.length} IndiGo flights`)
        
        // Take a screenshot for debugging
        await browser.saveScreenshot('./makemytrip_results.png')
        
        // Assert that at least one IndiGo flight is found
        expect(indigoFlights.length).to.be.greaterThan(0, `Expected to find at least one IndiGo flight, but found ${indigoFlights.length}. Screenshot saved as 'makemytrip_results.png'`)
        console.log(`Successfully found ${indigoFlights.length} IndiGo flights`)
    })
})