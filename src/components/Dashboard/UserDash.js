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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    return data.secure_url;
  };

  const handlePostAd = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = imageUrl;
    if (file) {
      uploadedImageUrl = await uploadFile();
    }

    const ad = {
      title,
      image_url: uploadedImageUrl,
      description,
      posted_by: postedBy,
      max_views: maxViews,
      region,
      token_reward: tokenReward
    };

    const adQueryString = qs.stringify(ad);

    const response = await fetch(CREATE_AD_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: adQueryString
    });

    const result = await response.json();
    console.log(result);
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
        <div className="grid grid-cols-3 gap-4">
        <form onSubmit={handlePostAd}>
        <input type="text" className='bg-transparent text-black dark:text-white' placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" className='bg-transparent text-black dark:text-white' placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <input type="text" className='bg-transparent text-black dark:text-white' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text"  className='bg-transparent text-black dark:text-white' placeholder="Posted By" value={postedBy} onChange={(e) => setPostedBy(e.target.value)} required />
        <input type="number" className='bg-transparent text-black dark:text-white' placeholder="Max Views" value={maxViews} onChange={(e) => setMaxViews(Number(e.target.value))} required />
        <input type="text"  className='bg-transparent text-black dark:text-white' placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
        <input type="number" className='bg-transparent text-black dark:text-white' placeholder="Token Reward" value={tokenReward} onChange={(e) => setTokenReward(Number(e.target.value))} required />
        <div className="col-span-3 flex items-center">
          <input type="file" onChange={handleFileChange} className="mr-4 text-black dark:text-white" />
          {filePreview && <img src={filePreview} alt="File Preview" className="w-20 h-20 object-cover" />}
        </div>
        <button type="submit" className='bg-pink-600 dark:bg-blue-600 text-white rounded-2xl px-4 col-span-3'>Post Ad</button>
        </form>
        </div>
      </section>
    </div>
  );
};

export default UserDash;