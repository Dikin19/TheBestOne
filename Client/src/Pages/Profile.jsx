import { useEffect, useState } from "react";
import ProfileCard from "../Components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/productSlice";


export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.product.Profile);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchProfileData = async () => {
            await dispatch(fetchProfile());
            // Trigger update navbar setelah fetch profile
            window.dispatchEvent(new Event('profilePictureUpdated'));
        };
        fetchProfileData();
    }, [dispatch])

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-gradient-to-br from-blue-600/10 via-blue-500/8 to-cyan-600/12 py-4">
                        <div className="container mx-auto px-4 max-w-6xl">
                            {/* Header Section */}
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-blue-800 mb-2">Professional Breeder Profile</h1>
                                <p className="text-blue-600/80 text-lg">Advanced Betta Fish Breeding Management Dashboard</p>
                            </div>

                            {/* Profile Card - Compact Row Layout */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden mb-14">
                                <ProfileCard el={profile} />
                            </div>
                        </div>
                    </div>
                );
        };
    }

    return (
        <div className="bg-gradient-to-br from-blue-600/15 via-blue-700/10 to-cyan-600/15">
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {renderTabContent()}
            </div>
        </div>
    );
}
