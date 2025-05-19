import { useEffect, useState } from "react";
import ProfileCard from "../Components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/productSlice";

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.product.Profile);

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    // const [profile, setProfile] = useState({});
    // async function fetchProfile() {
    //     try {
    //         const { data } = await axios({
    //             method: "get",
    //             url: "/customers/profile",
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('access_token')
    //             }
    //         });
    //         setProfile(data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     fetchProfile();
    // }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="bg-[#f53d2d] text-white flex items-center px-6 py-4 rounded-lg shadow-md mb-6">
                <img
                    src={profile.profilePicture}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <h2 className="text-xl font-semibold">{profile.fullName}</h2>
            </header>

            <div className="flex justify-center">
                <ProfileCard el={profile} />
            </div>
        </div>
    );
}
