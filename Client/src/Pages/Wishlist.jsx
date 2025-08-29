import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Fish, Star, ArrowLeft } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import axios from "../config/axiosInstance";
import Swal from 'sweetalert2';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios({
                method: "get",
                url: "/customers/wishlist",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            setWishlistItems(response.data.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);

            const errorMessage = error.response?.data?.message || 'Failed to load your wishlist. Please try again.';
            setError(errorMessage);

            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const result = await Swal.fire({
                title: 'Remove from Wishlist?',
                text: 'Are you sure you want to remove this betta from your wishlist?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, remove it',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await axios({
                    method: "delete",
                    url: `/customers/wishlist/${productId}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                // Update local state immediately for better UX
                setWishlistItems(prev => prev.filter(item => item.ProductId !== productId));

                Swal.fire({
                    title: 'Removed!',
                    text: 'The betta has been removed from your wishlist.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);

            const errorMessage = error.response?.data?.message || 'Failed to remove from wishlist. Please try again.';

            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Fish className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-swim" />
                    <div className="spinner-aqua w-8 h-8 mx-auto mb-4" />
                    <p className="text-blue-600 font-semibold">Loading your wishlist...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-ocean">
            {/* Header */}
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white py-16"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center mb-6">
                        <Link to="/" className="mr-4">
                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center mb-4">
                        <Heart className="w-12 h-12 text-red-400 mr-4 fill-current" />
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-bold">My Wishlist</h1>
                            <p className="text-xl text-blue-200 mt-2">
                                Your favorite bettas collection
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Badge className="bg-gradient-premium text-white px-4 py-2 text-lg font-bold">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'Betta' : 'Bettas'}
                        </Badge>
                        <Star className="w-6 h-6 text-yellow-400" />
                        <span className="text-blue-200">Premium Collection</span>
                    </div>
                </div>
            </motion.section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {wishlistItems.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="card-betta rounded-2xl overflow-hidden h-full flex flex-col">
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden bg-gradient-ocean">
                                            <Link to={`/detail/${item.Product.id}`}>
                                                <div className="relative h-64 overflow-hidden">
                                                    <img
                                                        src={item.Product.imgUrl}
                                                        alt={item.Product.name}
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </Link>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromWishlist(item.Product.id)}
                                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-red-600 hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* Wishlist Badge */}
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-gradient-premium text-white px-3 py-1 text-xs font-semibold">
                                                    <Heart className="w-3 h-3 mr-1 fill-current" />
                                                    Loved
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <Link to={`/detail/${item.Product.id}`}>
                                                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {item.Product.name}
                                                </h3>
                                            </Link>

                                            <p className="text-sm text-gray-500 mb-3 flex items-center">
                                                <Fish className="w-4 h-4 mr-1 text-blue-500" />
                                                {item.Product.Category?.name || 'Premium Betta'}
                                            </p>

                                            <div className="mb-4">
                                                <span className="text-2xl font-bold text-gradient-betta">
                                                    Rp {item.Product.price?.toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">🏆 Show Quality</span>
                                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">✨ Healthy</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-auto space-y-2">
                                                <Link to={`/detail/${item.Product.id}`} className="block">
                                                    <Button className="w-full bg-gradient-betta-blue hover:bg-gradient-betta-purple text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-betta">
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Buy Now
                                                    </Button>
                                                </Link>

                                                <Button
                                                    onClick={() => removeFromWishlist(item.Product.id)}
                                                    variant="outline"
                                                    className="w-full border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove from Wishlist
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold text-gray-600 mb-4">Your wishlist is empty</h3>
                            <p className="text-gray-500 mb-8 text-lg">Start adding your favorite bettas to see them here!</p>
                            <Link to="/">
                                <Button className="bg-gradient-betta-blue text-white px-8 py-4 rounded-xl font-semibold text-lg">
                                    <Fish className="w-5 h-5 mr-2" />
                                    Explore Premium Bettas
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
