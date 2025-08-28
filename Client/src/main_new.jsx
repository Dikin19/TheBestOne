import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./Pages/Home";
import AuthLayout from "./Components/AuthLayout";
import Login from "./Pages/Login";
import Register from "./Pages/Register"
import DetailPage from "./Pages/DetailPage";
import Profile from "./Pages/Profile";
import UpdateProfile from "./Pages/UpdateProfile";
import store from "./store";
import { Provider } from "react-redux";
import { PageLoader } from "./Components/ui/loading";
import "./Css/index.css";

// Page transition variants
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

// Wrapper component for page animations
const AnimatedPage = ({ children }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        {children}
    </motion.div>
);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <Provider store={store}>
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <AnimatedPage>
                                    <Login />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <AnimatedPage>
                                    <Register />
                                </AnimatedPage>
                            }
                        />

                        <Route element={<AuthLayout />}>
                            <Route
                                path="/"
                                element={
                                    <AnimatedPage>
                                        <Home />
                                    </AnimatedPage>
                                }
                            />
                            <Route
                                path="/detail/:id"
                                element={
                                    <AnimatedPage>
                                        <DetailPage />
                                    </AnimatedPage>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <AnimatedPage>
                                        <Profile />
                                    </AnimatedPage>
                                }
                            />
                            <Route
                                path="/update-profile"
                                element={
                                    <AnimatedPage>
                                        <UpdateProfile />
                                    </AnimatedPage>
                                }
                            />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </Suspense>
        </BrowserRouter>
    </Provider>
);
