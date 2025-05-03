import react, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFolder, faX, faI, faA, faV, faP, faH } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from "react-router-dom";

export function Main() {

    const navigate = useNavigate();

    useEffect(() => {
    }, [])

    return (
        <>
            <div id="title" className="text-center bg-cyan-100">
                <h2 className="font-bold text-cyan-800 py-5 font-serif text-xl italic">
                    Douments Expolrer and Manager
                </h2>
            </div>

            <div id="user" className="text-right bg-cyan-200 ">
                <h2 className="font-bold text-cyan-800 py-1 font-serif text-sm mr-[5px]">
                {
                    localStorage.getItem("userName")
                }
                </h2>
            </div>

            <div className="flex items-center flex-row w-full h-[500px] p-5">
                <div className="hidden md:flex flex-col h-full rounded-md bg-cyan-500 w-[5%] py-5">
                    <ul>
                        <li align="center"
                            onClick={(e) => { navigate('/document-manager') }}
                            className="flex flex-row items-center justify-center li-hover cursor-pointer mt-[40px] mb-[7px]"
                        >
                            <FontAwesomeIcon icon={faH } style={{ color: "white" }} className="h-[35px]" />
                            <div
                                onClick={(e) => { navigate('/document-manager') }}
                                className="flex flex-row items-center justify-end text-white font-sans font-semibold slide-in-left opacity-0 absolute py-1 pr-3 h-[50px] bg-cyan-500 w-[120px] rounded-r-md"
                            >
                                <p className="m-1">Home</p>
                                {/* <FontAwesomeIcon icon={faPlus} style={{ color: "white" }} className="h-[15px]" /> */}
                            </div>
                        </li>

                        <li align="center"
                            className="flex flex-row items-center justify-center li-hover cursor-pointer mt-[40px]"
                        >
                            <FontAwesomeIcon icon={faI} style={{ color: "white" }} className="h-[35px]" />
                            <div
                                onClick={(e) => { navigate('/document-manager/all-images') }}
                                className="flex flex-row items-center justify-end text-white font-sans font-semibold slide-in-left opacity-0 absolute py-1 pr-3 h-[50px] bg-cyan-500 w-[120px] rounded-r-md"
                            >
                                <p className="m-1">All Images</p>
                                {/* <FontAwesomeIcon icon={faI} style={{ color: "white" }} className="h-[15px]" /> */}
                            </div>
                        </li>

                        <li align="center"
                            className="flex flex-row items-center justify-center li-hover cursor-pointer mt-[40px]"
                        >
                            <FontAwesomeIcon icon={faV} style={{ color: "white" }} className="h-[35px]" />
                            <div
                                onClick={(e) => { navigate('/document-manager') }}
                                className="flex flex-row items-center justify-end text-white font-sans font-semibold slide-in-left opacity-0 absolute py-1 pr-3 h-[50px] bg-cyan-500 w-[120px] rounded-r-md"
                            >
                                <p className="m-1">All Videos</p>
                                {/* <FontAwesomeIcon icon={faV} style={{ color: "white" }} className="h-[15px]" /> */}
                            </div>
                        </li>

                        <li align="center"
                            className="flex flex-row items-center justify-center li-hover cursor-pointer mt-[40px]"
                        >
                            <FontAwesomeIcon icon={faA} style={{ color: "white" }} className="h-[35px]" />
                            <div
                                onClick={(e) => { navigate('/document-manager') }}
                                className="flex flex-row items-center justify-end text-white font-sans font-semibold slide-in-left opacity-0 absolute py-1 pr-3 h-[50px] bg-cyan-500 w-[120px] rounded-r-md"
                            >
                                <p className="m-1">All Audios</p>
                                {/* <FontAwesomeIcon icon={faA} style={{ color: "white" }} className="h-[15px]" /> */}
                            </div>
                        </li>

                        <li align="center"
                            className="flex flex-row items-center justify-center li-hover cursor-pointer mt-[40px]"
                        >
                            <FontAwesomeIcon icon={faP} style={{ color: "white" }} className="h-[35px]" />
                            <div
                                onClick={(e) => { navigate('/document-manager') }}
                                className="flex flex-row items-center justify-end text-white font-sans font-semibold slide-in-left opacity-0 absolute py-1 pr-3 h-[50px] bg-cyan-500 w-[120px] rounded-r-md"
                            >
                                <p className="m-1">All Pdfs</p>
                                {/* <FontAwesomeIcon icon={faP} style={{ color: "white" }} className="h-[15px]" /> */}
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    id="main-body"
                    className="md:ml-[1%] w-full md:w-[97%] h-full"
                >
                    <Outlet></Outlet>
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