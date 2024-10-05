import React, { useState, useEffect } from "react";
import qs from "qs";
// API endpoints
const PROFILE_API = "https://metasurfai-public-api.fly.dev/v1/profile?username=nayem";
const CREATE_AD_API = "https://metasurfai-public-api.fly.dev/v2/createOneAds";
const DELETE_AD_API = "https://metasurfai-public-api.fly.dev/v2/deleteOneAds";

const UserDash = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [description, setDescription] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [active, setActive] = useState(true);
  const [maxViews, setMaxViews] = useState(0);
  const [region, setRegion] = useState("");
  const [tokenReward, setTokenReward] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [profile, setProfile] = useState({});
  const [ads, setAds] = useState([]);
  const [file, setFile] = useState(null);

  const ad = {
      title,
      image_url: imageUrl,
      description,
      posted_by: postedBy,
      region,
      token_reward: tokenReward
    };

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(PROFILE_API);
      const data = await response.json();
      setTokens(data.balance);
      setProfile(data);
      // Assuming ads are part of the profile data for this example
      //setAds(data.ads || []);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">User Dashboard</h1>
      <section className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Tokens</h2>
        <p className="text-xl text-black dark:text-white">{tokens}</p>
      </section>
      <section className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Profile</h2>
        <p className="text-lg text-black dark:text-white">Name: {profile.username}</p>
        <p className="text-lg text-black dark:text-white">Email: {profile.email}</p>
        <p className="text-lg text-black dark:text-white">Region: {profile.region}</p>
        <p className="text-lg text-black dark:text-white">Country: {profile.country}</p>
      </section>
      <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Manage Ads</h2>
        <ul className="mb-4">
          {ads.map(ad => (
            <li key={ad.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-black dark:text-white">{ad.title}</span>
              <button onClick={() => handleDeleteAd(ad.id)} className="text-red-500 dark:text-red-400">Delete</button>
            </li>
          ))}
        </ul>
        <div className="flex items-center mb-4">
          <button onClick={() => handlePostAd("New Ad")} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post New Ad</button>
          <form onSubmit={postAd}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <input type="number" placeholder="View Count" value={viewCount} onChange={(e) => setViewCount(Number(e.target.value))} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Posted By" value={postedBy} onChange={(e) => setPostedBy(e.target.value)} required />
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active
        <input type="number" placeholder="Max Views" value={maxViews} onChange={(e) => setMaxViews(Number(e.target.value))} required />
        <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
        <input type="number" placeholder="Token Reward" value={tokenReward} onChange={(e) => setTokenReward(Number(e.target.value))} required />
        <input type="file" onChange={handleFileChange} className="mr-4 text-black dark:text-white" />
          <button onClick={handleUploadAd} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Post Ad</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UserDash;