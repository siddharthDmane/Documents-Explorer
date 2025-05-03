import react, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {jwtDecode} from 'jwt-decode';

// {
//     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "user",
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid": "2ffdeeef-dd75-499a-914b-96b60f0fa529",
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "Siddharth",
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "manesidd982@gmail.com",
//     "exp": 1722684313,
//     "iss": "https://localhost:7054/",
//     "aud": "https://localhost:7054/"
//   }


export function Login() {

    const navigate = useNavigate();

    const [userData,setUserData] = useState({
        name : "",
        password : ""
    });

    const handleChange = (e) => {
        const {name,value} = e.target;
        setUserData({
            ...userData,
            [name] : value
        });
    }

    const handleLogin = async () =>{
        console.log(userData);
        if(userData.name === ""){
            toast.info("UserName Required !!")
            return;
        }
        else if(userData.password === ""){
            toast.info("Password Required !!");
            return;
        }
        else{
            try{
                var res = await axios.post(
                    `https://localhost:7054/api/Authentication/Login`,
                    {
                        UserName : userData.name,
                        Password : userData.password
                    }                    
                );
                if(res.data.status === 200){
                    toast.error("Login Successfull !!");
                    console.log(res.data);
                    var decoded_token = jwtDecode(res.data.message);
                    console.log(decoded_token);

                    localStorage.setItem("id",decoded_token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']);
                    localStorage.setItem("userName",decoded_token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
                    localStorage.setItem("email",decoded_token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
                    localStorage.setItem("role",decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
                    navigate("/document-manager");
                }
                else if(res.data.status === 400){
                    toast.error("Password Incorrect !!");
                    return;
                }
                else if(res.data.status === 404){
                    toast.error(res.data.message);
                    return;
                }
                else{
                    toast.error("Uncaught Error !!");
                    return;
                }
            }
            catch(e){
                console.log("Error : "+e);
                toast.error("Backend Error !!");
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
                                    name="name"
                                    onChange={handleChange}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="name"
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
                                    type="text"
                                    id="password"
                                    name="password"
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
                        <td align='center'> 
                            <button
                            onClick={handleLogin}
                                className='py-1 px-4 mb-3 rounded-lg text-black font-serif bg-green-500 hover:bg-green-800 hover:text-white'
                            >
                                LogIn
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </>
    );
}