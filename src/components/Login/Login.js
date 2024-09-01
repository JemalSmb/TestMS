import { useState, useRef, useEffect } from 'react';
import React from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const modalRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const handleMouseDown = () => {
        setShowPassword(true);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isModalOpen) return null;

        // Create user object
        const userData = {
            email: email,
            password: password
        };

    //     try {
    //         // Send POST request to your API endpoint
    //         const response = await fetch('', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(userData)
    //         });

    //         // Handle response
    //         if (response.ok) {
    //             setSuccess(true);
    //             setError(null);
    //         } else {
    //             const data = await response.json();
    //             setError(data.message);
    //             setSuccess(false);
    //         }
    //     } catch (error) {
    //         setError('Something went wrong. Please try again later.');
    //         setSuccess(false);
    //     }
    // };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-black bg-opacity-10 text-gray-100 p-8 rounded-lg shadow-lg backdrop-blur-md border-2 border-opacity-20 border-pink-600">                
                <h2 className="text-2xl mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">Login successful!</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-100 font-semibold">Email:</label>
                        <input
                            type="email"
                            className="form-input mt-1 block w-full border pl-2 border-gray-300 rounded-md text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-100 font-semibold">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input mt-1 block w-full pr-10 pl-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center cursor-pointer"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <img src="/show-password.png" alt="Show Password" className="h-5 w-5" />
                        </span>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Login</button>
                    <span class name="text-gray-100 text-sm mt-2 block text-center">Don't have an account? <a href="#" class name="text-blue-500 hover:underline">Register</a></span>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
