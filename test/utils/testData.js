// Test data for user registration
const testData = {
    user: {
        name: 'Test User',
        email: `testuser${Date.now()}@example.com`,
        title: 'Mr',
        password: 'TestPassword123!',
        day: '15',
        month: 'March',
        year: '1990',
        newsletter: true,
        specialOffers: true
    },
    address: {
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        zipcode: '90210',
        mobileNumber: '1234567890'
    }
}

module.exports = testData 