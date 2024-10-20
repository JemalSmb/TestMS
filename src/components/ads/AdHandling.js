import React, { useState, useEffect, useRef } from "react";

const AdHandler = () => {
    const countDown = 10;
    const [ads, setAds] = useState([]);
    const [selectedAd, setSelectedAd] = useState(null);
    const [remainingSeconds, setRemainingSeconds] = useState(countDown);
    const targetDateRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const [adsPerPage, setAdsPerPage] = useState(9);

    // Fetch ads when the component mounts
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch("https://metasurfai-public-api.fly.dev/v2");
                const data = await response.json();
                const sortedAds = data.sort((a, b) => b.token_reward - a.token_reward); 
                setAds(sortedAds);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };

        fetchAds();
    }, []);

    // Adjust adsPerPage based on screen width
    useEffect(() => {
        const updateAdsPerPage = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setAdsPerPage(9); // 3x3 grid
            } else if (width >= 600) {
                setAdsPerPage(6); // 2x3 grid
            } else {
                setAdsPerPage(3); // 1x3 grid
            }
        };

        updateAdsPerPage();
        window.addEventListener("resize", updateAdsPerPage);
        return () => window.removeEventListener("resize", updateAdsPerPage);
    }, []);
    

    // Start the countdown when an ad is clicked
    const handleAdClick = (ad) => {
        setSelectedAd(ad);
        setRemainingSeconds(countDown);
        targetDateRef.current = new Date().getTime() + countDown * 1000; // Set target date for countdown

        // Start the countdown animation
        countItDown();
        document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    // Countdown function using requestAnimationFrame
    const countItDown = () => {
        animationFrameIdRef.current = requestAnimationFrame(() => {
            const diff = Math.floor((targetDateRef.current - new Date().getTime()) / 1000);
            setRemainingSeconds(diff >= 0 ? diff : 0); // Update remaining seconds

            if (diff > 0) {
                countItDown(); // Continue the countdown if there's time left
            } else {
                // Handle modal closing logic when countdown reaches zero
                closeModal();
            }
        });
    };

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameIdRef.current); // Pause the countdown
        } else {
            // Calculate remaining time based on the target date and update last update time
            const currentTime = new Date().getTime();
            const remainingTime = Math.floor((targetDateRef.current - currentTime) / 1000);
            setRemainingSeconds(remainingTime >= 0 ? remainingTime : 0); // Update remaining seconds
            lastUpdateTimeRef.current = currentTime; // Update last update time
            countItDown(); // Resume countdown
        }
    };

    // Close modal function
    const closeModal = () => {
        if (remainingSeconds === 0) {
            setSelectedAd(null);
            cancelAnimationFrame(animationFrameIdRef.current); // Stop the countdown
        }
    };

    // Cleanup function to remove event listener
    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationFrameIdRef.current); // Cleanup on unmount
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Determine the aspect ratio class
    const getAspectRatioClass = (ad) => {
        const { width, height } = ad;
        const aspectRatio = width / height;

        if (aspectRatio > 1) {
            return "ad-horizontal"; // 16:9
        } else {
            return "ad-vertical"; // 9:16
        }
    };

    return (
        <div>
         <div className="text-center pt-6">
          <h className="text-black text-4xl font-bold dark:text-white">We're offering the best</h> <h className="text-4xl font-bold text-pink-500 dark:text-blue-600">Services</h>
          <div>
          <div className=' pt-10'>
          <h className="text-black dark:text-white text-4xl font-bold">Featured Videos</h> 
          </div>
          <div className="container pt-4 pb-4 w-11/12 pr-6 min-h-screen m-auto flex flex-col ads-container" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))` }}>
          {ads.slice(0, 4).map((ad, index) => (
                        <div
                            className={`ad relative rounded-xl border-5 border-y-cyan-500 shadow-md overflow-hidden cursor-pointer ${getAspectRatioClass(ad)}`}
                            key={index}
                            onClick={() => handleAdClick(ad)}
                        >
                            <img
                                className="object-cover w-full h-full"
                                src={ad.image_url}
                                alt={ad.title}
                            />
                            <div className="ad-info absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                <h3 className="text-lg font-bold">{ad.title}</h3>
                                <p className="text-sm">Token Reward: {ad.token_reward}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <div className="text-center pt-8">
            <h className="text-black dark:text-white text-4xl font-bold">Browse by interest</h> 
            <h className="text-black dark:text-white text-xl pl-16">See more</h> 
          </div>
            <div className="container pt-4 pb-4 w-11/12 min-h-screen m-auto flex flex-col">
                {/* Ads Display */}
                <div className="ads-container flex-grow grid gap-4 overflow-y-auto" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))` }}>
                    {ads.map((ad, index) => (
                        <div
                            className={`ad relative rounded-xl border-5 border-y-cyan-500 shadow-md overflow-hidden cursor-pointer ${getAspectRatioClass(ad)}`}
                            key={index}
                            onClick={() => handleAdClick(ad)}
                        >
                            <img
                                className="object-cover w-full h-full"
                                src={ad.image_url}
                                alt={ad.title}
                            />
                            <div className="absolute rounded-3xl bg-white text-black">
                                <p>{ad.timer}🕒</p>
                            </div>
                            <div className="ad-info absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                <h3 className="text-lg font-bold">{ad.title}</h3>
                                <p className="text-sm">Token Reward: {ad.token_reward}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedAd && (
                    <div className="p-4 fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
                        <div className="relative bg-black bg-opacity-50 p-4 rounded-lg border-2 border-opacity-40 border-pink-600 max-w-screen-lg w-full max-h-full md:max-h-[90vh] md:w-auto flex flex-col items-center justify-center overflow-y-auto">
                            <span onClick={closeModal} className="absolute top-2 right-2 text-3xl font-bold cursor-pointer">
                                &times;
                            </span>
                            <img
                                src={selectedAd.image_url}
                                alt={selectedAd.title}
                                className="object-contain max-w-full max-h-80 md:max-h-96"
                            />
                            <div className="mt-4">
                                <h3 className="text-lg font-bold">{selectedAd.title}</h3>
                                <p className="text-sm">Posted by: {selectedAd.posted_by}</p>
                                <p className="text-sm">Description: {selectedAd.description}</p>
                                <p className="text-sm">Region: {selectedAd.region}</p>
                                <p className="text-sm">Token Reward: {selectedAd.token_reward}</p>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm">You can close this ad in {remainingSeconds} seconds</p>
                            </div>
                      </div>
                </div>
            )}
        </div>
    </div>
    );
};

export default AdHandler;
