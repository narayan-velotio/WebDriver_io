describe('Search Box', () => {
    it('should search for a product', async() => {
        browser.url('https://www.google.com')
        await $('textarea[name="q"]').setValue('WDIO')
        browser.keys('Enter')
        browser.pause(5000)
    })
})