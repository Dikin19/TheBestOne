import { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchById } from '../store/productSlice';

export default function DetailPage() {
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.product.detail);
    const error = useSelector((state) => state.product.error);

    const [gemini, setGemini] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const params = useParams();

    useEffect(() => {
        dispatch(fetchById(params.id));
    }, [dispatch, params.id]);

    const handleGemini = async () => {
        try {
            const { data } = await axios({
                method: 'get',
                url: `/customers/product/${params.id}/recomendation`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setGemini(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGemini();
    }, []);

    async function handlePayment(e) {
        e.preventDefault();
        try {
            const { data } = await axios({
                method: "post",
                url: "/customers/payment/midtrans/initiate",
                data: {
                    ProductId: params.id,
                    quantity: quantity,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            window.snap.pay(data.token, {
                onSuccess: (result) => alert("Payment Success!"),
                onPending: (result) => alert("Waiting for your payment!"),
                onError: (result) => alert("Payment failed!"),
                onClose: () => alert("You closed the popup without finishing the payment")
            });
        } catch (error) {
            console.log(error);
        }
    }

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                {/* Product Detail */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <img src={detail.imgUrl} alt={detail.name} className="rounded-lg mb-4 w-full object-cover h-64" />
                    <h2 className="text-2xl font-bold text-gray-800">{detail.name}</h2>
                    <p className="text-lg text-[#f53d2d] font-semibold mt-2">{formatRupiah(detail.price)}</p>
                    <p className="text-gray-600 mt-2">{detail.description}</p>

                    <form onSubmit={handlePayment} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="mt-1 w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f53d2d]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#f53d2d] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition"
                        >
                            Buy Now
                        </button>
                    </form>
                </div>

                {/* Recommendations */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">You might also like:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {gemini.map((gem, index) => (
                            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                                <img src={gem.imgUrl} alt={gem.name} className="w-full h-40 object-cover rounded-md mb-2" />
                                <h4 className="font-semibold text-gray-800">{gem.name}</h4>
                                <p className="text-[#f53d2d] text-sm">{formatRupiah(gem.price)}</p>
                                <p className="text-gray-500 text-sm">{gem.description}</p>
                                <NavLink
                                    to={`/product/${gem.id}`}
                                    className="inline-block mt-2 text-sm text-white bg-[#f53d2d] px-4 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Buy
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
