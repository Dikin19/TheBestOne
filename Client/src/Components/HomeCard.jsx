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

    // Food quality indicators - updated for betta fish theme
    const qualityBadges = [
        { label: "Premium", icon: Crown, color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
        { label: "Champion", icon: Award, color: "bg-gradient-to-r from-purple-500 to-purple-700" },
        { label: "Popular", icon: Star, color: "bg-gradient-to-r from-pink-500 to-pink-700" },
        { label: "Show Quality", icon: Fish, color: "bg-gradient-to-r from-blue-500 to-blue-700" }
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
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            className="group h-full w-full"
        >
            <Card className="gap-3 mt-10 professional-card overflow-hidden border-0 shadow-lg hover:shadow-2xl h-full flex flex-col bg-white backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-blue-300/50">
                <div className="card-image-container relative overflow-hidden rounded-t-xl">
                    {/* Premium Quality Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute top-3 left-3 z-10"
                    >
                        <Badge className={`card-badge text-xs font-bold text-white ${randomBadge.color} flex items-center gap-1.5 px-3 py-1 rounded-full shadow-lg border-0`}>
                            <randomBadge.icon className="h-3 w-3" />
                            {randomBadge.label}
                        </Badge>
                    </motion.div>

                    {/* Product Image */}
                    <Link to={`/detail/${el.id}`} className="block relative group">
                        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 relative">
                            <motion.img
                                src={el.imgUrl}
                                alt={el.name}
                                className={`card-image w-full h-full object-cover ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setIsImageLoaded(true)}
                                loading="lazy"
                            />
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-100 animate-pulse flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Fish className="h-8 w-8 text-blue-400 animate-bounce" />
                                        <div className="w-8 h-8 border-3 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overlay with Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="card-overlay absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <div className="flex gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button size="sm" className="card-button rounded-full bg-white/95 text-blue-700 hover:bg-white border-0 text-sm px-4 py-2 h-9 font-semibold shadow-lg">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Quick View
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                <CardContent className="p-2 flex-grow flex flex-col">
                    {/* Rating - Smaller */}
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

                    {/* Product Name - More compact */}
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer leading-tight"
                            onClick={() => window.location.href = `/detail/${el.id}`}>
                            {truncateText(el.name, 30)}
                        </h3>
                    </div>

                    {/* Price - Added back with smaller size */}
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-base font-bold text-blue-700">
                            {formatPrice(el.price)}
                        </span>
                    </div>

                    {/* Description - More compact and shorter */}
                    <p className="text-xs text-slate-600 line-clamp-1 mb-1 leading-relaxed">
                        {truncateText(el.description, 40)}
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

                <CardFooter className="p-2 pt-0 flex gap-2 mt-auto">
                    <Link to={`/detail/${el.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-blue-50 border-blue-200 text-blue-700 text-xs py-1 h-7 font-medium"
                        >
                            <Eye className="h-2.5 w-2.5 mr-1" />
                            Details
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddToWishlist}
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
                </CardFooter>
            </Card>
        </motion.div>
    );
}
