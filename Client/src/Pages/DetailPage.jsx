import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../config/axiosInstance';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchById } from '../store/productSlice';
import ProductAnalysis from '../Components/ProductAnalysis';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { useWishlistEnhanced, useProductWishlistStatus } from '../hooks/useWishlistEnhanced';
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
    Phone,
    Eye
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import Swal from 'sweetalert2';

// Component for individual recommendation item with its own wishlist status
function RecommendationItem({ item, index, handleProductNavigation }) {
    const itemId = item.id || item.productId || item.Product?.id || `temp-${index}`;
    const { isInWishlist, isLoading: isWishlistLoading, toggleWishlist } = useProductWishlistStatus(itemId);
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5

    return (
        <motion.div
            key={itemId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group h-full w-full"
        >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl h-full flex flex-col bg-white backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-500">
                <div className="relative overflow-hidden rounded-t-xl">
                    {/* Premium Quality Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute top-2 left-2 z-10"
                    >
                        <Badge className="mt-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg border-0">
                            <Crown className="h-2.5 w-2.5" />
                            Premium
                        </Badge>
                    </motion.div>

                    {/* Product Image */}
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            handleProductNavigation(itemId);
                        }}
                        className="block relative group cursor-pointer"
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 relative">
                            <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Overlay with Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/10"
                        >
                            <div className="flex gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button size="sm" className="rounded-full bg-white/95 text-blue-700 hover:bg-white border-0 text-xs px-3 py-1.5 h-7 font-semibold shadow-lg">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Quick View
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <CardContent className="p-2 flex-grow flex flex-col">
                    {/* Rating - Smaller */}
                    <div className='flex flex-row justify-between'>
                        <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-2.5 w-2.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-slate-500 ml-1">({rating}.0)</span>
                        </div>
                        <div className="p-2 pt-0 flex gap-2 mt-auto">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    toggleWishlist();
                                }}
                                variant="outline"
                                size="sm"
                                disabled={isWishlistLoading}
                                className={`h-7 w-7 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center p-0 border ${isInWishlist
                                    ? 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100'
                                    : 'text-slate-600 bg-slate-50 border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                                    } ${isWishlistLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            >
                                {isWishlistLoading ? (
                                    <div className="w-2.5 h-2.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                                ) : (
                                    <Heart
                                        className={`w-3 h-3 transition-all duration-200 ${isInWishlist
                                            ? 'fill-red-500 text-red-500'
                                            : 'stroke-slate-600 hover:stroke-red-500'
                                            }`}
                                        strokeWidth={2}
                                    />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Product Name - More compact */}
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer leading-tight"
                            onClick={() => handleProductNavigation(itemId)}>
                            {item.name}
                        </h3>
                    </div>

                    {/* Price - Added back with smaller size */}
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-base font-bold text-blue-700">
                            {formatPrice(item.price)}
                        </span>
                    </div>

                    {/* Description - More compact and shorter */}
                    <p className="text-xs text-slate-600 line-clamp-1 mb-1 leading-relaxed">
                        {item.description?.substring(0, 40)}...
                    </p>

                    {/* Quality indicators - Smaller badges */}
                    <div className="flex items-center gap-1 mt-auto mb-1">
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 px-1.5 py-0">
                            <Fish className="h-2 w-2 mr-0.5" />
                            Fresh
                        </Badge>
                        <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 px-1.5 py-0">
                            <Crown className="h-2 w-2 mr-0.5" />
                            Premium
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function DetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const detail = useSelector((state) => state.product.detail);
    const error = useSelector((state) => state.product.error);
    const params = useParams();

    // Use wishlist hook for main product
    const { isInWishlist: isLiked, isLoading: isAddingToWishlist, toggleWishlist: handleWishlistToggle } = useProductWishlistStatus(params.id);

    const [gemini, setGemini] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

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

    // Handle navigation to another product detail
    const handleProductNavigation = async (productId) => {
        try {
            // Check if productId is valid
            if (!productId || productId === 'undefined') {
                console.error('Invalid product ID:', productId);
                Swal.fire({
                    title: 'Error',
                    text: 'Invalid product ID. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            console.log('Navigating to product ID:', productId);
            setIsNavigating(true);

            // Navigate to new product with force reload
            window.location.href = `/detail/${productId}`;

        } catch (error) {
            console.error('Navigation error:', error);
            setIsNavigating(false);
        }
    };

    useEffect(() => {
        dispatch(fetchById(params.id));
        fetchGeminiRecommendations();
    }, [dispatch, params.id]);

    async function fetchGeminiRecommendations() {
        try {
            const { data } = await axios({
                method: "get",
                url: `/customers/product/${params.id}/recomendation`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Debug: log the data structure
            console.log('Gemini recommendations data:', data);

            // Ensure each item has an id property
            const processedData = data.map((item, index) => ({
                ...item,
                id: item.id || item.productId || item.Product?.id || index + 1
            }));

            console.log('Processed gemini data:', processedData);
            setGemini(processedData);
        } catch (error) {
            console.log('Error fetching recommendations:', error);
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
        const finalPrice = detail.price * quantity
        const message = `🐠 *Bluerim Betta- Betta Fish Order Inquiry*

Hello! I'm interested in purchasing this beautiful betta fish:

🏷️ *Product Details:*
• Name: ${detail.name}
• Price: ${formatPrice(detail.price)}
• Quantity: ${quantity}
• Total Amount: *${formatPrice(finalPrice)}*

📋 *Product Description:*
${detail.description}

🌟 *Why I chose Bluerim Betta:*
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

    if (!detail.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 relative overflow-hidden flex items-center justify-center px-4">
                {/* Professional Ocean Depth Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-cyan-600/8"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/2 via-transparent to-teal-600/3"></div>

                {/* Enhanced Professional Background Effects */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-16 left-16 w-20 md:w-40 h-20 md:h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-48 right-24 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-40 left-1/3 w-24 md:w-48 h-24 md:h-48 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full blur-3xl animate-pulse delay-2000"></div>

                    {/* Elegant Ocean Bubbles */}
                    <div className="absolute top-1/4 left-1/4 w-2 md:w-3 h-2 md:h-3 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
                    <div className="absolute top-3/4 right-1/4 w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 md:w-4 h-3 md:h-4 bg-teal-400/60 rounded-full animate-bounce delay-1500"></div>
                    <div className="absolute top-1/3 right-1/3 w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-300/50 rounded-full animate-bounce delay-700"></div>
                </div>

                <div className="text-center relative z-10 bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl md:shadow-2xl border border-blue-100 max-w-sm mx-auto">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 md:w-16 h-12 md:h-16 border-3 md:border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-3 md:mb-4"
                    />
                    <p className="text-slate-700 text-base md:text-lg font-semibold">Loading beautiful betta fish...</p>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2">Preparing premium collection...</p>
                    <div className="flex items-center justify-center gap-1 md:gap-2 mt-3 md:mt-4">
                        <Fish className="h-4 md:h-5 w-4 md:w-5 text-blue-500 animate-bounce" />
                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-400 rounded-full animate-bounce delay-400"></div>
                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-teal-400 rounded-full animate-bounce delay-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 relative overflow-hidden">
            {/* Professional Ocean Depth Layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-cyan-600/8"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/2 via-transparent to-teal-600/3"></div>

            {/* Enhanced Professional Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-48 right-24 w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full blur-3xl animate-pulse delay-2000"></div>

                {/* Elegant Ocean Bubbles */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-teal-400/60 rounded-full animate-bounce delay-1500"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-300/50 rounded-full animate-bounce delay-700"></div>
            </div>

            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group text-sm md:text-base"
                    >
                        <ArrowLeft className="h-4 md:h-5 w-4 md:w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back to Marketplace</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </div>
            </div>
            {/* Recommendations */}
            {gemini.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-8 md:mb-16 relative z-10"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
                        <div className="text-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                                You Might Also Love
                            </h2>
                            <p className="text-gray-600 text-xs md:text-sm max-w-xl mx-auto px-4">
                                Handpicked recommendations based on your interest in premium betta fish
                            </p>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 min-w-fit px-4 sm:px-0">
                                {gemini.map((item, index) => (
                                    <RecommendationItem
                                        key={item.id || item.productId || item.Product?.id || `temp-${index}`}
                                        item={item}
                                        index={index}
                                        handleProductNavigation={handleProductNavigation}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
                {/* Product Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-16"
                >
                    {/* Product Images */}
                    <div className="space-y-3 md:space-y-4">
                        <motion.div
                            layoutId="product-image"
                            className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm shadow-lg md:shadow-2xl relative group border border-blue-100/60 md:border-2"
                        >
                            <img
                                src={productImages[selectedImageIndex] || detail.imgUrl}
                                alt={detail.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Ocean Depth Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent group-hover:from-blue-900/20 transition-all duration-500"></div>

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
                                        className="bg-white/90 backdrop-blur-sm text-blue-700 border-blue-200 hover:bg-white shadow-lg"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Premium Badge */}
                            <div className="absolute top-2 md:top-4 left-2 md:left-4">
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg text-xs md:text-sm px-2 md:px-3 py-1">
                                    <Crown className="w-2 md:w-3 h-2 md:h-3 mr-1" />
                                    <span className="text-xs md:text-sm">Premium</span>
                                </Badge>
                            </div>

                            {/* Quality Indicator */}
                            <div className="absolute top-2 md:top-4 right-2 md:right-4">
                                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg text-xs md:text-sm px-2 md:px-3 py-1">
                                    <Award className="w-2 md:w-3 h-2 md:h-3 mr-1" />
                                    <span className="text-xs md:text-sm">Show Quality</span>
                                </Badge>
                            </div>
                        </motion.div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-2 md:gap-2 overflow-x-auto pb-2">
                            {productImages.map((image, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all backdrop-blur-sm ${selectedImageIndex === index
                                        ? 'border-blue-500 ring-2 md:ring-4 ring-blue-200 bg-white/95'
                                        : 'border-blue-200/60 hover:border-blue-300 bg-white/80 hover:bg-white/95'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${detail.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedImageIndex === index && (
                                        <div className="absolute inset-0 bg-blue-500/10"></div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 text-xs md:text-sm">
                                    <Fish className="w-2 md:w-3 h-2 md:h-3 mr-1" />
                                    Premium Betta
                                </Badge>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 md:w-4 h-3 md:h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-xs md:text-sm text-gray-600 ml-1 md:ml-2">({reviews} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">{detail.name}</h1>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
                                    <span className="text-xs md:text-sm font-medium">In Stock</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                    <Shield className="w-3 md:w-4 h-3 md:h-4" />
                                    <span className="text-xs md:text-sm font-medium">Health Guaranteed</span>
                                </div>
                                <div className="flex items-center gap-1 text-purple-600">
                                    <Award className="w-3 md:w-4 h-3 md:h-4" />
                                    <span className="text-xs md:text-sm font-medium">Show Quality</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed border-l-4 border-blue-500 pl-3 md:pl-4 bg-blue-50 p-3 md:p-4 rounded-r-lg">
                            {detail.description}
                        </p>

                        {/* Fish Specifications */}
                        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200">
                            <CardHeader className="pb-2 md:pb-4">
                                <CardTitle className="flex items-center gap-2 text-blue-800 text-base md:text-lg">
                                    <Fish className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
                                    Fish Specifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2 md:gap-4 pt-0">
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Droplets className="w-3 md:w-4 h-3 md:h-4 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">pH Level</p>
                                        <p className="text-xs md:text-sm font-medium">6.5 - 7.5</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Thermometer className="w-3 md:w-4 h-3 md:h-4 text-red-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Temperature</p>
                                        <p className="text-xs md:text-sm font-medium">24 - 28°C</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Award className="w-3 md:w-4 h-3 md:h-4 text-yellow-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Quality</p>
                                        <p className="text-xs md:text-sm font-medium">Show Grade</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                    <Clock className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">Age</p>
                                        <p className="text-xs md:text-sm font-medium">3-6 months</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quantity & Actions */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                                <label className="text-base md:text-lg font-semibold text-gray-700">Quantity:</label>
                                <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decreaseQuantity}
                                        className="h-10 w-10 md:h-12 md:w-12 hover:bg-gray-100 rounded-l-lg"
                                    >
                                        <Minus className="h-3 md:h-4 w-3 md:w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity((e.target.value))}
                                        className="w-16 md:w-20 h-10 md:h-12 border-0 text-center text-base md:text-lg font-semibold bg-transparent"
                                        min="1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={increaseQuantity}
                                        className="h-10 w-10 md:h-12 md:w-12 hover:bg-gray-100 rounded-r-lg"
                                    >
                                        <Plus className="h-3 md:h-4 w-3 md:w-4" />
                                    </Button>
                                </div>
                                <div className="text-xs md:text-sm text-gray-600">
                                    Total: <span className="font-bold text-blue-600 text-base md:text-lg">
                                        {formatPrice(detail.price * quantity)}
                                    </span>
                                </div>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                <Button
                                    onClick={handleWhatsAppOrder}
                                    variant="outline"
                                    className="h-12 md:h-14 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm flex-1 sm:flex-none"
                                >
                                    <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                                    <span className="hidden sm:inline">Order via WhatsApp</span>
                                    <span className="sm:hidden">WhatsApp Order</span>
                                </Button>
                                <div className="flex gap-2 md:gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleWishlistToggle}
                                        disabled={isAddingToWishlist}
                                        className={`h-12 w-12 transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLiked
                                            ? 'text-red-500 border-red-500 bg-red-50/80 hover:bg-red-100/80'
                                            : 'hover:text-red-500 hover:border-red-300 hover:bg-red-50/80 border-slate-300'
                                            } ${isAddingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isAddingToWishlist ? (
                                            <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                                        ) : (
                                            <Heart className={`w-4 md:w-5 h-4 md:h-5 transition-all ${isLiked ? 'fill-current scale-110' : ''}`} />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAnalysis(!showAnalysis)}
                                        className="flex-1 h-12 hover:text-purple-500 hover:border-purple-300 transition-all duration-300 bg-white/80 backdrop-blur-sm border-slate-300 text-sm md:text-base"
                                    >
                                        <Sparkles className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                                        <span className="hidden sm:inline">{showAnalysis ? 'Hide' : 'Show'} Explanation</span>
                                        <span className="sm:hidden">{showAnalysis ? 'Hide' : 'Show'} Info</span>
                                    </Button>
                                </div>
                            </div>
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
                            className="mb-8 md:mb-16"
                        >
                            <Card className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-purple-200/60 shadow-2xl">
                                <CardContent>
                                    <ProductAnalysis productId={params.id} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
