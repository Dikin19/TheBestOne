import { useEffect, useState } from "react";
import axios from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        profilePicture: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        email: "",
        currentPassword: "",
        newPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [profileFile, setProfileFile] = useState(null);
    const [uploadType, setUploadType] = useState("url"); // "url" or "file"

    async function fetchProfile() {
        try {
            const { data } = await axios({
                method: "get",
                url: "/customers/profile",
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });
            setForm({
                profilePicture: data.profilePicture || "",
                fullName: data.fullName || "",
                phoneNumber: data.phoneNumber || "",
                address: data.address || "",
                email: data.email || "",
                currentPassword: "",
                newPassword: ""
            });
        } catch (error) {
            console.log(error);
            setError("Failed to fetch profile data");
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    async function handleEditProfile(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let requestData;
            let headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            };

            if (uploadType === "file" && profileFile) {
                // Use FormData for file upload
                requestData = new FormData();
                requestData.append('profilePicture', profileFile);
                requestData.append('fullName', form.fullName);
                requestData.append('phoneNumber', form.phoneNumber);
                requestData.append('address', form.address);
                requestData.append('email', form.email);
                if (form.currentPassword) requestData.append('currentPassword', form.currentPassword);
                if (form.newPassword) requestData.append('newPassword', form.newPassword);
                // Don't set Content-Type header for FormData
            } else {
                // Use JSON for URL-based profile picture
                requestData = form;
                headers['Content-Type'] = 'application/json';
            }

            const { data } = await axios({
                method: "put",
                url: "/customers/profile",
                data: requestData,
                headers: headers
            });
            console.log(data);
            nav('/profile');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            // Clear the URL field when file is selected
            setForm({ ...form, profilePicture: "" });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-cyan-400/15 to-blue-600/25 flex items-center justify-center px-4">
            <div className="bg-gradient-to-br from-blue-500/15 via-cyan-400/10 to-blue-600/15 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 overflow-hidden border border-blue-200/30">
                {/* Sidebar left */}
                <div className="bg-[#f53d2d] text-white p-6 flex items-center justify-center text-center md:text-left">
                    <h2 className="text-2xl font-bold">Welcome Back!<br />Update your profile below.</h2>
                </div>

                {/* Form section */}
                <div className="col-span-2 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEditProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>

                            {/* Upload Type Toggle */}
                            <div className="flex gap-4 mb-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="url"
                                        checked={uploadType === "url"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2"
                                    />
                                    URL
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="file"
                                        checked={uploadType === "file"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Upload File
                                </label>
                            </div>

                            {uploadType === "url" ? (
                                <input
                                    type="text"
                                    placeholder="Profile Picture URL"
                                    value={form.profilePicture}
                                    onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                                />
                            )}
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

                        {/* Password Change Section */}
                        <div className="border-t pt-4 mt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password (Optional)</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        value={form.currentPassword}
                                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="New Password (minimum 6 characters)"
                                        value={form.newPassword}
                                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f53d2d] text-white py-2 px-4 rounded-lg hover:bg-[#e03b27] transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
