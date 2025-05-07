import { useEffect, useState } from "react";
import axios from '../config/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProfile() {
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState({
        profilePicture: "",
        fullName: "",
        phoneNumber: "",
        address: "",
    });

    async function fetchProfile() {
        try {
            const { data } = await axios({
                method: "get",
                url: "/customers/profile",
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });
            setForm(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    async function handleEditProfile(e) {
        e.preventDefault();
        try {
            const { data } = await axios({
                method: "put",
                url: `/customers/profile/${id}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            console.log(data);
            nav('/profile');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
                {/* Sidebar left */}
                <div className="bg-[#f53d2d] text-white p-6 flex items-center justify-center text-center md:text-left">
                    <h2 className="text-2xl font-bold">Welcome Back!<br />Update your profile below.</h2>
                </div>

                {/* Form section */}
                <div className="col-span-2 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                    <form onSubmit={handleEditProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                            <input
                                type="text"
                                placeholder="Profile Picture URL"
                                value={form.profilePicture}
                                onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-[#f53d2d] text-white py-2 px-4 rounded-lg hover:bg-[#e03b27] transition duration-300 font-semibold"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
