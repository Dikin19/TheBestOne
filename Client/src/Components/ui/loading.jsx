import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function LoadingSpinner({ size = "default", text = "Loading..." }) {
    const sizes = {
        sm: "h-4 w-4",
        default: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`${sizes[size]} border-4 border-slate-200 border-t-amber-600 rounded-full`}
            />
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-600 text-sm"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-6"
                >
                    <div className="p-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl inline-block">
                        <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-slate-900 mb-2"
                >
                    TheBestOne
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <LoadingSpinner size="lg" text="Loading your premium experience..." />
                </motion.div>
            </motion.div>
        </div>
    );
}
