import { NavLink, useNavigate } from "react-router-dom";
import axios from '../config/axiosInstance';

export default function ProfileCard({ el }) {
    const nav = useNavigate();

    const handleDelete = async () => {
        try {
            await axios({
                method: "delete",
                url: `/customers/profile/${el.id}`,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });

            localStorage.clear();
            nav('/register', { replace: true });
        } catch (error) {
            console.log(error);
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
                    to={`/editprofile/${el.id}`}
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
