import { motion } from "framer-motion";
import { ShoppingBag, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Instagram, href: "#", color: "hover:text-pink-500" },
        { icon: Twitter, href: "#", color: "hover:text-blue-400" },
        { icon: Facebook, href: "#", color: "hover:text-blue-600" },
        { icon: Youtube, href: "#", color: "hover:text-red-500" },
    ];

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold">TheBestOne</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Your premium destination for quality products. We bring you the finest selection
                            with exceptional service and unmatched quality.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-2 bg-slate-800 rounded-lg transition-colors ${social.color}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'Products', 'About Us', 'Contact', 'FAQ'].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to="/"
                                        className="text-slate-400 hover:text-amber-400 transition-colors duration-300"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Customer Service */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-white">Customer Service</h3>
                        <ul className="space-y-3">
                            {['Track Your Order', 'Returns & Exchanges', 'Shipping Info', 'Size Guide', 'Care Instructions'].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to="/"
                                        className="text-slate-400 hover:text-amber-400 transition-colors duration-300"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400">
                                <MapPin className="h-5 w-5 text-amber-400" />
                                <span>123 Premium Street, Luxury City, LC 12345</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone className="h-5 w-5 text-amber-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail className="h-5 w-5 text-amber-400" />
                                <span>hello@thebestong.com</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Stay Updated with Our Latest Offers
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Subscribe to our newsletter and be the first to know about new products and exclusive deals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-slate-400 text-sm"
                        >
                            © {currentYear} TheBestOne. All rights reserved.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex gap-6 text-sm"
                        >
                            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">
                                Cookie Policy
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
