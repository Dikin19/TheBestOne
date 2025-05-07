import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../store/productSlice";
import HomeCard from "../Components/HomeCard";

export default function Product() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.items);

    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products.map((el, index) => (
                        <HomeCard el={el} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
