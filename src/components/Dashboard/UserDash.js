import React, { useState, useEffect } from "react";

// API endpoints
const PROFILE_API = "https://metasurfai-public-api.fly.dev/v1/profile?username=nayem";
const CREATE_AD_API = "https://metasurfai-public-api.fly.dev/v2/createOneAds";
const DELETE_AD_API = "https://metasurfai-public-api.fly.dev/v2/deleteOneAds";

const UserDash = () => {
  const [tokens, setTokens] = useState(0);
  const [profile, setProfile] = useState({});
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(PROFILE_API);
      const data = await response.json();
      setTokens(data.balance);
      setProfile(data);
      // Assuming ads are part of the profile data for this example
      setAds(data.ads || []);
    };
    getUserData();
  }, []);

  const handlePostAd = async (newAd) => {
    const response = await fetch(CREATE_AD_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newAd })
    });
    const ad = await response.json();
    setAds([...ads, ad]);
  };

  const handleDeleteAd = async (adId) => {
    await fetch(DELETE_AD_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: adId })
    });
    setAds(ads.filter(ad => ad.id !== adId));
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <section>
        <h2>Tokens: {tokens}</h2>
      </section>
      <section>
        <h2>Profile</h2>
        <p>Name: {profile.username}</p>
        <p>Email: {profile.email}</p>
        <p>Region: {profile.region}</p>
        <p>Country: {profile.country}</p>
        <p>Safe Browse: {profile.safebrowse ? "Enabled" : "Disabled"}</p>
      </section>
      <section>
        <h2>Manage Ads</h2>
        <ul>
          {ads.map(ad => (
            <li key={ad.id}>
              {ad.title} <button onClick={() => handleDeleteAd(ad.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => handlePostAd("New Ad")}>Post New Ad</button>
      </section>
    </div>
  );
};

export default UserDash;