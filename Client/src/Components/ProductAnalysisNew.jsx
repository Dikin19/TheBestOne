import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Loading from './ui/loading';
import {
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Brain,
    Sparkles,
    Star
} from 'lucide-react';

const ProductAnalysisNew = ({ productId }) => {
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);

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

            setReview(data.data);
        } catch (err) {
            console.error('Review generation error:', err);
            setError(err.message || 'Failed to generate review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    <h2 className="text-2xl font-bold">AI Product Review</h2>
                </div>
                <p className="text-gray-600">
                    Generate an engaging product review using IBM Granite AI
                </p>
            </div>

            {/* Generate Review Button */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        <CardTitle>Product Review Generator</CardTitle>
                    </div>
                    <CardDescription>
                        Click the button below to generate an attractive review that will interest customers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        )}

                        <Button
                            onClick={generateReview}
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loading size="sm" />
                                    <span>Generating Review...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    <span>Generate AI Review</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Review Result */}
            {review && (
                <Card className="border border-green-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-lg text-green-800">AI Generated Review</CardTitle>
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
                                    <h4 className="font-semibold text-purple-800">AI Review</h4>
                                </div>
                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-md border-l-4 border-purple-400">
                                        {review.review}
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
                                <p className="text-center text-purple-800 font-medium">
                                    ✨ This review was generated by IBM Granite AI to help customers make informed decisions ✨
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductAnalysisNew;
