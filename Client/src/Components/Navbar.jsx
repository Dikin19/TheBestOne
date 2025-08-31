import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, User, LogOut, Menu, X, ShoppingBag, Star, Heart, Settings, ChevronDown, Sparkles, Crown, Award, ShoppingCart, Trophy, Medal, Target, Waves } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWishlistEnhanced } from "../hooks/useWishlistEnhanced";
import { useNavbarWishlistCount } from "../hooks/useNavbarWishlistCount";
import { clearWishlist } from "../store/wishlistSlice";
import Swal from "sweetalert2";

function Navbar() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');
    const profileRef = useRef(null);
    const marketplaceRef = useRef(null);

    // Use enhanced wishlist hook for initialization and synchronization
    const { forceSynchronize } = useWishlistEnhanced();

    // Use specialized hook for real-time wishlist count updates
    const wishlistCount = useNavbarWishlistCount();

    // Function to update profile picture from localStorage
    const updateProfilePicture = () => {
        const newProfilePicture = localStorage.getItem('profilePicture') || '';
        setProfilePicture(newProfilePicture);
    };

    // Initialize and maintain synchronization
    useEffect(() => {
        const initializeWishlist = async () => {
            try {
                await forceSynchronize();
                console.log('Navbar: Wishlist initialized and synchronized');
            } catch (error) {
                console.error('Navbar: Failed to initialize wishlist:', error);
            }
        };

        // Initialize on mount
        initializeWishlist();

        // Set up periodic synchronization (every 60 seconds for maintenance)
        const syncInterval = setInterval(() => {
            console.log('Navbar: Performing periodic wishlist sync');
            forceSynchronize();
        }, 60000);

        return () => clearInterval(syncInterval);
    }, [forceSynchronize]);

    // Listen for profile picture changes
    useEffect(() => {
        // Update profile picture on mount
        updateProfilePicture();

        // Listen for storage events (when localStorage changes)
        const handleStorageChange = (e) => {
            if (e.key === 'profilePicture') {
                setProfilePicture(e.newValue || '');
            }
        };

        // Listen for custom events for same-tab updates
        const handleProfileUpdate = () => {
            updateProfilePicture();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('profilePictureUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (marketplaceRef.current && !marketplaceRef.current.contains(event.target)) {
                setIsMarketplaceOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userEmail = localStorage.getItem('email') || 'User';
    const userName = userEmail.split('@')[0];

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin keluar dari akun?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Show loading toast
                Swal.fire({
                    title: 'Logging out...',
                    text: 'Mohon tunggu sebentar',
                    icon: 'info',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Clear Redux store state
                dispatch(clearWishlist());

                // Clear all authentication related data from localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('token'); // Keep for backward compatibility
                localStorage.removeItem('email');
                localStorage.removeItem('profilePicture');

                // Clear any wishlist data to prevent state inconsistency
                localStorage.removeItem('wishlist');
                localStorage.removeItem('wishlistItems');
                localStorage.removeItem('wishlist_cache');
                localStorage.removeItem('wishlist_cache_timestamp');

                // Show success message
                await Swal.fire({
                    title: 'Berhasil Keluar!',
                    text: 'Anda telah berhasil keluar dari akun',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Force page reload to reset all state and redirect to login
                window.location.href = '/login';

            } catch (error) {
                console.error('Error during logout:', error);
                Swal.fire({
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal keluar dari akun. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonColor: '#dc2626'
                });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-gradient-to-r from-slate-50/95 via-blue-50/90 to-cyan-50/95 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-blue-200/50"
        >
            {/* Background wave effect */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-5"
                >
                    <Waves className="w-full h-full text-blue-500" />
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink
                            to="/"
                            className="flex items-center gap-3 text-2xl font-bold"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2
                                }}
                                className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl border-3 border-blue-300"
                            >
                                <Fish className="h-8 w-8 text-white animate-pulse" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full"
                                />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 font-black text-2xl">
                                    Bluerim Betta
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Crown className="w-6 h-6 text-yellow-500 animate-bounce" />
                                <Trophy className="w-5 h-5 text-yellow-600" />
                            </div>
                        </NavLink>
                    </motion.div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Wishlist Cart Icon */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <NavLink
                                to="/wishlist"
                                className="relative flex items-center gap-2 text-lg font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group no-underline"
                                style={{ textDecoration: "none" }}
                            >
                                <div className="relative">
                                    <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform group-hover:text-blue-600" />
                                    {wishlistCount > 0 && (
                                        <motion.div
                                            key={wishlistCount} // Key changes trigger re-animation
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 15,
                                                duration: 0.6
                                            }}
                                            className="no-underline absolute -top-2 -right-2"
                                        >
                                            <Badge
                                                variant="destructive"
                                                style={{ textDecoration: "none" }}
                                                className="h-5 w-5 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full animate-pulse shadow-lg border-2 border-white"
                                            >
                                                <motion.span
                                                    key={`count-${wishlistCount}`}
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2, duration: 0.3 }}
                                                >
                                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                                </motion.span>
                                            </Badge>
                                        </motion.div>
                                    )}
                                </div>
                                <span className="hidden lg:block font-semibold">Keranjang</span>
                            </NavLink>
                        </motion.div>

                        {/* Marketplace Dropdown */}
                        <div className="relative" ref={marketplaceRef}>
                            <button
                                onClick={() => {
                                    setIsMarketplaceOpen(!isMarketplaceOpen);
                                    setIsProfileOpen(false);
                                }}
                                className="flex items-center gap-2 text-lg font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group"
                            >
                                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Toko Cupang</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMarketplaceOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isMarketplaceOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-5 w-80 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-blue-200/50 overflow-hidden"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200/50">
                                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-500" />
                                                Koleksi Cupang Premium
                                            </h3>
                                            <p className="text-sm text-slate-600 mt-1">Temukan cupang terbaik di Indonesia</p>
                                        </div>

                                        <div className="p-2">
                                            <NavLink
                                                to="/?category=all&view=products"
                                                onClick={() => setIsMarketplaceOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Fish className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Semua Cupang</p>
                                                    <p className="text-xs text-slate-500">Jelajahi koleksi lengkap</p>
                                                </div>
                                            </NavLink>

                                            <NavLink
                                                to="/wishlist"
                                                onClick={() => setIsMarketplaceOpen(false)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                            >
                                                <div className="relative w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Heart className="w-4 h-4 text-white" />
                                                    {wishlistCount > 0 && (
                                                        <motion.div
                                                            key={`marketplace-${wishlistCount}`}
                                                            initial={{ scale: 0, rotate: 180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
                                                        >
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {wishlistCount > 9 ? '9+' : wishlistCount}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">Favorit Saya</p>
                                                    <p className="text-xs text-slate-500">Cupang favorit ({wishlistCount})</p>
                                                </div>
                                            </NavLink>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsMarketplaceOpen(false);
                                }}
                                className="flex items-center gap-3 text-lg font-semibold text-slate-700 hover:text-blue-600 transition-all duration-300 group"
                            >
                                {profilePicture ? (
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-3 border-blue-300 group-hover:border-blue-400 transition-colors shadow-lg"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-blue-300">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                )}
                                <span className="hidden lg:block">Profil</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-5 w-72 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-blue-200/50 overflow-hidden"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200/50">
                                            <div className="flex items-center gap-4">
                                                {profilePicture ? (
                                                    <img
                                                        src={profilePicture}
                                                        alt="Profile"
                                                        className="w-14 h-14 rounded-full object-cover border-3 border-blue-300 shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
                                                        <User className="w-7 h-7 text-white" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-700 capitalize text-lg">
                                                        {userName}
                                                    </p>
                                                    <p className="text-sm text-slate-600">Pecinta Cupang Indonesia</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <NavLink
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                            >
                                                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Lihat Profil
                                            </NavLink>

                                            <NavLink
                                                to="/wishlist"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                            >
                                                <div className="relative">
                                                    <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    {wishlistCount > 0 && (
                                                        <motion.div
                                                            key={`profile-${wishlistCount}`}
                                                            initial={{ scale: 0, rotate: -90 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                                            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center shadow-sm"
                                                        >
                                                            <span className="text-xs font-bold text-white">
                                                                {wishlistCount > 9 ? '9+' : wishlistCount}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                Favorit Saya ({wishlistCount})
                                            </NavLink>
                                            <div className="border-t border-blue-200/50 mt-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group"
                                                >
                                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    Keluar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        className="md:hidden hover:bg-blue-50 text-slate-700"
                    >
                        <motion.div
                            animate={{ rotate: isMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </motion.div>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-4"
                        >
                            <Card className="bg-white/95 backdrop-blur-lg border border-blue-200/50 shadow-xl">
                                <CardContent className="p-4 space-y-4">
                                    {/* User Info in Mobile */}
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/30">
                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center border-2 border-blue-300">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-700 capitalize">{userName}</p>
                                            <p className="text-sm text-slate-600">Pecinta Cupang</p>
                                        </div>
                                    </div>

                                    <NavLink
                                        to="/"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        Toko Cupang
                                    </NavLink>

                                    <NavLink
                                        to="/profile"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                    >
                                        <User className="h-5 w-5" />
                                        Profil
                                    </NavLink>

                                    <NavLink
                                        to="/wishlist"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                    >
                                        <div className="relative">
                                            <Heart className="h-5 w-5" />
                                            {wishlistCount > 0 && (
                                                <motion.div
                                                    key={`mobile-${wishlistCount}`}
                                                    initial={{ scale: 0, rotate: 360 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <span className="text-xs font-bold text-white">
                                                        {wishlistCount > 9 ? '9+' : wishlistCount}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </div>
                                        Favorit ({wishlistCount})
                                    </NavLink>

                                    <button className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
                                        <Star className="w-5 h-5" />
                                        Ulasan
                                    </button>

                                    <div className="border-t border-blue-200/50 pt-4">
                                        <button
                                            onClick={() => {
                                                toggleMenu();
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Keluar
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

export default Navbar;
