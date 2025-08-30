import { NavLink} from "react-router-dom";
import { Edit3, Phone, MapPin, Mail, Calendar, Crown, Fish, Shield, Waves } from "lucide-react";

export default function ProfileCard({ el }) {

    const formatDate = (dateString) => {
        if (!dateString) return "Tidak tersedia";
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                {/* Compact Row Layout */}
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Profile Info */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-white relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 opacity-10">
                            <Waves className="w-full h-full object-cover" />
                        </div>

                        {/* Profile Picture and Info */}
                        <div className="relative z-10 text-center">
                            <div className="relative inline-block mb-4">
                                <img
                                    src={el.profilePicture || '/api/placeholder/100/100'}
                                    className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                                    alt="Profile"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                                    <Fish className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-1 text-white">
                                {el.fullName || "Pecinta Cupang"}
                            </h2>

                            <div className="flex items-center justify-center space-x-1 mb-3">
                                <Shield className="w-4 h-4 text-blue-200" />
                                <span className="text-sm text-blue-100">Certified Professional Breeder</span>
                            </div>

                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <Crown className="w-4 h-4 text-blue-200 mr-1" />
                                <span className="text-xs font-medium text-white">Elite Member</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Contact Info & Actions */}
                    <div className="lg:w-2/3 p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                        {/* Contact Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-blue-600">WhatsApp</p>
                                    <p className="text-sm text-gray-800 truncate">{el.phoneNumber || "Tidak tersedia"}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-emerald-600">Email</p>
                                    <p className="text-sm text-gray-800 truncate">{el.email || "Tidak tersedia"}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-purple-600">Lokasi</p>
                                    <p className="text-sm text-gray-800 truncate">{el.address || "Tidak tersedia"}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-orange-600">Bergabung</p>
                                    <p className="text-sm text-gray-800 truncate">{formatDate(el.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <NavLink
                                to="/update-profile"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg text-sm"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
