import react, { useState } from "react";
import { Slider } from './Slider';
import { Register } from "./Register";
import { Login } from "./Login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Home() {
    const [pageState, setPageState] = useState(true);

    const getPageState = (loginState) => {
        toast.success("Registration Successfull !!");
        setPageState(loginState);
    }

    return (
        <>
            <div id="title" className="text-center bg-cyan-200">
                <h2 className="font-bold text-cyan-800 py-5 font-serif text-xl italic">
                    Douments Expolrer and Manager
                </h2>
            </div>

            <div id="body" className="mt-16 flex flex-col md:flex-row  items-center justify-between w-full px-[5%]">
                <div id="sliders"
                    className="flex items-center justify-center w-full md:w-[55%] h-[400px] 
                    p-0 md:p-8 px-5 md:px-10 rounded-xl  border border-gray-400 bg-gray-300"
                >
                    <Slider></Slider>
                </div>

                <div id="forms" className="w-full md:w-[40%] p-5 rounded-xl mb-[90px] md:mb-0">
                    <div className="flex flex-row w-full border border-gray-400 bg-cyan-300">
                        <button
                            onClick={(e) => setPageState(true)}
                            className={`${pageState ? "bg-green-700 text-white":"bg-green-300"} w-[50%] uppercase font-serif  py-2 px-4`}
                        >
                            LogIn
                        </button>
                        <button
                            onClick={(e) => setPageState(false)}
                            className={`${!pageState ? "bg-green-700 text-white" : "bg-green-300 " } w-[50%] uppercase font-serif py-2 px-4`}
                        >
                            Register
                        </button>
                    </div>

                    <div className="w-full">
                        {
                            pageState ?
                                <Login></Login>
                                :
                                <Register sendPageState={getPageState}></Register>
                        }
                    </div>
                </div>
            </div>

            <div id="footer" className="w-full z-50 fixed bottom-0 text-center bg-cyan-200">
                <h2 className="font-bold text-cyan-800 py-5 font-serif text-xl italic">
                    Documents manager@2024 All rights reserved
                </h2>
            </div>
        </>
    );
}