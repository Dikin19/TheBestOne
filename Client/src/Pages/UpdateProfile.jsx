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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 flex items-center justify-center px-4 py-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 overflow-hidden border border-blue-100">
                {/* Sidebar left */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 flex items-center justify-center text-center">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Welcome Back!</h2>
                        <p className="text-blue-100 text-sm">Update your profile information</p>
                    </div>
                </div>

                {/* Form section */}
                <div className="col-span-2 p-6">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Profile</h2>

                    {error && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEditProfile} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">Profile Picture</label>

                            {/* Upload Type Toggle */}
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="url"
                                        checked={uploadType === "url"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2 text-blue-600"
                                    />
                                    URL
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="file"
                                        checked={uploadType === "file"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2 text-blue-600"
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
                                    className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-blue-900 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-900 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                    className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">Address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        {/* Password Change Section */}
                        <div className="border-t border-blue-200 pt-3 mt-4">
                            <h3 className="text-base font-medium text-blue-900 mb-3">Change Password (Optional)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        value={form.currentPassword}
                                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="New Password (min 6 chars)"
                                        value={form.newPassword}
                                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
