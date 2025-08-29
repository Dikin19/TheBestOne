import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, User, LogOut, Menu, X, ShoppingBag, Star, Heart, Settings, ChevronDown, Sparkles, Crown, Award, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";
import { useWishlistEnhanced } from "../hooks/useWishlistEnhanced";
import { useNavbarWishlistCount } from "../hooks/useNavbarWishlistCount";

function Navbar() {
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
    const profileRef = useRef(null);
    const marketplaceRef = useRef(null);

    // Use enhanced wishlist hook for initialization and synchronization
    const { forceSynchronize } = useWishlistEnhanced();

    // Use specialized hook for real-time wishlist count updates
    const wishlistCount = useNavbarWishlistCount();

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
    const profilePicture = localStorage.getItem('profilePicture') || '';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('profilePicture');
        nav('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200"
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink
                            to="/"
                            className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
                                className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                            >
                                <Fish className="h-6 w-6 text-white" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                TheBestOne
                            </span>
                            <Crown className="w-5 h-5 text-yellow-500" />
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
                                    <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
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
                                                className="h-5 w-5 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 rounded-full animate-pulse shadow-lg border-2 border-white"
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
                                <span className="hidden lg:block">Wishlist</span>
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
                                Marketplace
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMarketplaceOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isMarketplaceOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-500" />
                                                Premium Food Collection
                                            </h3>
                                            <p className="text-sm text-slate-600 mt-1">Discover delicious food items</p>
                                        </div>

                                        <div className="p-2">
                                            <NavLink
                                                to="/"
                                                onClick={() => setIsMarketplaceOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Fish className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">All Products</p>
                                                    <p className="text-xs text-slate-500">Browse our entire collection</p>
                                                </div>
                                            </NavLink>

                                            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Crown className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Premium Collection</p>
                                                    <p className="text-xs text-slate-500">Show-quality specimens</p>
                                                </div>
                                            </button>

                                            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Award className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Champion Bloodlines</p>
                                                    <p className="text-xs text-slate-500">Competition winners</p>
                                                </div>
                                            </button>

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
                                                    <p className="font-medium">My Wishlist</p>
                                                    <p className="text-xs text-slate-500">Your favorite items ({wishlistCount})</p>
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
                                className="flex items-center gap-2 text-lg font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group"
                            >
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-300 transition-colors"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                )}
                                Profile
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                {profilePicture ? (
                                                    <img
                                                        src={profilePicture}
                                                        alt="Profile"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-800 capitalize">
                                                        {userName}
                                                    </p>
                                                    <p className="text-sm text-slate-500">Food Enthusiast</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs text-slate-500">Premium Member</span>
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
                                                View Profile
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
                                                My Wishlist ({wishlistCount})
                                            </NavLink>

                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group">
                                                <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                My Reviews
                                            </button>

                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group">
                                                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Order History
                                            </button>

                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group">
                                                <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Settings
                                            </button>

                                            <div className="border-t border-slate-100 mt-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                                                >
                                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    Sign Out
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
                        className="md:hidden hover:bg-blue-50"
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
                            <Card className="glass shadow-xl">
                                <CardContent className="p-4 space-y-4">
                                    {/* User Info in Mobile */}
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 capitalize">{userName}</p>
                                            <p className="text-sm text-slate-500">Betta Enthusiast</p>
                                        </div>
                                    </div>

                                    <NavLink
                                        to="/"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        Marketplace
                                    </NavLink>

                                    <NavLink
                                        to="/profile"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                    >
                                        <User className="h-5 w-5" />
                                        Profile
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
                                        Wishlist ({wishlistCount})
                                    </NavLink>

                                    <button className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
                                        <Star className="w-5 h-5" />
                                        Reviews
                                    </button>

                                    <div className="border-t border-slate-200 pt-4">
                                        <button
                                            onClick={() => {
                                                toggleMenu();
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Sign Out
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
