import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function Navbar() {
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("email");
        localStorage.removeItem("profilePicture");
        nav("/login");
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                            className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 bg-clip-text text-transparent"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <ShoppingBag className="h-8 w-8 text-amber-600" />
                            </motion.div>
                            TheBestOne
                        </NavLink>
                    </motion.div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `relative text-lg font-medium transition-all duration-300 group ${isActive
                                    ? "text-amber-600"
                                    : "text-slate-700 hover:text-amber-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    Home
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isActive ? 1 : 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `relative text-lg font-medium transition-all duration-300 group ${isActive
                                    ? "text-amber-600"
                                    : "text-slate-700 hover:text-amber-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Profile
                                    </div>
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isActive ? 1 : 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </>
                            )}
                        </NavLink>
                    </div>

                    {/* Desktop Logout Button */}
                    <div className="hidden md:block">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            onClick={toggleMenu}
                            variant="ghost"
                            size="icon"
                            className="text-slate-700"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isMenuOpen ? "auto" : 0,
                        opacity: isMenuOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="py-4 space-y-4 border-t border-slate-200 mt-4">
                        <NavLink
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block text-lg font-medium transition-colors ${isActive
                                    ? "text-amber-600"
                                    : "text-slate-700 hover:text-amber-600"
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-2 text-lg font-medium transition-colors ${isActive
                                    ? "text-amber-600"
                                    : "text-slate-700 hover:text-amber-600"
                                }`
                            }
                        >
                            <User className="h-5 w-5" />
                            Profile
                        </NavLink>

                        <Button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full justify-start gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </motion.div>
            </div>
        </motion.nav>
    );
}

export default Navbar;
