import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../config/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchById } from '../store/productSlice';
import ProductAnalysis from '../Components/ProductAnalysis';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import {
    ShoppingCart,
    Minus,
    Plus,
    Heart,
    Share2,
    ArrowLeft,
    Star,
    Truck,
    Shield,
    RotateCcw
} from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function DetailPage() {
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.product.detail);
    const error = useSelector((state) => state.product.error);

    const [gemini, setGemini] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();

    // Mock additional images (since we only have one image from the API)
    const productImages = detail.imgUrl ? [
        detail.imgUrl,
        detail.imgUrl,
        detail.imgUrl
    ] : [];

    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    const reviews = Math.floor(Math.random() * 500) + 50; // Random reviews
    const discount = Math.floor(Math.random() * 30) + 10; // Random discount

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
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    }

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    if (!detail.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Products
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                            <motion.img
                                key={selectedImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={productImages[selectedImageIndex]}
                                alt={detail.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-3">
                            {productImages.map((image, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden ${selectedImageIndex === index
                                            ? 'ring-2 ring-amber-500'
                                            : 'ring-1 ring-slate-200'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${detail.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="premium">Premium</Badge>
                                <Badge variant="success">In Stock</Badge>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                {detail.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-slate-600">({rating}.0)</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-600">{reviews} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-slate-900">
                                    {formatPrice(detail.price)}
                                </span>
                                <span className="text-xl text-slate-500 line-through">
                                    {formatPrice(detail.price * (1 + discount / 100))}
                                </span>
                                <Badge variant="destructive">-{discount}%</Badge>
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                                You save {formatPrice(detail.price * (discount / 100))}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {detail.description}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-slate-300 rounded-xl">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="h-12 w-12 rounded-l-xl"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-12 text-center border-0 border-l border-r border-slate-300 rounded-none"
                                        min="1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={increaseQuantity}
                                        className="h-12 w-12 rounded-r-xl"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <span className="text-slate-600">
                                    Total: <span className="font-semibold">{formatPrice(detail.price * quantity)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                onClick={handlePayment}
                                size="lg"
                                variant="premium"
                                className="flex-1 h-14 text-lg font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-6 w-6 mr-2" />
                                        Buy Now
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-14 w-14"
                                onClick={() => setIsLiked(!isLiked)}
                            >
                                <Heart className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-14 w-14"
                            >
                                <Share2 className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Truck className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Free Shipping</p>
                                    <p className="text-sm text-slate-500">On orders over $50</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Secure Payment</p>
                                    <p className="text-sm text-slate-500">100% protected</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <RotateCcw className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">30-Day Return</p>
                                    <p className="text-sm text-slate-500">Easy returns</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recommendations */}
                {gemini.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            You Might Also Like
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gemini.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={item.imgUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-lg font-bold text-amber-600 mb-2">
                                                {formatPrice(item.price)}
                                            </p>
                                            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                                {item.description}
                                            </p>
                                            <Link to={`/detail/${item.id}`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* IBM Granite AI Analysis Section */}
                <ProductAnalysis productId={params.id} />
            </div>
        </div>
    );
}
