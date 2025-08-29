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

            // Update localStorage dengan profile picture terbaru
            if (data.profilePicture) {
                localStorage.setItem('profilePicture', data.profilePicture);
                // Trigger custom event untuk memperbarui navbar
                window.dispatchEvent(new Event('profilePictureUpdated'));
            }

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Left Info Panel */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 flex flex-col justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                {form.profilePicture || (profileFile && URL.createObjectURL(profileFile)) ? (
                                    <img
                                        src={profileFile ? URL.createObjectURL(profileFile) : form.profilePicture}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold mb-1">{form.fullName || "Your Name"}</h3>
                            <p className="text-slate-300 text-xs">{form.email || "your.email@example.com"}</p>
                            <div className="mt-3 space-y-1 text-xs text-slate-300">
                                <p className="text-xs">{form.phoneNumber || "Phone Number"}</p>
                                <p className="text-xs">{form.address || "Address"}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/20">
                                <p className="text-xs text-slate-400">Profile Settings</p>
                            </div>
                        </div>
                    </div>

                    {/* Form section */}
                    <div className="col-span-2 p-4">
                        <div className="mb-3">
                            <h2 className="text-base font-semibold text-gray-900">Edit Profile</h2>
                            <p className="text-gray-600 text-xs mt-1">Update your personal information</p>
                        </div>
                        {error && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEditProfile} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Profile Picture</label>

                                {/* Upload Type Toggle */}
                                <div className="flex gap-3 mb-2">
                                    <label className="flex items-center text-xs text-gray-600">
                                        <input
                                            type="radio"
                                            name="uploadType"
                                            value="url"
                                            checked={uploadType === "url"}
                                            onChange={(e) => setUploadType(e.target.value)}
                                            className="mr-1 text-blue-600"
                                        />
                                        URL
                                    </label>
                                    <label className="flex items-center text-xs text-gray-600">
                                        <input
                                            type="radio"
                                            name="uploadType"
                                            value="file"
                                            checked={uploadType === "file"}
                                            onChange={(e) => setUploadType(e.target.value)}
                                            className="mr-1 text-blue-600"
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
                                        className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={form.phoneNumber}
                                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                        className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                />
                            </div>

                            {/* Password Change Section */}
                            <div className="border-t border-gray-200 pt-3 mt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password (Optional)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Current Password"
                                            value={form.currentPassword}
                                            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                            className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="New Password (min 6 chars)"
                                            value={form.newPassword}
                                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                            className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                                >
                                    {loading ? "Updating..." : "Update Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}