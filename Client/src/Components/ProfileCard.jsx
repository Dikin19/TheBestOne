import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Edit3, Trash2, Phone, MapPin, Mail, Calendar } from "lucide-react";
import axios from '../config/axiosInstance';

export default function ProfileCard({ el }) {
    const nav = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Ambil user ID dari JWT token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        const payload = token.split('.')[1];
        if (!payload) return null;

        try {
            const decoded = JSON.parse(atob(payload));
            return decoded.id;
        } catch (err) {
            console.error("Gagal decode token:", err);
            return null;
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('access_token');
        const userId = getUserIdFromToken();

        if (!token || !userId) {
            alert("Access token atau ID tidak ditemukan. Silakan login ulang.");
            return;
        }

        try {
            const response = await axios.delete(`/customers/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            alert("Akun berhasil dihapus.");
            localStorage.clear();
            nav('/register', { replace: true });
        } catch (error) {
            console.error("Gagal menghapus profil:", error);

            if (error.response) {
                console.error("Detail error:", error.response.data);
                alert(`Gagal menghapus akun: ${error.response.data.message || "Internal Server Error"}`);
            } else if (error.request) {
                alert("Tidak ada respons dari server.");
            } else {
                alert("Terjadi kesalahan saat mencoba menghapus akun.");
            }
        }
        setShowDeleteModal(false);
    };

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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-[#f53d2d] to-[#e03b27] p-6 text-white relative">
                    <div className="absolute top-4 right-4">
                        <div className="bg-white/20 rounded-full p-2">
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <img
                                src={el.profilePicture || '/api/placeholder/120/120'}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                        </div>
                    </div>

                    {/* Name and Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-1">{el.fullName || "Nama tidak tersedia"}</h2>
                        <p className="text-white/80 text-sm">Member Premium</p>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="p-6 space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Mail className="w-5 h-5 text-[#f53d2d]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-500 truncate">{el.email || "Email tidak tersedia"}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Phone className="w-5 h-5 text-[#f53d2d]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Telepon</p>
                                <p className="text-sm text-gray-500">{el.phoneNumber || "Nomor tidak tersedia"}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <MapPin className="w-5 h-5 text-[#f53d2d]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Alamat</p>
                                <p className="text-sm text-gray-500">{el.address || "Alamat tidak tersedia"}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <Calendar className="w-5 h-5 text-[#f53d2d]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Bergabung Sejak</p>
                                <p className="text-sm text-gray-500">{formatDate(el.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <NavLink
                            to="/update-profile"
                            className="flex-1 bg-[#f53d2d] text-white px-4 py-2.5 rounded-lg hover:bg-[#e03b27] transition duration-300 flex items-center justify-center space-x-2 font-medium"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </NavLink>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center space-x-2 font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">0</p>
                            <p className="text-xs text-gray-500">Pesanan</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">0</p>
                            <p className="text-xs text-gray-500">Wishlist</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">★★★★★</p>
                            <p className="text-xs text-gray-500">Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <div className="text-center">
                            <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-fit">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Akun</h3>
                            <p className="text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
