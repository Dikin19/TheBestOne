import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProduct } from "../store/productSlice";
import HomeCardNew from "../Components/HomeCardNew";
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
    Fish,
    Trophy,
    Gem
} from "lucide-react";

export default function HomeNew() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.items);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [categories, setCategories] = useState([]);
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');

    useEffect(() => {
        dispatch(fetchProduct());
        fetchCategories();
    }, [dispatch]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/customers/categories');
            const dbCategories = response.data;

            // Add "All" category and map database categories
            const allCategories = [
                { id: "all", name: "All Bettas", icon: Fish },
                ...dbCategories.map(cat => ({
                    id: cat.id.toString(),
                    name: cat.name,
                    icon: Fish
                }))
            ];

            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.CategoryId?.toString() === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return b.id - a.id; // newest first
            }
        });

    return (
        <div className="min-h-screen bg-gradient-ocean">
            {/* Hero Section with Floating Elements */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-float"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 100, 0],
                            rotate: [0, -180, -360]
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-40 right-20 w-24 h-24 bg-teal-400/10 rounded-full animate-float"
                    />
                    <motion.div
                        animate={{
                            x: [0, 60, 0],
                            y: [0, -80, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/10 rounded-full animate-bubble"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center mb-6">
                                <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                                <span className="text-yellow-400 font-semibold text-lg">World's #1 Betta Marketplace</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                <span className="text-gradient-premium">TheBestOne</span>
                                <br />
                                <span className="text-white">Premium Betta</span>
                                <br />
                                <span className="text-blue-300">Paradise</span>
                            </h1>

                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Discover the world's most exquisite betta fish collection. From champion bloodlines to rare color variations, find your perfect aquatic companion.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-premium text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-premium"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Explore Collection
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 rounded-xl transition-all duration-300"
                                >
                                    <Trophy className="w-5 h-5 mr-2" />
                                    Champion Gallery
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-bold text-yellow-400">500+</div>
                                    <div className="text-sm text-blue-200">Premium Bettas</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-bold text-yellow-400">1000+</div>
                                    <div className="text-sm text-blue-200">Happy Customers</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-bold text-yellow-400">50+</div>
                                    <div className="text-sm text-blue-200">Rare Varieties</div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                <img
                                    src="/dikin11.png"
                                    alt="Premium Betta Fish"
                                    className="w-full h-auto rounded-2xl shadow-2xl animate-float"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent rounded-2xl"></div>

                                {/* Floating badges */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-6 left-6"
                                >
                                    <Badge className="bg-gradient-premium text-white px-4 py-2 font-bold">
                                        <Gem className="w-4 h-4 mr-2" />
                                        Show Quality
                                    </Badge>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute bottom-6 right-6"
                                >
                                    <Badge className="bg-gradient-betta-blue text-white px-4 py-2 font-bold">
                                        <Award className="w-4 h-4 mr-2" />
                                        Champion Line
                                    </Badge>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                    </svg>
                </div>
            </motion.section>

            {/* Main Content */}
            <div className="bg-white relative z-10">
                {/* Search and Filter Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="py-12 bg-gradient-light"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="glass-ocean rounded-2xl p-8 shadow-betta">
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search for your dream betta..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-4 py-6 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="flex gap-2 overflow-x-auto">
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            className={`whitespace-nowrap rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${selectedCategory === category.id
                                                    ? 'bg-gradient-betta-blue text-white shadow-betta'
                                                    : 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                                                }`}
                                        >
                                            <category.icon className="w-4 h-4 mr-2" />
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white font-semibold text-blue-700"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>

                                {/* View Mode */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setViewMode("grid")}
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        size="icon"
                                        className="rounded-xl"
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => setViewMode("list")}
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        size="icon"
                                        className="rounded-xl"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Results count */}
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-blue-600 font-semibold">
                                    {filteredProducts.length} premium bettas found
                                </p>

                                <div className="flex items-center gap-4">
                                    <Badge className="bg-gradient-premium text-white px-3 py-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Trending
                                    </Badge>
                                    <Badge className="bg-gradient-betta-purple text-white px-3 py-1">
                                        <Star className="w-3 h-3 mr-1" />
                                        Best Sellers
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Products Grid */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {filteredProducts.length > 0 ? (
                            <div className={`grid gap-8 ${viewMode === "grid"
                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "grid-cols-1"
                                }`}>
                                {filteredProducts.map((product, index) => (
                                    <HomeCardNew key={product.id} el={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <Fish className="w-24 h-24 text-blue-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-600 mb-4">No bettas found</h3>
                                <p className="text-gray-500 mb-8">Try adjusting your search or filters</p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                    }}
                                    className="bg-gradient-betta-blue text-white px-8 py-3 rounded-xl"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    View All Bettas
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
