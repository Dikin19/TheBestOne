const request = require('supertest');
const app = require('../app');
const { User, Product, Wishlist, sequelize } = require('../models');

describe('Wishlist Endpoints', () => {
    let access_token_user;
    let testProduct;
    let testUser;

    beforeAll(async () => {
        // Create test user
        testUser = await User.create({
            fullName: 'Test User',
            email: 'wishlist.testuser@example.com',
            password: 'password123',
            phoneNumber: '1234567890',
            address: '123 Test Street'
        });

        // Create test product directly for betta fish
        testProduct = await Product.create({
            name: 'Premium Blue Betta Fish',
            description: 'Beautiful premium blue betta fish',
            price: 150000,
            imgUrl: 'https://example.com/blue-betta.jpg',
            CategoryId: 1,
            stock: 5
        });

        // Get user token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'wishlist.testuser@example.com',
                password: 'password123'
            });

        access_token_user = loginResponse.body.access_token;
    });

    afterAll(async () => {
        // Clean up test data
        await Wishlist.destroy({ where: { UserId: testUser.id } });
        await Product.destroy({ where: { id: testProduct.id } });
        await User.destroy({ where: { id: testUser.id } });
        await sequelize.close();
    });

    describe('POST /customers/wishlist', () => {
        test('should add product to wishlist successfully', async () => {
            const response = await request(app)
                .post('/customers/wishlist')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({ productId: testProduct.id });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Product added to wishlist successfully');
            expect(response.body.data.productId).toBe(testProduct.id);
        });

        test('should not add same product twice to wishlist', async () => {
            const response = await request(app)
                .post('/customers/wishlist')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({ productId: testProduct.id });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product already in wishlist');
        });

        test('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .post('/customers/wishlist')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({ productId: 99999 });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found');
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/customers/wishlist')
                .send({ productId: testProduct.id });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /customers/wishlist', () => {
        test('should get user wishlist successfully', async () => {
            const response = await request(app)
                .get('/customers/wishlist')
                .set('Authorization', `Bearer ${access_token_user}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Wishlist retrieved successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/customers/wishlist');

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /customers/wishlist/:productId', () => {
        test('should remove product from wishlist successfully', async () => {
            const response = await request(app)
                .delete(`/customers/wishlist/${testProduct.id}`)
                .set('Authorization', `Bearer ${access_token_user}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Product removed from wishlist successfully');
        });

        test('should return 404 for non-existent wishlist item', async () => {
            const response = await request(app)
                .delete(`/customers/wishlist/${testProduct.id}`)
                .set('Authorization', `Bearer ${access_token_user}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found in wishlist');
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete(`/customers/wishlist/${testProduct.id}`);

            expect(response.status).toBe(401);
        });
    });
});

describe('Midtrans Payment Integration', () => {
    let access_token_user;
    let testProduct;
    let testUser;

    beforeAll(async () => {
        // Create test user if not exists
        testUser = await User.findOne({ where: { email: 'payment.test@example.com' } });
        if (!testUser) {
            testUser = await User.create({
                fullName: 'Payment Test User',
                email: 'payment.test@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                address: '123 Payment Street'
            });
        }

        // Create test product for payment
        testProduct = await Product.create({
            name: 'Payment Test Betta Fish',
            description: 'Beautiful test betta for payment',
            price: 200000,
            imgUrl: 'https://example.com/payment-betta.jpg',
            CategoryId: 1,
            stock: 10
        });

        // Get user token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'payment.test@example.com',
                password: 'password123'
            });

        access_token_user = loginResponse.body.access_token;
    });

    afterAll(async () => {
        await Product.destroy({ where: { id: testProduct.id } });
        await User.destroy({ where: { id: testUser.id } });
    });

    describe('POST /customers/payment/midtrans/initiate', () => {
        test('should initiate Midtrans payment successfully', async () => {
            const response = await request(app)
                .post('/customers/payment/midtrans/initiate')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({
                    ProductId: testProduct.id,
                    quantity: 1
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Transaction created successfully for premium betta fish');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('redirect_url');
            expect(response.body.data).toHaveProperty('orderId');
            expect(response.body.data).toHaveProperty('transactionId');
            expect(response.body.data).toHaveProperty('amount');
            expect(response.body.data).toHaveProperty('productName');
        });

        test('should return 400 for missing ProductId', async () => {
            const response = await request(app)
                .post('/customers/payment/midtrans/initiate')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({ quantity: 1 });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('ProductId and quantity are required');
        });

        test('should return 400 for invalid quantity', async () => {
            const response = await request(app)
                .post('/customers/payment/midtrans/initiate')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({
                    ProductId: testProduct.id,
                    quantity: 0
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Quantity must be at least 1');
        });

        test('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .post('/customers/payment/midtrans/initiate')
                .set('Authorization', `Bearer ${access_token_user}`)
                .send({
                    ProductId: 99999,
                    quantity: 1
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product not found');
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/customers/payment/midtrans/initiate')
                .send({
                    ProductId: testProduct.id,
                    quantity: 1
                });

            expect(response.status).toBe(401);
        });
    });
});
