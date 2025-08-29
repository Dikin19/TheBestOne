import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Eye, Fish, Crown, Award, Waves } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatPrice, truncateText } from "../lib/utils";
import { useState } from "react";

export default function HomeCard({ el, index }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    const discount = Math.floor(Math.random() * 30) + 10; // Random discount 10-40%
    const originalPrice = el.price * (1 + discount / 100);

    // Betta fish quality indicators
    const qualityBadges = [
        { label: "Premium", icon: Crown, color: "bg-amber-500" },
        { label: "Champion", icon: Award, color: "bg-purple-500" },
        { label: "Rare", icon: Star, color: "bg-pink-500" },
        { label: "Show Quality", icon: Fish, color: "bg-blue-500" }
    ];

    const randomBadge = qualityBadges[Math.floor(Math.random() * qualityBadges.length)];

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
                y: -8,
                transition: { duration: 0.3 }
            }}
            className="group"
        >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border border-blue-100/50">
                <div className="relative overflow-hidden">
                    {/* Premium Quality Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute top-3 left-3 z-10"
                    >
                        <Badge className={`text-xs font-bold text-white ${randomBadge.color} flex items-center gap-1`}>
                            <randomBadge.icon className="h-3 w-3" />
                            {randomBadge.label}
                        </Badge>
                    </motion.div>

                    {/* Discount Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="absolute top-3 right-12 z-10"
                    >
                        <Badge variant="destructive" className="text-xs font-bold">
                            -{discount}%
                        </Badge>
                    </motion.div>

                    {/* Like Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLiked(!isLiked);
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-blue-100"
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-600'
                                }`}
                        />
                    </motion.button>

                    {/* Product Image */}
                    <Link to={`/detail/${el.id}`} className="block relative group">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
                            <motion.img
                                src={el.imgUrl}
                                alt={el.name}
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setIsImageLoaded(true)}
                                loading="lazy"
                            />
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100 animate-pulse flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Fish className="h-8 w-8 text-blue-400 animate-bounce" />
                                        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Underwater Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                        {/* Overlay with Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <div className="flex gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button size="sm" className="rounded-full bg-white/90 text-blue-700 hover:bg-white border border-blue-200">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                <CardContent className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < rating ? 'text-blue-400 fill-blue-400' : 'text-slate-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({rating}.0)</span>
                        <Fish className="h-3 w-3 text-blue-400 ml-1" />
                    </div>

                    {/* Product Name */}
                    <Link to={`/detail/${el.id}`}>
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                            {truncateText(el.name, 50)}
                        </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-blue-700">
                            {formatPrice(el.price)}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">
                        {truncateText(el.description, 80)}
                    </p>

                    {/* Betta Fish Specific Info */}
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            <Waves className="h-2 w-2 mr-1" />
                            Healthy
                        </Badge>
                        <Badge variant="outline" className="text-xs border-teal-200 text-teal-700">
                            <Crown className="h-2 w-2 mr-1" />
                            Show Quality
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link to={`/detail/${el.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full hover:bg-blue-50 border-blue-200 text-blue-700"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View Betta
                        </Button>
                    </Link>
                    <Button
                        className="shrink-0 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                        size="icon"
                        onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic here
                        }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
