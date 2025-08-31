import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Loading from './ui/loading';
import {
    AlertCircle,
    CheckCircle2,
    Brain,
    Sparkles,
    Star,
    Bot,
    Zap,
    Eye
} from 'lucide-react';

const ProductAnalysis = ({ productId }) => {
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingSteps = [
        { text: "Connecting to IBM Granite AI...", icon: Bot },
        { text: "Analyzing product specifications...", icon: Eye },
        { text: "Processing betta fish characteristics...", icon: Brain },
        { text: "Generating expert insights...", icon: Sparkles },
        { text: "Finalizing recommendations...", icon: Zap }
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            setLoadingStep(0);
            setProgress(0);

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100;
                    const newProgress = prev + Math.random() * 15 + 5;

                    // Update step based on progress
                    const currentStep = Math.floor((newProgress / 100) * loadingSteps.length);
                    setLoadingStep(Math.min(currentStep, loadingSteps.length - 1));

                    return Math.min(newProgress, 95); // Don't reach 100% until actually done
                });
            }, 300);
        } else {
            setProgress(0);
            setLoadingStep(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const generateReview = async () => {
        if (!productId) {
            setError('Product ID is required');
            return;
        }

        setLoading(true);
        setError(null);
        setReview(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Please login to use AI features');
            }

            const response = await fetch(`http://localhost:3000/granite/analysis/review/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate review');
            }

            // Complete the progress
            setProgress(100);
            setTimeout(() => {
                setReview(data.data);
            }, 500);
        } catch (err) {
            console.error('Review generation error:', err);
            setError(err.message || 'Failed to generate review');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 600);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* AI Analysis Generator */}
            <Card className="mb-6 sm:mb-8 border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-purple-800 text-lg sm:text-xl">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                        More explanation about your choices
                    </CardTitle>
                    <CardDescription className="text-purple-600 text-sm sm:text-base mt-1">
                        IBM Granite AI provides expert insights about this betta fish
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {error && (
                            <div className="flex items-start gap-3 p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-red-800 font-medium text-xs sm:text-sm">Error occurred</p>
                                    <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                            <Button
                                onClick={generateReview}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium h-12 sm:h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="relative">
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Bot className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <span className="text-base">Analyzing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                                        <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
                                        <span className="text-sm sm:text-base font-medium">See explanation</span>
                                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 opacity-80" />
                                    </div>
                                )}
                            </Button>

                            {/* Enhanced Loading State */}
                            {loading && (
                                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">AI Analysis Progress</span>
                                            <span className="text-xs sm:text-sm text-purple-600 font-semibold">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Step */}
                                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                                        <div className="relative">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                {React.createElement(loadingSteps[loadingStep]?.icon || Bot, {
                                                    className: "w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse"
                                                })}
                                            </div>
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30 animate-ping"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                                                {loadingSteps[loadingStep]?.text || "Processing..."}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                                                        style={{
                                                            animationDelay: `${i * 0.2}s`,
                                                            animationDuration: '1s'
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loading Animation */}
                                    <div className="flex justify-center items-center py-3 sm:py-4">
                                        <div className="flex space-x-1 sm:space-x-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: `${i * 0.1}s`,
                                                        animationDuration: '1.4s'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fun Facts During Loading */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-amber-200">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-amber-800 mb-1">Did you know?</p>
                                                <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                                                    Betta fish can live up to 3-5 years with proper care and have unique personalities!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!loading && !review && (
                                <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
                                    Click the button above to know insights about this product
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Review Result */}
            {review && (
                <div className="space-y-6">
                    {/* Header Section */}
                    <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <CheckCircle2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl font-bold text-white">
                                            Complete
                                        </CardTitle>
                                        <p className="text-green-100 text-sm mt-1">
                                            Expert insights for you
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Product Information Card */}
                    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-800">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Star className="h-4 w-4 text-white" />
                                </div>
                                Product Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                                        Product Name
                                    </div>
                                    <div className="text-sm font-semibold text-blue-900 break-words">
                                        {review.product.name}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
                                        Category
                                    </div>
                                    <div className="text-sm font-semibold text-purple-900">
                                        {review.product.category || 'No category'}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 sm:col-span-2 lg:col-span-1">
                                    <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">
                                        Price
                                    </div>
                                    <div className="text-sm font-bold text-green-900">
                                        Rp {review.product.price?.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Review Card */}
                    <Card className="border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-purple-100">
                            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-purple-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Brain className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-purple-600 font-normal">
                                            Detailed insights and recommendations
                                        </div>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative">
                                {/* Content Area */}
                                <div className="p-6 sm:p-8">
                                    <div className="prose prose-sm sm:prose max-w-none">
                                        <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-xl p-6 sm:p-8 border-l-4 border-purple-400 shadow-inner">
                                            {/* Decorative Elements */}
                                            <div className="absolute top-4 right-4 opacity-10">
                                                <Sparkles className="h-8 w-8 text-purple-500" />
                                            </div>

                                            {/* Review Text */}
                                            <div className="relative z-10">
                                                <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-gray-800 font-medium">
                                                    {review.review}
                                                </div>
                                            </div>

                                            {/* AI Signature */}
                                            <div className="mt-6 pt-4 border-t border-purple-200">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2 text-xs text-purple-600">
                                                        <Bot className="h-4 w-4" />
                                                        <span className="font-medium">Explanation is explained by IBM Granite AI</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Date : • {new Date().toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Accent */}
                                <div className="h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ProductAnalysis;
