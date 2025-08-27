import { useState } from 'react';
import axios from '../config/axiosInstance';

export default function ProductAnalysis({ productId }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('review');
    const [copyType, setCopyType] = useState('social_media');
    const [compareProducts, setCompareProducts] = useState([]);
    const [comparisonResult, setComparisonResult] = useState(null);

    // Generate Product Review
    const generateReview = async () => {
        setLoading(true);
        try {
            const { data } = await axios({
                method: 'get',
                url: `/granite/analysis/review/${productId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setAnalysis(data.data);
        } catch (error) {
            console.error('Error generating review:', error);
            alert('Failed to generate review');
        } finally {
            setLoading(false);
        }
    };

    // Analyze Product Performance
    const analyzePerformance = async () => {
        setLoading(true);
        try {
            const { data } = await axios({
                method: 'get',
                url: `/granite/analysis/performance/${productId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setAnalysis(data.data);
        } catch (error) {
            console.error('Error analyzing performance:', error);
            alert('Failed to analyze performance');
        } finally {
            setLoading(false);
        }
    };

    // Generate Marketing Copy
    const generateMarketingCopy = async () => {
        setLoading(true);
        try {
            const { data } = await axios({
                method: 'get',
                url: `/granite/analysis/marketing-copy/${productId}?copyType=${copyType}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setAnalysis(data.data);
        } catch (error) {
            console.error('Error generating marketing copy:', error);
            alert('Failed to generate marketing copy');
        } finally {
            setLoading(false);
        }
    };

    // Compare Products
    const compareProductsAnalysis = async () => {
        if (compareProducts.length < 2) {
            alert('Please select at least 2 products to compare');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios({
                method: 'post',
                url: `/granite/analysis/compare`,
                data: {
                    productIds: compareProducts
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setComparisonResult(data.data);
        } catch (error) {
            console.error('Error comparing products:', error);
            alert('Failed to compare products');
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'review':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">AI Product Review</h3>
                            <button
                                onClick={generateReview}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Generating...' : 'Generate Review'}
                            </button>
                        </div>
                        {analysis?.review && (
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h4 className="font-semibold mb-2">Product: {analysis.product.name}</h4>
                                <div className="prose max-w-none">
                                    {analysis.review.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'performance':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Performance Analysis</h3>
                            <button
                                onClick={analyzePerformance}
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Analyzing...' : 'Analyze Performance'}
                            </button>
                        </div>
                        {analysis?.statistics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-blue-600">{analysis.statistics.totalOrders}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Units Sold</p>
                                    <p className="text-2xl font-bold text-green-600">{analysis.statistics.totalQuantitySold}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Revenue</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        Rp {analysis.statistics.totalRevenue?.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Avg Order Qty</p>
                                    <p className="text-2xl font-bold text-purple-600">{analysis.statistics.averageOrderQuantity}</p>
                                </div>
                            </div>
                        )}
                        {analysis?.analysis && (
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                                <div className="prose max-w-none">
                                    {analysis.analysis.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'marketing':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Marketing Copy Generator</h3>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={copyType}
                                    onChange={(e) => setCopyType(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="social_media">Social Media</option>
                                    <option value="email">Email Marketing</option>
                                    <option value="website">Website Copy</option>
                                    <option value="ads">Digital Ads</option>
                                </select>
                                <button
                                    onClick={generateMarketingCopy}
                                    disabled={loading}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                                >
                                    {loading ? 'Generating...' : 'Generate Copy'}
                                </button>
                            </div>
                        </div>
                        {analysis?.marketingCopy && (
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h4 className="font-semibold mb-2">
                                    {analysis.copyType.replace('_', ' ').toUpperCase()} Copy for {analysis.product.name}
                                </h4>
                                <div className="prose max-w-none">
                                    {analysis.marketingCopy.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'compare':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Product Comparison</h3>
                            <button
                                onClick={compareProductsAnalysis}
                                disabled={loading || compareProducts.length < 2}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Comparing...' : 'Compare Products'}
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <label className="block text-sm font-medium mb-2">
                                Select Products to Compare (at least 2):
                            </label>
                            <input
                                type="text"
                                placeholder="Enter product IDs separated by commas (e.g., 1,2,3)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                onChange={(e) => {
                                    const ids = e.target.value.split(',').map(id => parseInt(id.trim())).filter(Boolean);
                                    setCompareProducts(ids);
                                }}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Current product ({productId}) will be included automatically
                            </p>
                        </div>
                        {comparisonResult?.comparison && (
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h4 className="font-semibold mb-2">Product Comparison Results</h4>
                                <div className="prose max-w-none">
                                    {comparisonResult.comparison.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-2">🤖 AI Product Analysis</h2>
                <p className="text-blue-100">Powered by IBM Granite - Advanced product insights and analysis</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {[
                    { id: 'review', name: 'Product Review', icon: '⭐' },
                    { id: 'performance', name: 'Performance Analysis', icon: '📊' },
                    { id: 'marketing', name: 'Marketing Copy', icon: '📝' },
                    { id: 'compare', name: 'Product Comparison', icon: '🔄' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setAnalysis(null);
                            setComparisonResult(null);
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
                {renderTabContent()}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-lg font-medium">IBM Granite is analyzing...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
