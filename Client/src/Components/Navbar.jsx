import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const nav = useNavigate();

    function handleLogout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("email");
        localStorage.removeItem("profilePicture");
        nav("/login");
    }

    // const email = localStorage.getItem("email");
    // const profilePicture = localStorage.getItem("profilePicture");

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-red-600">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <NavLink to="/" className="text-3xl font-extrabold text-navy">
                    TheBestOne 🍗
                </NavLink>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-lg font-semibold transition duration-200 ${isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `text-lg font-semibold transition duration-200 ${isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                            }`
                        }
                    >
                        Profile
                    </NavLink>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition"
                    >
                        Logout
                    </button>

                    {/* Profile
                    {profilePicture && (
                        <div className="flex items-center gap-2">
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-red-600 shadow-sm"
                            />
                            <span className="text-sm text-gray-700 font-medium hidden md:block">
                                {email}
                            </span>
                        </div>
                    )} */}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
