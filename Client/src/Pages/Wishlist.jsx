import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Fish, Star, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { useWishlistEnhanced } from "../hooks/useWishlistEnhanced";
import Swal from 'sweetalert2';

export default function Wishlist() {
    // Use the enhanced wishlist hook for better real-time synchronization
    const {
        wishlistItems,
        isLoading,
        error,
        removeFromWishlist: removeFromWishlistHook,
        fetchWishlist,
        clearWishlist,
        getWishlistStats
    } = useWishlistEnhanced();

    useEffect(() => {
        // Initial fetch will be handled by the hook automatically
        // But we can force a fresh fetch here if needed
        fetchWishlist(false);
    }, [fetchWishlist]);

    // Handle WhatsApp message
    const handleWhatsAppOrder = () => {
        if (wishlistItems.length === 0) {
            Swal.fire({
                title: 'Wishlist Kosong',
                text: 'Tambahkan beberapa ikan cupang ke wishlist terlebih dahulu!',
                icon: 'info',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        let message = "Halo! Saya tertarik dengan ikan cupang berikut dari wishlist saya:\n\n";

        wishlistItems.forEach((item, index) => {
            message += `${index + 1}. ${item.Product.name}\n`;
            message += `   Harga: Rp ${item.Product.price?.toLocaleString('id-ID')}\n\n`;
        });

        message += "Mohon informasi lebih lanjut mengenai ketersediaan dan cara pemesanannya. Terima kasih!";

        const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleRemoveFromWishlist = async (productId) => {
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
                const success = await removeFromWishlistHook(productId);

                if (success) {
                    Swal.fire({
                        title: 'Removed!',
                        text: 'The betta has been removed from your wishlist.',
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);

            Swal.fire({
                title: 'Error',
                text: 'Failed to remove from wishlist. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 flex items-center justify-center relative overflow-hidden">
                {/* Background Effects sama dengan Home */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-cyan-600/8"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/2 via-transparent to-teal-600/3"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <Fish className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-bounce" />
                    <div className="spinner-aqua w-6 h-6 mx-auto mb-4" />
                    <p className="text-blue-600 font-semibold">Loading your wishlist...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 relative overflow-hidden">
            {/* Background Effects sama dengan Home */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-cyan-600/8"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/2 via-transparent to-teal-600/3"></div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-48 right-24 w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Header Wishlist - Dikecilkan */}
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-12 relative overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center justify-start mb-6">
                        <Link to="/" className="">
                            <Button
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-blue hover:text-blue-700 backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium px-6 py-2.5 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>

                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4 backdrop-blur-sm"
                        >
                            <Heart className="w-7 h-7 text-red-300 fill-current" />
                        </motion.div>

                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Wishlist Saya
                        </h1>
                        <p className="text-lg text-blue-100 mb-6 font-light">
                            Koleksi ikan cupang favoritmu ada di sini!
                        </p>

                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm font-semibold border-0">
                                <Fish className="w-4 h-4 mr-2" />
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'Ikan Cupang' : 'Ikan Cupang'}
                            </Badge>

                            {wishlistItems.length > 0 && (
                                <Button
                                    onClick={handleWhatsAppOrder}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Pesan via WhatsApp
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>            {/* Content - Tampilan Koleksi Profesional - Card Diperkecil */}
            <section className="py-12 relative">
                <div className="max-w-7xl mx-auto px-6">
                    {wishlistItems.length > 0 ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group h-full"
                                >
                                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                                        {/* Image Container - Diperkecil */}
                                        <div className="relative overflow-hidden">
                                            <Link to={`/detail/${item.Product.id}`}>
                                                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                                                    <img
                                                        src={item.Product.imgUrl}
                                                        alt={item.Product.name}
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </Link>

                                            {/* Remove Button - Diperkecil */}
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item.Product.id)}
                                                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 border border-red-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>

                                            {/* Wishlist Badge - Diperkecil */}
                                            <div className="absolute top-2 left-2">
                                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-md border-0">
                                                    <Heart className="w-2.5 h-2.5 mr-1 fill-current" />
                                                    Favorit
                                                </Badge>
                                            </div>

                                            {/* Quality Badge - Diperkecil */}
                                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-0.5 text-xs font-semibold rounded-full border-0">
                                                    <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                                                    Premium
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content - Diperkecil */}
                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                            <div className="flex-1">
                                                <Link to={`/detail/${item.Product.id}`}>
                                                    <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight min-h-[2.5rem]">
                                                        {item.Product.name}
                                                    </h3>
                                                </Link>

                                                <p className="text-xs text-gray-500 mb-2 flex items-center">
                                                    <Fish className="w-3 h-3 mr-1 text-blue-500" />
                                                    {item.Product.Category?.name || 'Premium Betta'}
                                                </p>

                                                <div className="mb-2">
                                                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                        Rp {item.Product.price?.toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                {/* Features Tags - Diperkecil */}
                                                <div className="flex flex-wrap gap-1 mb-2 min-h-[1.5rem]">
                                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">🏆 Show</span>
                                                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium border border-green-100">✨ Sehat</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons - Diperkecil */}
                                            <div className="space-y-2 mt-auto">
                                                <Link to={`/detail/${item.Product.id}`} className="block">
                                                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md border-0 text-xs">
                                                        <ShoppingCart className="w-3 h-3 mr-1" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>

                                                <Button
                                                    onClick={() => handleRemoveFromWishlist(item.Product.id)}
                                                    variant="outline"
                                                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-2 rounded-lg transition-all duration-300 text-xs"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="max-w-md mx-auto">
                                {/* Ilustrasi Ikan Cupang Imut */}
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 2,
                                        ease: "easeInOut"
                                    }}
                                    className="relative mb-8"
                                >
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
                                        <Fish className="w-16 h-16 text-blue-400" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-4 h-4 text-red-400" />
                                    </div>
                                </motion.div>

                                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                                    Belum ada ikan cupang di wishlistmu
                                </h3>
                                <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                                    Jelajahi koleksi kami dan tambahkan ikan cupang favoritmu ke wishlist!
                                </p>

                                <Link to="/">
                                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-0">
                                        <Fish className="w-5 h-5 mr-2" />
                                        Jelajahi Koleksi
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
