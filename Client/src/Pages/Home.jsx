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
            <section className="relative py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-cyan-500/6"></div>

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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    {/* User Welcome Section
                    {profilePicture && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center mb-8"
                        >
                            <div className="flex items-center gap-4 card-ocean-premium px-8 py-4 rounded-2xl shadow-lg border border-blue-100/50">
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover border-3 border-blue-200/70 shadow-md"
                                />
                                <span className="text-slate-700 font-semibold text-lg">
                                    Welcome back, {localStorage.getItem('email')?.split('@')[0] || 'User'}!
                                </span>
                            </div>
                        </motion.div>
                    )} */}

                    {/* Premium Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-xl"
                    >
                        <Fish className="h-5 w-5" />
                        Premium Betta Fish Collection
                        <Sparkles className="h-5 w-5" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-6xl md:text-8xl font-black text-gradient-premium mb-8 leading-tight"
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
                        className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium"
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
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            to="https://www.selasar.com/ikan-cupang//"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline hover:no-underline btn-ocean-primary shadow-xl group px-8 py-4 rounded-xl flex items-center text-lg font-bold"
                            style={{ textDecoration: 'none' }}
                        >
                            <Fish className="mr-3 h-6 w-6" />
                            Explore Collection
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Button size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl">
                            <Award className="mr-3 h-6 w-6" />
                            Champion Bloodlines
                        </Button>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        <div className="card-ocean-premium rounded-3xl p-8 border border-blue-100/50 shadow-xl">
                            <Crown className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-3 text-lg">Show Quality</h3>
                            <p className="text-slate-600 leading-relaxed">Championship bloodlines with premium genetics and perfect form standards</p>
                        </div>
                        <div className="card-ocean-premium rounded-3xl p-8 border border-cyan-100/50 shadow-xl">
                            <Heart className="h-10 w-10 text-teal-600 mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-3 text-lg">Health Guaranteed</h3>
                            <p className="text-slate-600 leading-relaxed">Every betta comes with health certification and complete breeding records</p>
                        </div>
                        <div className="card-ocean-premium rounded-3xl p-8 border border-teal-100/50 shadow-xl">
                            <Sparkles className="h-10 w-10 text-cyan-600 mb-4 mx-auto" />
                            <h3 className="font-bold text-slate-800 mb-3 text-lg">Rare Varieties</h3>
                            <p className="text-slate-600 leading-relaxed">Exclusive colors and patterns from world-renowned international breeders</p>
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
                    className="absolute top-20 left-10 opacity-10"
                >
                    <Fish className="h-20 w-20 text-blue-600" />
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
                    className="absolute bottom-32 right-16 opacity-10"
                >
                    <Fish className="h-16 w-16 text-teal-600" />
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
                    className="absolute top-1/2 right-10 opacity-15"
                >
                    <Waves className="h-12 w-12 text-cyan-500" />
                </motion.div>
            </section>

            {/* Filters and Search */}
            <section className="py-12 px-4 border-t border-blue-100/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-ocean-premium rounded-3xl shadow-2xl p-8 border border-blue-100/50"
                    >
                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${selectedCategory === category.id
                                                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                                                : "border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {category.name}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Sort and View Options */}
                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border-2 border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 bg-white/90 backdrop-blur-sm font-medium"
                                >
                                    <option value="newest">New Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name A-Z</option>
                                </select>

                                <div className="flex border-2 border-blue-200 rounded-xl p-1 bg-white/70 backdrop-blur-sm">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={viewMode === "grid" ? "bg-blue-600 text-white" : "text-blue-600"}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={viewMode === "list" ? "bg-blue-600 text-white" : "text-blue-600"}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        {/* <div className="mt-4 flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-700">
                                <Fish className="h-3 w-3 mr-1" />
                                {sortedProducts.length} premium betta fish available
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
                        </div> */}
                        {/* Search Bar */}
                        <div className="relative mt-3">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-6 w-6" />
                            <Input
                                type="text"
                                placeholder="Search for your perfect betta fish by type, color, or pattern..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 w-full text-lg rounded-2xl border-2 border-blue-200 
                                focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                                placeholder:tracking-wide placeholder:text-slate-400 shadow-lg transition-all duration-300
                                bg-white/80 backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Products Grid */}
            <section id="products-section" className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {sortedProducts.length > 0 ? (
                        <>
                            <motion.div
                                layout
                                className={`grid gap-6 ${viewMode === "grid"
                                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                    : "grid grid-cols-1 md:grid-cols-2 place-items-center gap-6"
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
                            className="text-center py-24 card-ocean-premium rounded-3xl shadow-xl"
                        >
                            <div className="text-8xl mb-6">🐠</div>
                            <h3 className="text-3xl font-black text-gradient-premium mb-4">
                                No betta fish found
                            </h3>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                                Try adjusting your search or filter criteria to find your perfect betta companion
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                                variant="outline"
                                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 text-lg font-semibold rounded-xl"
                            >
                                <Fish className="mr-2 h-5 w-5" />
                                Show All Betta Fish
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-50/80 via-cyan-50/60 to-teal-50/80 border-t border-blue-100/50">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black text-gradient-premium mb-6">
                            Why Choose Our Premium Betta Fish?
                        </h2>
                        <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
                            We are Indonesia's premier betta fish breeder, bringing you championship-quality bettas
                            with certified bloodlines, exceptional health guarantees, and unmatched beauty
                            that will make your aquarium the centerpiece of any room.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200/40"
                            >
                                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2">Championship Bloodlines</h3>
                                <p className="text-sm text-slate-600">Premium genetics from award-winning betta fish competitions across Asia</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-cyan-500/20 via-teal-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-200/40"
                            >
                                <Heart className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2">Health Guarantee</h3>
                                <p className="text-sm text-slate-600">30-day health guarantee with complete breeding certificates and care guide</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-teal-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cyan-200/40"
                            >
                                <Sparkles className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2">Rare & Exclusive</h3>
                                <p className="text-sm text-slate-600">Limited edition colors and patterns from top international breeders</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-teal-500/20 via-cyan-400/15 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cyan-200/40"
                            >
                                <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-slate-800 mb-2">Expert Care Support</h3>
                                <p className="text-sm text-slate-600">Free lifetime consultation with certified betta fish specialists</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Customer Testimonials Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Join thousands of satisfied betta enthusiasts who trust us for their premium fish
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-lg border border-blue-100"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-4 italic">
                                "Incredible quality! My halfmoon betta from here won first place at the local competition.
                                The health guarantee and breeding documentation gave me complete confidence."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    R
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800">Ridwan Susanto</p>
                                    <p className="text-sm text-slate-600">Betta Enthusiast</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 shadow-lg border border-teal-100"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-4 italic">
                                "Best betta fish supplier in Indonesia! The packaging was perfect, fish arrived healthy,
                                and the customer service is outstanding. Will definitely order again!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800">Andi Prasetyo</p>
                                    <p className="text-sm text-slate-600">Aquarium Owner</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border border-purple-100"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-700 mb-4 italic">
                                "Amazing selection of rare bettas! I found the exact dragon scale plakat I was looking for.
                                The breeding certificates and care guide were very helpful."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-800">Sari Handayani</p>
                                    <p className="text-sm text-slate-600">Betta Breeder</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
