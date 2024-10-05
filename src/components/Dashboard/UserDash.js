import React, { useState, useEffect } from "react";

// API endpoints
const PROFILE_API = "https://metasurfai-public-api.fly.dev/v1/profile?username=nayem";
const CREATE_AD_API = "https://metasurfai-public-api.fly.dev/v2/createOneAds";
const DELETE_AD_API = "https://metasurfai-public-api.fly.dev/v2/deleteOneAds";

const UserDash = () => {
  const [tokens, setTokens] = useState(0);
  const [profile, setProfile] = useState({});
  const [ads, setAds] = useState([]);
  const [file, setFile] = useState(null);

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

  const handleUploadAd = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        await handlePostAd(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h1 className='text-black dark:text-white'>User Dashboard</h1>
      <section>
        <h2 className='text-black dark:text-white'>Tokens: {tokens}</h2>
      </section>
      <section>
        <h2 className='text-black dark:text-white'>Profile</h2>
        <p className='text-black dark:text-white'>Name: {profile.username}</p>
        <p className='text-black dark:text-white'>Email: {profile.email}</p>
        <p className='text-black dark:text-white'>Region: {profile.region}</p>
        <p className='text-black dark:text-white'>Country: {profile.country}</p>
      </section>
      <section>
        <h2 className='text-black dark:text-white'>Manage Ads</h2>
        <ul>
          {ads.map(ad => (
            <li key={ad.id}>
              {ad.title} <button onClick={() => handleDeleteAd(ad.id)} className='text-black dark:text-white'>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => handlePostAd("New Ad")} className='text-black dark:text-white'>Post New Ad</button>
        <input type="file" onChange={handleFileChange} className='text-black dark:text-white' />
        <button onClick={handleUploadAd} className='text-black dark:text-white'>Upload Ad</button>    
      </section>
    </div>
  );
};

export default UserDash;