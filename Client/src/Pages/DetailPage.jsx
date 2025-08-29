import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    RotateCcw,
    MessageCircle,
    Fish,
    Droplets,
    Thermometer,
    Award,
    Clock,
    Camera,
    Info,
    CheckCircle,
    Crown,
    Sparkles,
    Phone
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import Swal from 'sweetalert2';

export default function DetailPage() {
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.product.detail);
    const error = useSelector((state) => state.product.error);

    const [gemini, setGemini] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const params = useParams();

    // Enhanced product images with variations
    const productImages = detail.imgUrl ? [
        detail.imgUrl,
        detail.imgUrl + '?variant=side',
        detail.imgUrl + '?variant=top',
        detail.imgUrl + '?variant=full'
    ] : [];

    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    const reviews = Math.floor(Math.random() * 500) + 50; // Random reviews
    const discount = Math.floor(Math.random() * 30) + 10; // Random discount

    useEffect(() => {
        dispatch(fetchById(params.id));
        fetchGeminiRecommendations();
        checkIfInWishlist();
    }, [dispatch, params.id]);

    // Check if product is already in user's wishlist
    async function checkIfInWishlist() {
        try {
            const response = await axios({
                method: "get",
                url: "/customers/wishlist",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            const isInWishlist = response.data.data.some(item => item.ProductId === parseInt(params.id));
            setIsLiked(isInWishlist);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    }

    async function fetchGeminiRecommendations() {
        try {
            const { data } = await axios({
                method: "get",
                url: `/customers/product/${params.id}/recomendation`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setGemini(data);
        } catch (error) {
            console.log(error);
        }
    }

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

            // Show payment confirmation
            const result = await Swal.fire({
                title: 'Confirm Your Purchase',
                html: `
                    <div class="text-left space-y-3">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-900">Order Summary</h4>
                            <p class="text-sm text-blue-700">Product: ${detail.name}</p>
                            <p class="text-sm text-blue-700">Quantity: ${quantity}</p>
                            <p class="text-sm text-blue-700">Total: ${formatPrice(detail.price * quantity * (1 - discount / 100))}</p>
                        </div>
                        <p class="text-sm text-gray-600">You will be redirected to the payment gateway.</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Proceed to Payment',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                window.snap.pay(data.token, {
                    onSuccess: (result) => {
                        Swal.fire({
                            title: '🎉 Payment Success!',
                            html: `
                                <div class="text-center space-y-3">
                                    <div class="text-green-600 text-6xl">✓</div>
                                    <p>Your order has been placed successfully!</p>
                                    <p class="text-sm text-gray-600">Order ID: ${result.order_id}</p>
                                    <p class="text-sm text-gray-600">We'll send you a confirmation email shortly.</p>
                                </div>
                            `,
                            icon: 'success',
                            confirmButtonColor: '#10b981',
                            confirmButtonText: 'Continue Shopping'
                        });
                    },
                    onPending: (result) => {
                        Swal.fire({
                            title: '⏳ Payment Pending',
                            text: 'Please complete your payment. We\'ll notify you once it\'s confirmed.',
                            icon: 'info',
                            confirmButtonColor: '#3b82f6'
                        });
                    },
                    onError: (result) => {
                        Swal.fire({
                            title: '❌ Payment Failed',
                            text: 'There was an error processing your payment. Please try again.',
                            icon: 'error',
                            confirmButtonColor: '#ef4444'
                        });
                    },
                    onClose: () => {
                        Swal.fire({
                            title: 'Payment Cancelled',
                            text: 'You can continue shopping and complete the payment later.',
                            icon: 'warning',
                            confirmButtonColor: '#f59e0b'
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: '❌ Error',
                text: 'Failed to initialize payment. Please check your connection and try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleWhatsAppOrder = () => {
        const finalPrice = detail.price * quantity * (1 - discount / 100);
        const message = `🐠 *TheBestOne - Betta Fish Order Inquiry*

Hello! I'm interested in purchasing this beautiful betta fish:

🏷️ *Product Details:*
• Name: ${detail.name}
• Price: ${formatPrice(detail.price)} ➜ ${formatPrice(finalPrice)} (${discount}% OFF!)
• Quantity: ${quantity}
• Total Amount: *${formatPrice(finalPrice)}*

📋 *Product Description:*
${detail.description}

🌟 *Why I chose TheBestOne:*
• Premium quality betta fish
• World-renowned bloodlines
• Professional breeding standards

Could you please assist me with this order and provide:
✅ Availability confirmation
✅ Shipping information
✅ Payment instructions
✅ Care guide recommendations

Thank you for your excellent service! 🙏

*Order Timestamp: ${new Date().toLocaleString()}*`;

        const phoneNumber = "6281234567890"; // Replace with actual WhatsApp business number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Show WhatsApp confirmation
        Swal.fire({
            title: '📱 Redirecting to WhatsApp',
            html: `
                <div class="text-center space-y-3">
                    <div class="text-green-500 text-4xl">📱</div>
                    <p>You'll be redirected to WhatsApp to complete your order.</p>
                    <p class="text-sm text-gray-600">Our team will respond within 30 minutes during business hours.</p>
                    <div class="bg-green-50 p-3 rounded-lg text-sm">
                        <p class="font-semibold text-green-800">📞 Business Hours:</p>
                        <p class="text-green-700">Monday - Saturday: 9:00 AM - 9:00 PM</p>
                        <p class="text-green-700">Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#25d366',
            confirmButtonText: '📱 Open WhatsApp',
            showCancelButton: true,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(whatsappUrl, '_blank');
            }
        });
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: `${detail.name} - TheBestOne`,
                text: `Check out this amazing betta fish: ${detail.description}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '🔗 Link copied to clipboard!',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    // Handle wishlist toggle functionality
    const handleWishlistToggle = async () => {
        if (!localStorage.getItem('access_token')) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to add items to your wishlist',
                icon: 'warning',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }

        setIsAddingToWishlist(true);

        try {
            if (isLiked) {
                // Remove from wishlist
                await axios({
                    method: "delete",
                    url: `/customers/wishlist/${params.id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                setIsLiked(false);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: '💔 Removed from wishlist',
                    background: '#fee2e2',
                    color: '#dc2626'
                });
            } else {
                // Add to wishlist
                await axios({
                    method: "post",
                    url: "/customers/wishlist",
                    data: { productId: parseInt(params.id) },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                setIsLiked(true);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: '❤️ Added to wishlist!',
                    background: '#dcfce7',
                    color: '#16a34a'
                });
            }
        } catch (error) {
            console.error('Wishlist error:', error);

            let errorMessage = 'Something went wrong. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    if (!detail.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-600 text-lg">Loading beautiful betta fish...</p>
                    <p className="text-slate-500 text-sm mt-2">Preparing premium collection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Marketplace
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
                >
                    {/* Product Images */}
                    <div className="space-y-4">
                        <motion.div
                            layoutId="product-image"
                            className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl relative group"
                        >
                            <img
                                src={productImages[selectedImageIndex] || detail.imgUrl}
                                alt={detail.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ opacity: 1, scale: 1 }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/90 backdrop-blur-sm"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Premium Badge */}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                </Badge>
                            </div>

                            {/* Discount Badge */}
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-red-500 text-white shadow-lg animate-pulse">
                                    -{discount}% OFF
                                </Badge>
                            </div>
                        </motion.div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-3">
                            {productImages.map((image, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-blue-500 ring-4 ring-blue-200'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${detail.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                                    <Fish className="w-3 h-3 mr-1" />
                                    Premium Betta
                                </Badge>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">({reviews} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{detail.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-4xl font-bold text-blue-600">
                                    {formatPrice(detail.price * (1 - discount / 100))}
                                </div>
                                <div className="text-xl text-gray-500 line-through">
                                    {formatPrice(detail.price)}
                                </div>
                                <Badge className="bg-red-100 text-red-800 px-3 py-1 text-sm">
                                    Save {formatPrice(detail.price * discount / 100)}
                                </Badge>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">In Stock</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">Health Guaranteed</span>
                                </div>
                                <div className="flex items-center gap-1 text-purple-600">
                                    <Award className="w-4 h-4" />
                                    <span className="text-sm font-medium">Show Quality</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                            {detail.description}
                        </p>

                        {/* Fish Specifications */}
                        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Fish className="w-5 h-5 text-blue-600" />
                                    Fish Specifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Droplets className="w-4 h-4 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">pH Level</p>
                                        <p className="text-sm font-medium">6.5 - 7.5</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Thermometer className="w-4 h-4 text-red-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Temperature</p>
                                        <p className="text-sm font-medium">24 - 28°C</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Award className="w-4 h-4 text-yellow-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Quality</p>
                                        <p className="text-sm font-medium">Show Grade</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Age</p>
                                        <p className="text-sm font-medium">3-6 months</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quantity & Actions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="text-lg font-semibold text-gray-700">Quantity:</label>
                                <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decreaseQuantity}
                                        className="h-12 w-12 hover:bg-gray-100 rounded-l-lg"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-12 border-0 text-center text-lg font-semibold bg-transparent"
                                        min="1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={increaseQuantity}
                                        className="h-12 w-12 hover:bg-gray-100 rounded-r-lg"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total: <span className="font-bold text-blue-600 text-lg">
                                        {formatPrice(detail.price * quantity * (1 - discount / 100))}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                    className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            Buy Now - {formatPrice(detail.price * quantity * (1 - discount / 100))}
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleWhatsAppOrder}
                                    variant="outline"
                                    className="h-14 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Order via WhatsApp
                                </Button>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleWishlistToggle}
                                    disabled={isAddingToWishlist}
                                    className={`h-12 w-12 transition-all duration-300 ${isLiked
                                        ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100'
                                        : 'hover:text-red-500 hover:border-red-300 hover:bg-red-50'
                                        } ${isAddingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isAddingToWishlist ? (
                                        <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                                    ) : (
                                        <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-current scale-110' : ''}`} />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={shareProduct}
                                    className="h-12 w-12 hover:text-blue-500 hover:border-blue-300 transition-all duration-300"
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAnalysis(!showAnalysis)}
                                    className="flex-1 h-12 hover:text-purple-500 hover:border-purple-300 transition-all duration-300"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    {showAnalysis ? 'Hide' : 'Show'} AI Analysis
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
                                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="font-semibold text-sm text-blue-800">Free Shipping</p>
                                <p className="text-xs text-blue-600">On orders over $50</p>
                            </Card>
                            <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100">
                                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="font-semibold text-sm text-green-800">Health Guarantee</p>
                                <p className="text-xs text-green-600">7-day guarantee</p>
                            </Card>
                            <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
                                <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <p className="font-semibold text-sm text-orange-800">Easy Returns</p>
                                <p className="text-xs text-orange-600">30-day return policy</p>
                            </Card>
                        </div>
                    </div>
                </motion.div>

                {/* AI Analysis */}
                <AnimatePresence>
                    {showAnalysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: 50, height: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-purple-800">
                                        <Sparkles className="w-5 h-5" />
                                        AI-Powered Analysis
                                    </CardTitle>
                                    <CardDescription>
                                        IBM Granite AI provides expert insights about this betta fish
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProductAnalysis productId={params.id} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recommendations */}
                {gemini.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-16"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                You Might Also Love
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Handpicked recommendations based on your interest in premium betta fish
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gemini.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group"
                                >
                                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                                        <div className="aspect-square overflow-hidden relative">
                                            <img
                                                src={item.imgUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <Badge className="bg-white/20 backdrop-blur-sm text-white">
                                                    Premium Grade
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {formatPrice(item.price)}
                                                </span>
                                                <Link to={`/detail/${item.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
