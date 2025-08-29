import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from '../config/axiosInstance';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Eye, EyeOff, Mail, Lock, Fish, Sparkles, Chrome } from 'lucide-react';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (localStorage.getItem('access_token')) {
        return <Navigate to="/" />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('email');
            localStorage.removeItem('profilePicture');

            const { data } = await axios.post('/login', { email, password });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('profilePicture', data.user.profilePicture || '');

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Welcome back to TheBestOne!',
                text: 'Signed in successfully',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            navigate('/');
        } catch (error) {
            let message = 'Invalid email or password';
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: 'Login Failed',
                text: message,
                icon: 'error',
                confirmButtonColor: '#dc2626'
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-lg"
            >
                <Card className="glass shadow-2xl border-0 backdrop-blur-xl">
                    <CardHeader className="text-center pb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                        >
                            <Fish className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            Sign in to explore premium betta fish
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-500" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Signing In...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200"
                                onClick={() => {
                                    Swal.fire({
                                        title: 'Google Sign-In',
                                        text: 'Google Sign-In will be available soon. Please use email/password for now.',
                                        icon: 'info',
                                        confirmButtonColor: '#3b82f6'
                                    });
                                }}
                            >
                                <Chrome className="w-5 h-5 mr-2" />
                                Continue with Google
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center pt-4 border-t border-gray-200"
                        >
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                >
                                    Create one here
                                </Link>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default Login;
