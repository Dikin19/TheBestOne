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

        const whatsappUrl = `https://wa.me/6285885239791?text=${encodeURIComponent(message)}`;
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
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group h-full"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 h-full flex flex-col backdrop-blur-sm">
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden">
                                            <Link to={`/detail/${item.Product.id}`}>
                                                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                                                    <img
                                                        src={item.Product.imgUrl}
                                                        alt={item.Product.name}
                                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = '/api/placeholder/300/300';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>
                                            </Link>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item.Product.id)}
                                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 border border-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* Wishlist Badge */}
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg border-0 backdrop-blur-sm">
                                                    <Heart className="w-3 h-3 mr-1.5 fill-current" />
                                                    Favorit
                                                </Badge>
                                            </div>

                                            {/* Quality Badge */}
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs font-semibold rounded-full border-0 backdrop-blur-sm shadow-lg">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                    Premium
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div className="flex-1">
                                                <Link to={`/detail/${item.Product.id}`}>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight min-h-[3.5rem]">
                                                        {item.Product.name}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center mb-3">
                                                    <Fish className="w-4 h-4 mr-2 text-blue-500" />
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        {item.Product.Category?.name || 'Premium Betta'}
                                                    </p>
                                                </div>

                                                <div className="mb-4">
                                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                        Rp {item.Product.price?.toLocaleString('id-ID')}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">Harga sudah termasuk perawatan</p>
                                                </div>

                                                {/* Features Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                                                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold border border-blue-200 transition-colors hover:bg-blue-100">
                                                        🏆 Show Quality
                                                    </span>
                                                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold border border-green-200 transition-colors hover:bg-green-100">
                                                        ✨ Sehat
                                                    </span>
                                                    <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-semibold border border-purple-200 transition-colors hover:bg-purple-100">
                                                        🎨 Rare Color
                                                    </span>
                                                </div>

                                                {/* Product Stats */}
                                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                            <span className="text-gray-600">Size: Premium</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                            <span className="text-gray-600">Health: Excellent</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                                            <span className="text-gray-600">Age: 3-6 months</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                                            <span className="text-gray-600">Grade: A+</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-3 mt-auto">
                                                <Link to={`/detail/${item.Product.id}`} className="block">
                                                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 text-sm">
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Lihat Detail Lengkap
                                                    </Button>
                                                </Link>

                                                <Button
                                                    onClick={() => handleRemoveFromWishlist(item.Product.id)}
                                                    variant="outline"
                                                    className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Hapus dari Wishlist
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        // Empty State - Professional Design
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24"
                        >
                            <div className="max-w-lg mx-auto">
                                {/* Professional Illustration */}
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                    className="relative mb-12"
                                >
                                    <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                                        <div className="relative">
                                            <Fish className="w-20 h-20 text-blue-400" />
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                        <Heart className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shadow-md border border-white">
                                        <Star className="w-4 h-4 text-cyan-500 fill-current" />
                                    </div>
                                </motion.div>

                                {/* Professional Typography */}
                                <div className="space-y-6 mb-12">
                                    <h3 className="text-4xl font-bold text-gray-800 mb-3 leading-tight">
                                        Belum Ada Ikan Cupang
                                        <br />
                                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            di Wishlist Anda
                                        </span>
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                                        Mulai koleksi ikan cupang impian Anda! Jelajahi berbagai jenis ikan cupang berkualitas premium dan tambahkan favorit Anda ke wishlist.
                                    </p>
                                </div>

                                {/* Professional Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Fish className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Kualitas Premium</h4>
                                        <p className="text-xs text-gray-600">Ikan cupang pilihan terbaik</p>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Heart className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Mudah Dikelola</h4>
                                        <p className="text-xs text-gray-600">Simpan favorit dengan praktis</p>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Star className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Koleksi Eksklusif</h4>
                                        <p className="text-xs text-gray-600">Varietas langka dan unik</p>
                                    </div>
                                </div>

                                {/* Professional CTA */}
                                <div className="space-y-4">
                                    <Link to="/">
                                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-0 hover:shadow-blue-500/25">
                                            <Fish className="w-6 h-6 mr-3" />
                                            Jelajahi Koleksi Premium
                                        </Button>
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        Temukan ikan cupang terbaik untuk koleksi Anda
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
