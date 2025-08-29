import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Fish, Award, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import axios from "../config/axiosInstance";
import Swal from 'sweetalert2';

export default function HomeCard({ el, index }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Quality badges for betta fish
    const qualityBadges = [
        { label: "Premium", icon: Award, color: "bg-gradient-betta-blue text-white" },
        { label: "Show Quality", icon: Sparkles, color: "bg-gradient-betta-purple text-white" },
        { label: "Champion Line", icon: Star, color: "bg-gradient-premium text-white" },
        { label: "Rare Strain", icon: Fish, color: "bg-gradient-coral text-white" }
    ];

    const randomBadge = qualityBadges[Math.floor(Math.random() * qualityBadges.length)];

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        setIsAddingToWishlist(true);

        try {
            await axios({
                method: "post",
                url: "/customers/wishlist",
                data: { productId: el.id },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            setIsLiked(true);

            // Success notification with aquatic theme
            await Swal.fire({
                title: '💙 Added to Wishlist!',
                text: `${el.name} has been added to your wishlist`,
                icon: 'success',
                confirmButtonColor: '#0ea5e9',
                confirmButtonText: 'Great!',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                backdrop: 'rgba(14, 165, 233, 0.1)'
            });
        } catch (error) {
            console.error('Error adding to wishlist:', error);

            let errorMessage = "Failed to add to wishlist";
            if (error.response?.status === 409) {
                errorMessage = "This betta is already in your wishlist!";
            } else if (error.response?.status === 401) {
                errorMessage = "Please login to add to wishlist";
            }

            await Swal.fire({
                title: 'Oops!',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsAddingToWishlist(false);
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
            await Swal.fire({
                title: 'Error',
                text: 'Failed to generate WhatsApp checkout. Please try again.',
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
            className="group relative"
        >
            <div className="card-betta rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Image Container with Enhanced Effects */}
                <div className="relative overflow-hidden bg-gradient-ocean">
                    <Link to={`/detail/${el.id}`}>
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={el.imgUrl}
                                alt={el.name}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Swimming animation overlay */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Fish className="w-6 h-6 text-white animate-swim" />
                            </div>
                        </div>
                    </Link>

                    {/* Quality Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className={`${randomBadge.color} px-3 py-1 text-xs font-semibold animate-float`}>
                            <randomBadge.icon className="w-3 h-3 mr-1" />
                            {randomBadge.label}
                        </Badge>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleAddToWishlist}
                        disabled={isAddingToWishlist}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 disabled:opacity-50"
                    >
                        {isAddingToWishlist ? (
                            <div className="spinner-aqua w-4 h-4" />
                        ) : (
                            <Heart
                                className={`w-4 h-4 transition-colors duration-300 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                                    }`}
                            />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <Link to={`/detail/${el.id}`}>
                        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {el.name}
                        </h3>
                    </Link>

                    {/* Category */}
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                        <Fish className="w-4 h-4 mr-1 text-blue-500" />
                        {el.Category?.name || 'Premium Betta'}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                        <span className="text-2xl font-bold text-gradient-betta">
                            Rp {el.price?.toLocaleString('id-ID')}
                        </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">🏆 Show Quality</span>
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">✨ Healthy</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">🎯 Breeding Ready</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-2">
                        <Link to={`/detail/${el.id}`} className="block">
                            <Button className="w-full bg-gradient-betta-blue hover:bg-gradient-betta-purple text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-betta">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                View Details & Buy
                            </Button>
                        </Link>

                        <Button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            variant="outline"
                            className="w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                        >
                            {isCheckingOut ? (
                                <div className="spinner-aqua w-4 h-4 mr-2" />
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687" />
                                </svg>
                            )}
                            Quick Order via WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
