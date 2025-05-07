import { Link } from "react-router-dom";

export default function HomeCard({ el }) {
    return (
        <div className="bg-white border rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
            <Link to={`/detail/${el.id}`} className="no-underline">
                <img
                    src={el.imgUrl}
                    alt={el.name}
                    className="w-full h-48 object-cover"
                />

                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                        {el.name}
                    </h3>

                    <p className="text-[#C62828] text-base font-bold mt-1">
                        Rp {el.price.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {el.description}
                    </p>

                    <button className="mt-3 w-full bg-[#C62828] hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-full transition">
                        Lihat Detail
                    </button>
                </div>
            </Link>
        </div>
    );
}
