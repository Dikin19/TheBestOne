const midtransClient = require('midtrans-client');
const {User, Product, Category, Order} = require("../models")

module.exports = class PaymentConroller {
    static async initiateMindtransTrx (req, res, next) {
        try {

            const { ProductId, quantity } = req.body;
            console.log(ProductId,'<<<<<<<<<<<<<<')// menghasilkan id satu dari body

            // const {id} = req.params
            // 1. find product by pk
            // const product = ....
            const product = await Product.findByPk(req.body.ProductId) // findbypk didalam product menghasikan data product id 1
            
            // 2. hitung totalPrice = product.price * quantity
            const totalPrice = product.price * quantity // menghitung total price dari data product id 1 yg didapat          


            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction : false,
                serverKey : 'SB-Mid-server-JTfidMmffExiJKMdJtYF35NW'
            });
            
            // 3. bikin order baru, berdasarkan data yg kamu punya
            const order = await Order.create ({
                UserId: req.user.id, // id user dari hasil authentication login
                ProductId, // body
                quantity, // body
                totalPrice // product.price * quantity
            })
                
        
            let parameter = {
            // detail order
            "transaction_details": {
                "order_id": order.id,
                "gross_amount": totalPrice
            },
            // data jenis pembayaran
            "credit_card":{
                "secure" : true
            }
        };

            const result = await snap.createTransaction(parameter)

                console.log(result);
            

            res.json (result);
        } catch (err) {
            next (err)
        }
    }



}