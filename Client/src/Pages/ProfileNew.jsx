import { useEffect, useState } from "react";
import ProfileCard from "../Components/ProfileCard";
import ProductAnalysis from "../Components/ProductAnalysis";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/productSlice";
import {
    User,
    Brain,
    Sparkles,
    Settings,
    Star,
    TrendingUp,
    ShoppingBag,
    Award,
    MessageSquare
} from "lucide-react";

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.product.Profile);
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    const tabs = [
        { id: 'profile', label: 'Profil Saya', icon: User },
        { id: 'ai-review', label: 'AI Review Generator', icon: Brain },
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
        { id: 'settings', label: 'Pengaturan', icon: Settings }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <ProfileCard el={profile} />
                        </div>

                        {/* Profile Statistics & Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Welcome Section */}
                            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            Selamat Datang, {profile.fullName?.split(' ')[0] || 'User'}! 🎉
                                        </h3>
                                        <p className="text-white/90">
                                            Anda adalah member premium dengan akses penuh ke fitur AI
                                        </p>
                                    </div>
                                    <Award className="w-16 h-16 text-yellow-300" />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-800">0</h4>
                                    <p className="text-gray-600 text-sm">Total Pesanan</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Star className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-800">5.0</h4>
                                    <p className="text-gray-600 text-sm">Rating Anda</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Brain className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-800">0</h4>
                                    <p className="text-gray-600 text-sm">AI Reviews Generated</p>
                                </div>
                            </div>

                            {/* Account Benefits */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                                    Premium Benefits
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Brain className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">Unlimited AI Reviews</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Star className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">Priority Support</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <TrendingUp className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">Advanced Analytics</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-yellow-100 p-2 rounded-lg">
                                            <Award className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <span className="text-gray-700">Exclusive Features</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'ai-review':
                return (
                    <div className="max-w-4xl mx-auto">
                        {selectedProductId ? (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <Brain className="w-6 h-6 text-purple-500 mr-2" />
                                            AI Review Generator
                                        </h3>
                                        <button
                                            onClick={() => setSelectedProductId(null)}
                                            className="text-gray-500 hover:text-gray-700 text-sm"
                                        >
                                            ← Kembali
                                        </button>
                                    </div>
                                    <ProductAnalysis productId={selectedProductId} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
                                    <Brain className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                                    <h3 className="text-3xl font-bold mb-2">
                                        AI Review Generator
                                    </h3>
                                    <p className="text-white/90 text-lg">
                                        Powered by IBM Granite AI untuk membuat review produk yang menarik dan persuasif
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                            <MessageSquare className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Review Persuasif
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Generate review yang engaging dan meyakinkan untuk menarik customer
                                        </p>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Contoh output:</p>
                                            <p className="text-sm text-gray-700 italic">
                                                "Produk ini benar-benar excellent! Kualitas premium dengan harga yang sangat reasonable..."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                            <Star className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Analisis Mendalam
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            AI menganalisis produk berdasarkan harga, kualitas, dan value proposition
                                        </p>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Mencakup:</p>
                                            <p className="text-sm text-gray-700">
                                                ✓ Value for money<br />
                                                ✓ Target audience<br />
                                                ✓ Pro & kontra produk
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Start Analysis */}
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                    <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                        Mulai Generate Review
                                    </h4>
                                    <p className="text-gray-600 mb-6">
                                        Masukkan ID produk untuk membuat review AI yang menarik
                                    </p>
                                    <div className="max-w-md mx-auto">
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                placeholder="Masukkan Product ID"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                onChange={(e) => setSelectedProductId(e.target.value)}
                                            />
                                            <button
                                                onClick={() => selectedProductId && setSelectedProductId(selectedProductId)}
                                                disabled={!selectedProductId}
                                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'dashboard':
                return (
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Dashboard Header */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h3>
                                    <p className="text-gray-600">Monitor aktivitas dan performa akun Anda</p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-green-500" />
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Pesanan</p>
                                        <p className="text-3xl font-bold text-gray-800">0</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 mt-2">↗ 0% dari bulan lalu</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">AI Reviews</p>
                                        <p className="text-3xl font-bold text-gray-800">0</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <Brain className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 mt-2">Ready to generate</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Member Since</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {new Date(profile.createdAt).getFullYear() || '2024'}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">Premium member</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Rating</p>
                                        <p className="text-3xl font-bold text-gray-800">5.0</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Star className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 mt-2">★★★★★ Excellent</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h4>
                            <div className="text-center py-8">
                                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Belum ada aktivitas</p>
                                <p className="text-sm text-gray-400">Mulai gunakan fitur AI Review untuk melihat aktivitas</p>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-center mb-8">
                                <Settings className="w-16 h-16 text-[#f53d2d] mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Pengaturan
                                </h3>
                                <p className="text-gray-600">
                                    Kelola preferensi dan pengaturan akun Anda
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Notifikasi</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#f53d2d]" defaultChecked />
                                            <span className="ml-2 text-gray-700">Email notifications</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#f53d2d]" />
                                            <span className="ml-2 text-gray-700">SMS notifications</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#f53d2d]" defaultChecked />
                                            <span className="ml-2 text-gray-700">Push notifications</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Privacy</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#f53d2d]" defaultChecked />
                                            <span className="ml-2 text-gray-700">Profile visible to others</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#f53d2d]" />
                                            <span className="ml-2 text-gray-700">Show online status</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-800 mb-3">Account Actions</h4>
                                    <div className="space-y-3">
                                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300 text-left">
                                            Download my data
                                        </button>
                                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300 text-left">
                                            Export purchase history
                                        </button>
                                        <button className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition duration-300 text-left">
                                            Deactivate account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={profile.profilePicture || '/api/placeholder/40/40'}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Halo, {profile.fullName || 'User'}
                                </h1>
                                <p className="text-gray-600">
                                    Selamat datang di dashboard personal Anda
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#f53d2d] to-[#e03b27] text-white px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium">Premium Member</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                        ? 'border-[#f53d2d] text-[#f53d2d]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderTabContent()}
            </div>
        </div>
    );
}
