// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ProfileLinkedIn from "./ProfileCard";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Profile = () => {
 
  return (
    <HelmetProvider>
      <Helmet>
        <html lang="en" />
        <title>
          
             `ShopNest Profile – Manage Account`
            : "ShopNest Profile | Manage Account Bangladesh"
        </title>
        <meta
          name="description"
          content=
            "Manage your ShopNest Bangladesh account, view orders, update personal details, and track your purchases easily."
          
        />
        <meta
          name="keywords"
          content="ShopNest profile, account management BD, online shopping Bangladesh, view orders BD, update account BD, shopnest user dashboard"
        />
        <meta
          name="author"
          content= "welcome ||ShopNest Bangladesh"
        />
        <link rel="canonical" href="https://shopnest.com/profile" />
        <link rel="icon" href="/insurance.png" type="image/x-icon" />
        <meta property="og:title" content="ShopNest Profile – Online Shopping BD" />
        <meta
          property="og:description"
          content="Manage your ShopNest account, track orders, and update profile info effortlessly."
        />
        <meta property="og:image" content="/og-profile.jpg" />
        <meta property="og:url" content="https://shopnest.com/profile" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ShopNest Profile – Online Shopping Bangladesh"
        />
        <meta
          name="twitter:description"
          content="Access your account, manage orders, and edit profile details on ShopNest BD."
        />
        <meta name="twitter:image" content="/og-profile.jpg" />
      </Helmet>

      {/* Profile Section */}
      <div className="max-w-8xl mx-auto p-6">
       

          <ProfileLinkedIn />
        
      </div>
    </HelmetProvider>
  );
};

export default Profile;
