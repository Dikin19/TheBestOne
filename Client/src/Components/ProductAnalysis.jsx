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
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* AI Analysis Generator */}
            <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                        <Sparkles className="w-5 h-5" />
                        More explanation about your choices
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                        IBM Granite AI provides expert insights about this betta fish
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-6">
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-red-800 font-medium text-sm">Error occurred</p>
                                    <p className="text-red-700 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <Button
                                onClick={generateReview}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70"
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
                                    <div className="flex items-center justify-center gap-3">
                                        <Brain className="h-6 w-6" />
                                        <span className="text-base font-medium">See explanation</span>
                                        <Sparkles className="h-5 w-5 opacity-80" />
                                    </div>
                                )}
                            </Button>

                            {/* Enhanced Loading State */}
                            {loading && (
                                <div className="mt-6 space-y-4">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">AI Analysis Progress</span>
                                            <span className="text-sm text-purple-600 font-semibold">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Step */}
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                                        <div className="relative">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                {React.createElement(loadingSteps[loadingStep]?.icon || Bot, {
                                                    className: "w-4 h-4 text-white animate-pulse"
                                                })}
                                            </div>
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30 animate-ping"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">
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
                                    <div className="flex justify-center items-center py-4">
                                        <div className="flex space-x-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: `${i * 0.1}s`,
                                                        animationDuration: '1.4s'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fun Facts During Loading */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-800 mb-1">Did you know?</p>
                                                <p className="text-sm text-amber-700">
                                                    Betta fish can live up to 3-5 years with proper care and have unique personalities!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!loading && !review && (
                                <p className="text-center text-gray-500 text-sm mt-4">
                                    Click the button above to get AI-powered insights about this product
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Review Result */}
            {review && (
                <Card className="border border-green-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-lg text-green-800">You will know more about your product</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Product Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    Product Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Name:</strong> {review.product.name}</p>
                                    <p><strong>Category:</strong> {review.product.category || 'No category'}</p>
                                    <p><strong>Price:</strong> Rp {review.product.price?.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* AI Review */}
                            <div className="bg-white border-2 border-purple-100 p-6 rounded-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <Brain className="h-5 w-5 text-purple-500" />
                                    <h4 className="font-semibold text-purple-800">Here we go : </h4>
                                </div>
                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-md border-l-4 border-purple-400">
                                        {review.review}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductAnalysis;
