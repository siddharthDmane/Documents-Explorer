import react, { useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Register({sendPageState}) {

    const [userData, setUserData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    }

    const handleRegister = async (e) => {
        console.log(userData);
        var success = false;
        if (userData.userName === "") {
            toast.info("UserName required !!");
            return;
        }
        else if (userData.email === "") {
            toast.info("Email Address required !!");
            return;
        }
        else if (userData.password === "") {
            toast.info("Password required !!");
            return;
        }
        else if (userData.confirmPassword === "") {
            toast.info("Confirm Password required !!");
            return;
        }
        else if (userData.password !== userData.confirmPassword) {
            toast.info("Password and Confirm Password did not match !!");
            return;
        }
        else {
            try {
                var res = await axios.post(
                    `https://localhost:7054/api/Authentication/Registration`,
                    userData
                );
                console.log(res.data);
                if(res.data.status === 200){
                    toast.success("User Registered Successfully !!");                    
                    success = true;
                }
                else if(res.data.status === 300){
                    toast.error(res.data.message);
                } 
                else if(res.data.status === 400){
                    toast.error(res.data.message);
                }
            }
            catch (e) {
                console.log("Error : "+ e);
                toast.error("Backend Error !!");
            }
            finally{
                if(success)
                    sendPageState(true);
                setUserData({
                    userName : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                });
            }
        }
    }

    return (
        <>
        <ToastContainer />
            <div className=' border border-gray-400 bg-gray-50 rounded-b-xl w-full'>
                <table align='center' className='w-[80%]'>
                    <tr>
                        <td>
                            <div className="mt-3 mb-3 relative w-full">
                                <input
                                    type="text"
                                    id="name"
                                    name="userName"
                                    value={userData.userName}
                                    onChange={handleChange}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="userName"
                                    className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    UserName
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="mb-3 relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Email
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="mb-3 relative">
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Password
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="mb-3 relative">
                                <input
                                    type="text"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="name"
                                    className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Confirm Password
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align='center'>
                            <button
                                type='button'
                                onClick={handleRegister}
                                className='font-serif py-1 px-4 mb-3 rounded-lg text-b font-slack erif bg-green-500 hover:bg-green-800 hover:text-white'
                            >
                                Register
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </>

    );
}