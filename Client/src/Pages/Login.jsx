import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from '../config/axiosInstance';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (localStorage.getItem('access_token')) {
        return <Navigate to="/" />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post('/login', { email, password });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('profilePicture', data.user.profilePicture);

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Signed in successfully',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            navigate('/');
        } catch (error) {
            let message = 'Oops something went wrong!';
            if (error.response) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
            });
        }
    }

    async function handleCredentialResponse(response) {
        try {
            const { data } = await axios.post('/google-login', {
                googleToken: response.credential,
            });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('profilePicture', data.user.profilePicture);

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: '350708614453-fefamno8l97ct80hlbto5lno30rtev9i.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(document.getElementById('google-button'), {
            theme: 'outline',
            size: 'large',
        });

        google.accounts.id.prompt();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#fef3f3] px-4">
            <div className="bg-white shadow-xl border-t-8 border-[#d8191f] rounded-md p-8 w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-extrabold text-[#D3232A] tracking-wide">TheBestOne Login</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Please login to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="text"
                            placeholder="your@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3232A] shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3232A] shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#D3232A] hover:bg-red-700 text-white font-bold py-2 rounded-md transition duration-300 shadow-md"
                    >
                        Login
                    </button>
                </form>

                <div id="google-button" className="mt-5 flex justify-center"></div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account yet?{' '}
                    <Link to="/register" className="text-[#D3232A] font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
