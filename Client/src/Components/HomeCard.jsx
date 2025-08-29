import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye, Fish, Crown, Award, Waves, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatPrice, truncateText } from "../lib/utils";
import { useState } from "react";
import axios from "../config/axiosInstance";
import Swal from 'sweetalert2';
import { useProductWishlistStatus } from "../hooks/useWishlistEnhanced";

export default function HomeCard({ el, index }) {
    // Use the wishlist hook to manage wishlist status
    const { isInWishlist, isLoading: isWishlistLoading, toggleWishlist } = useProductWishlistStatus(el.id);

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    // const discount = Math.floor(Math.random() * 30) + 10; // Random discount 10-40%
    // const originalPrice = el.price * (1 + discount / 100);

    // Food quality indicators
    const qualityBadges = [
        { label: "Premium", icon: Crown, color: "bg-amber-500" },
        { label: "Chef's Special", icon: Award, color: "bg-purple-500" },
        { label: "Popular", icon: Star, color: "bg-pink-500" },
        { label: "Fresh", icon: Fish, color: "bg-blue-500" }
    ];

    const randomBadge = qualityBadges[Math.floor(Math.random() * qualityBadges.length)];

    const handleAddToWishlist = async (e) => {
        e.preventDefault();

        // Check if user is logged in
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

        // Show confirmation dialog before removing from wishlist
        if (isInWishlist) {
            const result = await Swal.fire({
                title: 'Remove from Wishlist?',
                text: 'This product will be removed from your wishlist',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, remove it',
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        // Use the hook's toggle function
        const success = await toggleWishlist();

        if (success && !isInWishlist) {
            // Show success message for adding to wishlist
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: '❤️ Added to wishlist!'
            });
        } else if (success && isInWishlist) {
            // Show success message for removing from wishlist
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: '💔 Removed from wishlist'
            });
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);

        try {
            const response = await axios({
                method: "post",
                url: "/customers/checkout/whatsapp",
                data: {
                    productId: el.id,
                    quantity: 1
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Open WhatsApp URL
            window.open(response.data.whatsappUrl, '_blank');
        } catch (error) {
            console.error('Error generating checkout URL:', error);

            let errorMessage = 'Failed to generate WhatsApp checkout. Please try again.';
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
            setIsCheckingOut(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
            className="group h-full max-w-sm w-full"
        >
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-500 bg-white/90 backdrop-blur-sm border border-blue-100/50 h-full flex flex-col">
                <div className="relative overflow-hidden">
                    {/* Premium Quality Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute top-2 left-2 z-10"
                    >
                        <Badge className={`text-xs font-bold text-white ${randomBadge.color} flex items-center gap-1`}>
                            <randomBadge.icon className="h-2 w-2" />
                            {randomBadge.label}
                        </Badge>
                    </motion.div>

                    {/* Discount Badge */}
                    {/* <motion.div
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="absolute top-2 right-10 z-10"
                    >
                        <Badge variant="destructive" className="text-xs font-bold">
                            -{discount}%
                        </Badge>
                    </motion.div> */}

                    {/* Like Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToWishlist}
                        disabled={isWishlistLoading}
                        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-blue-100 ${isWishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {isWishlistLoading ? (
                            <div className="w-2.5 h-2.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                            <Heart
                                className={`h-2.5 w-2.5 transition-colors ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-slate-600 hover:text-red-500'
                                    }`}
                            />
                        )}
                    </motion.button>

                    {/* Product Image */}
                    <Link to={`/detail/${el.id}`} className="block relative group">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
                            <motion.img
                                src={el.imgUrl}
                                alt={el.name}
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setIsImageLoaded(true)}
                                loading="lazy"
                            />
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100 animate-pulse flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Fish className="h-5 w-5 text-blue-400 animate-bounce" />
                                        <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Underwater Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                        {/* Overlay with Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <div className="flex gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button size="sm" className="rounded-full bg-white/90 text-blue-700 hover:bg-white border border-blue-200 text-xs py-1 h-6">
                                        <Eye className="h-2.5 w-2.5 mr-1" />
                                        View Details
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                <CardContent className="p-2 flex-grow flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-2 w-2 ${i < rating ? 'text-blue-400 fill-blue-400' : 'text-slate-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({rating}.0)</span>
                        <Fish className="h-2 w-2 text-blue-400 ml-1" />
                    </div>

                    {/* Product Name */}
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                            onClick={() => window.location.href = `/detail/${el.id}`}>
                            {truncateText(el.name, 35)}
                        </h3>
                    </div>

                    {/* Price */}
                    {/* <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-blue-700">
                            {formatPrice(el.price)}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    </div> */}

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-1">
                        {truncateText(el.description, 50)}
                    </p>

                    {/* Food Specific Info */}
                    <div className="flex items-center gap-1 mt-auto mb-1">
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 px-1 py-0">
                            <Waves className="h-1 w-1 mr-1" />
                            Fresh
                        </Badge>
                        <Badge variant="outline" className="text-xs border-teal-200 text-teal-700 px-1 py-0">
                            <Crown className="h-1 w-1 mr-1" />
                            Premium
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="p-2 pt-0 flex gap-2 mt-auto">
                    <Link to={`/detail/${el.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-blue-50 border-blue-200 text-blue-700 text-xs py-1 h-6"
                        >
                            <Eye className="h-2.5 w-2.5 mr-1" />
                            View Details
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddToWishlist}
                        disabled={isWishlistLoading}
                        className={`h-8 w-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center p-0 border-0 ${isInWishlist
                                ? 'text-red-500 bg-red-100 hover:bg-red-200'
                                : 'text-slate-600 bg-slate-100 hover:text-red-500 hover:bg-red-50'
                            } ${isWishlistLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                    >
                        {isWishlistLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                            <Heart
                                className={`w-4 h-4 transition-all duration-200 ${isInWishlist
                                        ? 'fill-red-500 text-red-500'
                                        : 'stroke-slate-600 hover:stroke-red-500 hover:fill-red-200'
                                    }`}
                                strokeWidth={2}
                            />
                        )}
                    </Button>

                </CardFooter>
            </Card>
        </motion.div>
    );
}
