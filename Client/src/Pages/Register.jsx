import { useState } from "react";
import axios from "../config/axiosInstance";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Register() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        profilePicture: ""
    });

    if (localStorage.getItem("access_token")) {
        return <Navigate to="/" />;
    }

    async function handleRegister(e) {
        e.preventDefault();
        try {
            const { data } = await axios({
                method: "post",
                url: "/register",
                data: form
            });
            console.log(data);
            nav("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#fef3f3] px-4">
            <div className="bg-white shadow-xl border-t-8 border-[#d8191f] rounded-md p-8 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-[#d8191f] mb-6 tracking-wide">TheBestOne Register</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    {[
                        { label: "Full Name", key: "fullName", type: "text" },
                        { label: "Email", key: "email", type: "email" },
                        { label: "Password", key: "password", type: "password" },
                        { label: "Phone Number", key: "phoneNumber", type: "text" },
                        { label: "Address", key: "address", type: "text" },
                        { label: "Profile Picture URL", key: "profilePicture", type: "text" }
                    ].map(({ label, key, type }) => (
                        <div key={key}>
                            <label className="block text-sm font-bold text-gray-800">{label}</label>
                            <input
                                type={type}
                                placeholder={label}
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d8191f] focus:border-[#d8191f]"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-[#d8191f] hover:bg-[#b21618] text-white text-lg font-bold py-2 rounded shadow transition duration-300"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#d8191f] font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
