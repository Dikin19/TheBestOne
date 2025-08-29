const midtransClient = require('midtrans-client');
const {User, Product, Category, Order} = require("../models");

module.exports = class PaymentController {
    static async initiateMidtransTrx(req, res, next) {
        try {
            const { ProductId, quantity } = req.body;

            // Validate input
            if (!ProductId || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'ProductId and quantity are required'
                });
            }

            if (quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity must be at least 1'
                });
            }

            // 1. Find product by primary key
            const product = await Product.findByPk(ProductId, {
                include: [{ model: Category, attributes: ['name'] }]
            });
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            // 2. Calculate total price
            const totalPrice = product.price * quantity;

            // 3. Create new order
            const order = await Order.create({
                UserId: req.user.id,
                ProductId, 
                quantity, 
                totalPrice,
                status: 'pending'
            });

            // 4. Initialize Midtrans Snap
            let snap = new midtransClient.Snap({
                isProduction: process.env.NODE_ENV === 'production',
                serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-JTfidMmffExiJKMdJtYF35NW',
                clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-nKsqVar5cn60u2Lv'
            });
                
            // 5. Prepare transaction parameters
            const orderId = `BETTA-${order.id}-${Date.now()}`;
            
            let parameter = {
                "transaction_details": {
                    "order_id": orderId,
                    "gross_amount": totalPrice
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "first_name": req.user.fullName || "Betta Enthusiast",
                    "last_name": "",
                    "email": req.user.email,
                    "phone": req.user.phoneNumber || "+62812345678"
                },
                "item_details": [{
                    "id": product.id.toString(),
                    "price": product.price,
                    "quantity": quantity,
                    "name": product.name,
                    "category": product.Category?.name || "Premium Betta Fish",
                    "merchant_name": "TheBestOne"
                }],
                "callbacks": {
                    "finish": `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/finish`
                },
                "expiry": {
                    "start_time": new Date().toISOString().replace(/\.\d{3}Z$/, ' +0700'),
                    "unit": "minutes",
                    "duration": 60
                },
                "page_info": {
                    "color_scheme": "dark",
                    "language": "en"
                }
            };

            // 6. Create transaction
            const result = await snap.createTransaction(parameter);
            
            // 7. Update order with transaction details
            await order.update({
                transactionToken: result.token,
                transactionId: orderId,
                midtransResponse: JSON.stringify(result)
            });

            // 8. Log transaction for monitoring
            console.log('Betta Fish Payment Transaction Created:', {
                orderId: order.id,
                transactionId: orderId,
                productName: product.name,
                amount: totalPrice,
                quantity: quantity,
                customerEmail: req.user.email,
                timestamp: new Date().toISOString()
            });

            res.status(201).json({
                success: true,
                message: 'Transaction created successfully for premium betta fish',
                data: {
                    token: result.token,
                    redirect_url: result.redirect_url,
                    orderId: order.id,
                    transactionId: orderId,
                    amount: totalPrice,
                    productName: product.name,
                    expiryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
                }
            });

        } catch (err) {
            console.error('Payment initiation error:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to create payment transaction',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }

    static async handleMidtransNotification(req, res, next) {
        try {
            console.log('Midtrans notification received:', req.body);

            let snap = new midtransClient.Snap({
                isProduction: process.env.NODE_ENV === 'production',
                serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-JTfidMmffExiJKMdJtYF35NW'
            });

            const statusResponse = await snap.transaction.notification(req.body);
            const orderId = statusResponse.order_id;
            const transactionStatus = statusResponse.transaction_status;
            const fraudStatus = statusResponse.fraud_status;
            const transactionTime = statusResponse.transaction_time;

            console.log(`Betta Fish Order Notification - Order ID: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

            // Find order by transaction ID
            const order = await Order.findOne({
                where: { transactionId: orderId },
                include: [
                    { model: Product, attributes: ['name', 'price'] },
                    { model: User, attributes: ['email', 'fullName'] }
                ]
            });

            if (!order) {
                console.error('Order not found for transaction ID:', orderId);
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            let orderStatus = 'pending';
            let emailSubject = '';
            let emailMessage = '';

            // Determine order status based on Midtrans response
            if (transactionStatus === 'capture') {
                if (fraudStatus === 'challenge') {
                    orderStatus = 'challenge';
                    emailSubject = 'Payment Under Review - TheBestOne';
                    emailMessage = 'Your payment is being reviewed for security. We will update you soon.';
                } else if (fraudStatus === 'accept') {
                    orderStatus = 'paid';
                    emailSubject = 'Payment Confirmed - Your Betta Fish is Being Prepared!';
                    emailMessage = 'Thank you! Your payment has been confirmed. We are preparing your premium betta fish for shipment.';
                }
            } else if (transactionStatus === 'settlement') {
                orderStatus = 'paid';
                emailSubject = 'Payment Successful - TheBestOne Premium Betta';
                emailMessage = 'Your payment has been successfully processed. Your beautiful betta fish will be shipped within 24 hours.';
            } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
                orderStatus = 'failed';
                emailSubject = 'Payment Failed - TheBestOne';
                emailMessage = 'Unfortunately, your payment could not be processed. Please try again or contact our support team.';
            } else if (transactionStatus === 'pending') {
                orderStatus = 'pending';
                emailSubject = 'Payment Pending - TheBestOne';
                emailMessage = 'We are waiting for your payment confirmation. Please complete the payment to secure your betta fish.';
            }

            // Update order with new status and notification details
            await order.update({
                status: orderStatus,
                paymentResponse: JSON.stringify(statusResponse),
                transactionTime: transactionTime,
                lastNotificationAt: new Date()
            });

            // Log the status change
            console.log(`Order ${order.id} status updated to: ${orderStatus}`, {
                productName: order.Product?.name,
                customerEmail: order.User?.email,
                amount: order.totalPrice,
                transactionTime: transactionTime
            });

            // Here you could add email notification logic
            // await sendEmailNotification(order.User.email, emailSubject, emailMessage);

            res.status(200).json({
                success: true,
                message: 'Notification processed successfully',
                data: {
                    orderId: order.id,
                    status: orderStatus,
                    transactionId: orderId
                }
            });

        } catch (err) {
            console.error('Notification handling error:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to process notification',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }

    static async getOrderStatus(req, res, next) {
        try {
            const { orderId } = req.params;

            const order = await Order.findOne({
                where: { id: orderId, UserId: req.user.id },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'imgUrl', 'description']
                    },
                    {
                        model: User,
                        attributes: ['id', 'email', 'fullName']
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Calculate order age and estimated delivery
            const orderAge = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
            let estimatedDelivery = 'Processing';
            
            if (order.status === 'paid') {
                estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 3 days from now
            }

            res.status(200).json({
                success: true,
                message: 'Order details retrieved successfully',
                data: {
                    ...order.toJSON(),
                    orderAge: orderAge,
                    estimatedDelivery: estimatedDelivery,
                    tracking: {
                        ordered: true,
                        paid: order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered',
                        processed: order.status === 'shipped' || order.status === 'delivered',
                        shipped: order.status === 'shipped' || order.status === 'delivered',
                        delivered: order.status === 'delivered'
                    }
                }
            });

        } catch (err) {
            console.error('Get order status error:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve order status',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }

    static async getAllUserOrders(req, res, next) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;

            const whereCondition = { UserId: req.user.id };
            if (status) {
                whereCondition.status = status;
            }

            const { count, rows: orders } = await Order.findAndCountAll({
                where: whereCondition,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'imgUrl']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            const totalPages = Math.ceil(count / limit);

            res.status(200).json({
                success: true,
                message: 'Orders retrieved successfully',
                data: {
                    orders: orders,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: totalPages,
                        totalOrders: count,
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    }
                }
            });

        } catch (err) {
            console.error('Get user orders error:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve orders',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }

    static async cancelOrder(req, res, next) {
        try {
            const { orderId } = req.params;

            const order = await Order.findOne({
                where: { 
                    id: orderId, 
                    UserId: req.user.id,
                    status: ['pending', 'challenge'] // Only allow canceling unpaid orders
                }
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found or cannot be cancelled'
                });
            }

            await order.update({
                status: 'cancelled',
                cancelledAt: new Date()
            });

            console.log(`Order ${orderId} cancelled by user ${req.user.id}`);

            res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                data: {
                    orderId: order.id,
                    status: 'cancelled'
                }
            });

        } catch (err) {
            console.error('Cancel order error:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to cancel order',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};
