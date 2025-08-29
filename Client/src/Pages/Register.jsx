import { useState } from "react";
import { motion } from "framer-motion";
import axios from "../config/axiosInstance";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/card";
import { User, Mail, Lock, Fish, Eye, EyeOff, Sparkles } from "lucide-react";
import Swal from "sweetalert2";

export default function Register() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (localStorage.getItem("access_token")) {
        return <Navigate to="/" />;
    }

    async function handleRegister(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios({
                method: "post",
                url: "/register",
                data: {
                    ...form,
                    phoneNumber: "", // Default empty values for required backend fields
                    address: "",
                    profilePicture: ""
                }
            });

            Swal.fire({
                title: "Success!",
                text: "Account created successfully! Please login to continue.",
                icon: "success",
                confirmButtonColor: "#1e40af"
            });

            nav("/login");
        } catch (error) {
            let message = "Something went wrong. Please try again.";
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonColor: "#dc2626"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-cyan-400/15 to-blue-600/25 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="glass shadow-xl border-0 backdrop-blur-xl">
                    <CardHeader className="text-center pb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg"
                        >
                            <Fish className="w-6 h-6 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            BluerimDepok
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                            Create your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 px-6 pb-6">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-1"
                            >
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-1"
                            >
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-1"
                            >
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-500" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a secure password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2"
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            Create Account
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center pt-3 border-t border-gray-200"
                        >
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
