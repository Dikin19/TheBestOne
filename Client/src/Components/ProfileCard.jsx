import { NavLink, useNavigate } from "react-router-dom";
import axios from '../config/axiosInstance';

export default function ProfileCard({ el }) {
    const nav = useNavigate();

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

        console.log("Token:", token); // Debug
        console.log("User ID (from token):", userId); // Debug

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
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <img
                src={el.profilePicture}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                alt="Profile"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{el.fullName}</h3>
            <p className="text-gray-600">📞 {el.phoneNumber}</p>
            <p className="text-gray-600">📍 {el.address}</p>
            <div className="mt-4 flex justify-center gap-4">
                <NavLink
                    to={`/editprofile/${el._id}`}
                    className="bg-[#f53d2d] text-white px-6 py-2 rounded-lg hover:bg-[#e03b27] transition duration-300"
                >
                    Update
                </NavLink>
                <button
                    onClick={handleDelete}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
