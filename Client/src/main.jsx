import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import AuthLayout from "./Components/AuthLayout";
import Login from "./Pages/Login";
import Register from "./Pages/Register"
import DetailPage from "./Pages/DetailPage";
import Profile from "./Pages/Profile";
import UpdateProfile from "./Pages/UpdateProfile";
import store from "./store";
import { Provider } from "react-redux";
import "./Css/index.css";


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route element={<AuthLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editprofile/:id" element={<UpdateProfile />} />

        </Route>

      </Routes>



    </BrowserRouter>
  </Provider>
);
