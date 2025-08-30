// Enhanced WishlistButton component with Redux integration and real-time updates

import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { useWishlistEnhanced } from '../hooks/useWishlistEnhanced';
import {
    notifyWishlistItemAdded,
    notifyWishlistItemRemoved,
    showWishlistNotification
} from '../utils/wishlistNotifications';

const WishlistButton = ({ productId, productName = "Product" }) => {
    const {
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading
    } = useWishlistEnhanced();

    const inWishlist = isInWishlist(productId);

    const handleToggleWishlist = async () => {
        if (inWishlist) {
            // Remove from wishlist
            const success = await removeFromWishlist(productId);
            if (success) {
                // Show custom notification with updated count
                showWishlistNotification('removed', productName, wishlistCount);
            }
        } else {
            // Add to wishlist
            const success = await addToWishlist(productId);
            if (success) {
                // Show custom notification with updated count
                showWishlistNotification('added', productName, wishlistCount);
            }
        }
    };

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            className={`
        relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${inWishlist
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
        >
            <Heart
                className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-current' : ''}`}
            />
            {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </button>
    );
};

// Example usage in a product card component
const ExampleProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
            <p className="text-xl font-bold text-blue-600 mb-4">${product.price}</p>

            <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Buy Now
                </button>
                <WishlistButton
                    productId={product.id}
                    productName={product.name}
                />
            </div>
        </div>
    );
};

export { WishlistButton, ExampleProductCard };
