import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from '../config/axiosInstance';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, Sparkles } from 'lucide-react';

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
            const { data } = await axios.post('/login', { email, password });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('profilePicture', data.user.profilePicture);

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Signed in successfully',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            navigate('/');
        } catch (error) {
            let message = 'Oops something went wrong!';
            if (error.response) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCredentialResponse(response) {
        setIsLoading(true);
        try {
            const { data } = await axios.post('/google-login', {
                googleToken: response.credential,
            });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('profilePicture', data.user.profilePicture);

            navigate('/');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: '671432847103-47644tqd66u9kkoo9f9d2q8ea0ij9qka.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(document.getElementById('google-button'), {
            theme: 'outline',
            size: 'large',
        });

        google.accounts.id.prompt();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-amber-400/10 to-amber-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: [360, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-slate-400/10 to-slate-600/10 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200
                            }}
                            className="flex items-center justify-center gap-3 mb-4"
                        >
                            <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>

                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-slate-600 mt-2">
                            Sign in to your TheBestOne account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 text-lg"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-12 h-12 text-lg"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 mr-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <div id="google-button" className="mt-4 flex justify-center [&>div]:w-full [&>div>div]:w-full [&>div>div]:justify-center"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                                >
                                    Create account
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
