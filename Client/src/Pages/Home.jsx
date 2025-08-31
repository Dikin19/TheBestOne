import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProduct } from "../store/productSlice";
import HomeCard from "../Components/HomeCard";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Badge } from "../Components/ui/badge";
import axios from "../config/axiosInstance";
import {
    Search,
    Filter,
    Grid3X3,
    List,
    TrendingUp,
    Crown,
    Sparkles,
    ArrowRight,
    Heart,
    Star,
    Award,
    Waves,
    Fish
} from "lucide-react";
import { Link, useLocation } from "react-router";

export default function Home() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.items);
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [categories, setCategories] = useState([]);
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');

    // Handle URL parameters
    useEffect(() => {
        console.log('URL changed:', location.search);
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        const viewParam = searchParams.get('view');

        console.log('Category param:', categoryParam);
        console.log('View param:', viewParam);

        if (categoryParam) {
            console.log('Setting category to:', categoryParam);
            setSelectedCategory(categoryParam);
        }

        if (viewParam === 'products') {
            console.log('Scrolling to products section');
            // Optionally scroll to products section or set a flag to highlight products
            setTimeout(() => {
                const productsSection = document.getElementById('products-section');
                console.log('Products section element:', productsSection);
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location.search]);

    useEffect(() => {
        dispatch(fetchProduct());
        fetchCategories();
    }, [dispatch]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/customer/categories');
            const dbCategories = response.data;

            // Add "All" category and map database categories
            const allCategories = [
                { id: "all", name: "All Bettas", icon: Fish },
                ...dbCategories.map(cat => ({
                    id: cat.id.toString(),
                    name: cat.name,
                    icon: getCategoryIcon(cat.name)
                }))
            ];

            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback categories if API fails
            setCategories([
                { id: "all", name: "All Bettas", icon: Fish },
                { id: "1", name: "Halfmoon", icon: Crown },
                { id: "2", name: "Crowntail", icon: Award },
                { id: "3", name: "Plakat", icon: Star },
                { id: "4", name: "Dumbo Ear", icon: Waves },
                { id: "5", name: "Double Tail", icon: Sparkles },
            ]);
        }
    };

    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Halfmoon': Crown,
            'Crowntail': Award,
            'Plakat': Star,
            'Dumbo Ear': Waves,
            'Double Tail': Sparkles,
        };
        return iconMap[categoryName] || Fish;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.CategoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "name":
                return a.name.localeCompare(b.name);
            default:
                return b.id - a.id; // newest first
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 relative overflow-hidden">
            {/* Professional Ocean Depth Layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-cyan-600/8"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/2 via-transparent to-teal-600/3"></div>

            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-cyan-500/6"></div>

                {/* Enhanced Professional Background Effects */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-8 sm:top-12 md:top-16 left-4 sm:left-8 md:left-16 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-24 sm:top-32 md:top-48 right-6 sm:right-12 md:right-24 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 sm:bottom-32 md:bottom-40 left-1/4 sm:left-1/3 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full blur-3xl animate-pulse delay-2000"></div>

                    {/* Elegant Ocean Bubbles */}
                    <div className="absolute top-1/4 left-1/4 w-2 sm:w-3 h-2 sm:h-3 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
                    <div className="absolute top-3/4 right-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-teal-400/60 rounded-full animate-bounce delay-1500"></div>
                    <div className="absolute top-1/3 right-1/3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-300/50 rounded-full animate-bounce delay-700"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    {/* Premium Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-xl"
                    >
                        <Fish className="h-4 sm:h-5 w-4 sm:w-5" />
                        Premium Betta Fish Collection
                        <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gradient-premium mb-6 sm:mb-8 leading-tight"
                    >
                        Premium Betta Fish
                        <br />
                        <span className="text-gradient-ocean">Collection</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
                    >
                        Discover the world's most exquisite betta fish from championship breeders.
                        Each specimen is carefully selected for its vibrant colors, perfect fins, and elite bloodlines.
                        Experience the ultimate in premium betta ownership.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0"
                    >
                        <Link
                            to="https://www.selasar.com/ikan-cupang//"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline hover:no-underline btn-ocean-primary shadow-xl group px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl flex items-center text-sm sm:text-base md:text-lg font-bold w-full sm:w-auto justify-center"
                            style={{ textDecoration: 'none' }}
                        >
                            <Fish className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                            Explore Collection
                            <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Button size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-xl w-full sm:w-auto">
                            <Award className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                            Champion Bloodlines
                        </Button>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto px-4 sm:px-0"
                    >
                        <div className="card-ocean-premium rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-blue-100/50 shadow-xl">
                            <Crown className="h-8 sm:h-10 w-8 sm:w-10 text-blue-600 mb-3 sm:mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-base sm:text-lg">Show Quality</h3>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Championship bloodlines with premium genetics and perfect form standards</p>
                        </div>
                        <div className="card-ocean-premium rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-cyan-100/50 shadow-xl">
                            <Heart className="h-8 sm:h-10 w-8 sm:w-10 text-teal-600 mb-3 sm:mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-base sm:text-lg">Health Guaranteed</h3>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Every betta comes with health certification and complete breeding records</p>
                        </div>
                        <div className="card-ocean-premium rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-teal-100/50 shadow-xl sm:col-span-2 md:col-span-1">
                            <Sparkles className="h-8 sm:h-10 w-8 sm:w-10 text-cyan-600 mb-3 sm:mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-base sm:text-lg">Rare Varieties</h3>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Exclusive colors and patterns from world-renowned international breeders</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Floating Fish Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-16 sm:top-20 left-4 sm:left-6 md:left-10 opacity-10 hidden sm:block"
                >
                    <Fish className="h-12 sm:h-16 md:h-20 w-12 sm:w-16 md:w-20 text-blue-600" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -8, 0],
                        x: [0, -15, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-24 sm:bottom-28 md:bottom-32 right-8 sm:right-12 md:right-16 opacity-10 hidden md:block"
                >
                    <Fish className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 text-teal-600" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/2 right-4 sm:right-6 md:right-10 opacity-15 hidden lg:block"
                >
                    <Waves className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-cyan-500" />
                </motion.div>
            </section>

            {/* Filters and Search */}
            <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-t border-blue-100/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-ocean-premium rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-blue-100/50"
                    >
                        {/* Filters */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm ${selectedCategory === category.id
                                                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                                                : "border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                                }`}
                                        >
                                            <Icon className="h-3 sm:h-4 w-3 sm:w-4" />
                                            <span className="hidden sm:inline">{category.name}</span>
                                            <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Sort and View Options */}
                            <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 bg-white/90 backdrop-blur-sm font-medium flex-1 lg:flex-none"
                                >
                                    <option value="newest">New Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name A-Z</option>
                                </select>

                                <div className="flex border-2 border-blue-200 rounded-lg sm:rounded-xl p-1 sm:p-2 bg-white/70 backdrop-blur-sm">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 sm:p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-blue-600"}`}
                                    >
                                        <Grid3X3 className="h-3 sm:h-4 w-3 sm:w-4 rounded-lg" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={`p-1.5 sm:p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-blue-600"}`}
                                    >
                                        <List className="h-3 sm:h-4 w-3 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-700">
                                <Fish className="h-3 w-3 mr-1" />
                                {sortedProducts.length} betta fish available
                            </Badge>
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchQuery("")}
                                    className="text-blue-600 hover:bg-blue-50"
                                >
                                    Clear search
                                </Button>
                            )}
                        </div>
                        {/* Search Bar */}
                        <div className="relative mt-4 sm:mt-5 md:mt-6">
                            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                            <Input
                                type="text"
                                placeholder="Search for your perfect betta fish ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 sm:pl-12 h-10 sm:h-12 md:h-14 w-full text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl border-2 border-blue-200 
                                focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                                placeholder:tracking-wide placeholder:text-slate-400 shadow-lg transition-all duration-300
                                bg-white/80 backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Products Grid */}
            <section id="products-section" className="sm:py-12 lg:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {sortedProducts.length > 0 ? (
                        <>
                            <motion.div
                                layout
                                className={`grid gap-3 sm:gap-4 lg:gap-6 ${viewMode === "grid"
                                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                                    : "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                                    }`}
                            >
                                {sortedProducts.map((product, index) => (
                                    <HomeCard
                                        key={product.id}
                                        el={product}
                                        index={index}
                                    />
                                ))}
                            </motion.div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 sm:py-20 md:py-24 card-ocean-premium rounded-2xl sm:rounded-3xl shadow-xl mx-4 sm:mx-0"
                        >
                            <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6">🐠</div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gradient-premium mb-3 sm:mb-4">
                                No betta fish found
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4 sm:px-0">
                                Try adjusting your search or filter criteria to find your perfect betta companion
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                                variant="outline"
                                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-xl"
                            >
                                <Fish className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                                Show All Betta Fish
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50/80 via-cyan-50/60 to-teal-50/80 border-t border-blue-100/50">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gradient-premium mb-4 sm:mb-6">
                            Why Choose Our Premium Betta Fish?
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4 sm:px-0">
                            We are Indonesia's premier betta fish breeder, bringing you championship-quality bettas
                            with certified bloodlines, exceptional health guarantees, and unmatched beauty
                            that will make your aquarium the centerpiece of any room.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-blue-200/40"
                            >
                                <Award className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Championship Bloodlines</h3>
                                <p className="text-xs sm:text-sm text-slate-600">Premium genetics from award-winning betta fish competitions across Asia</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-cyan-500/20 via-teal-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-teal-200/40"
                            >
                                <Heart className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-teal-600 mx-auto mb-3 sm:mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Health Guarantee</h3>
                                <p className="text-xs sm:text-sm text-slate-600">30-day health guarantee with complete breeding certificates and care guide</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-teal-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-cyan-200/40"
                            >
                                <Sparkles className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-cyan-600 mx-auto mb-3 sm:mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Rare & Exclusive</h3>
                                <p className="text-xs sm:text-sm text-slate-600">Limited edition colors and patterns from top international breeders</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-teal-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-cyan-200/40 sm:col-span-2 lg:col-span-1"
                            >
                                <Crown className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Expert Care Support</h3>
                                <p className="text-xs sm:text-sm text-slate-600">Free lifetime consultation with certified betta fish specialists</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Customer Testimonials Section */}
            <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-10 md:mb-12"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
                            Join thousands of satisfied betta enthusiasts who trust us for their premium fish
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-blue-100"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-3 sm:mb-4 italic text-sm sm:text-base">
                                "Incredible quality! My halfmoon betta from here won first place at the local competition.
                                The health guarantee and breeding documentation gave me complete confidence."
                            </p>
                            <div className="flex items-center">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                    R
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800 text-sm sm:text-base">Ridwan Susanto</p>
                                    <p className="text-xs sm:text-sm text-slate-600">Betta Enthusiast</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-teal-100"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-3 sm:mb-4 italic text-sm sm:text-base">
                                "Best betta fish supplier in Indonesia! The packaging was perfect, fish arrived healthy,
                                and the customer service is outstanding. Will definitely order again!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                    A
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800 text-sm sm:text-base">Andi Prasetyo</p>
                                    <p className="text-xs sm:text-sm text-slate-600">Aquarium Owner</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-100 md:col-span-2 lg:col-span-1"
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-3 sm:mb-4 italic text-sm sm:text-base">
                                "Amazing selection of rare bettas! I found the exact dragon scale plakat I was looking for.
                                The breeding certificates and care guide were very helpful."
                            </p>
                            <div className="flex items-center">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                    S
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800 text-sm sm:text-base">Sari Handayani</p>
                                    <p className="text-xs sm:text-sm text-slate-600">Betta Breeder</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
