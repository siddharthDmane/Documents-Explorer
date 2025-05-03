import react, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf, faX, faEllipsisV, faExclamationTriangle, faPlay, faEye, faTrash, faPen,faFileImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loadingGif from "./../../Animations/loading.gif";
import deleteGif from "./../../Animations/deleting.gif";

export function AllImages() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [fileModel, setFileModel] = useState(false);
    const [renameModel, setRenameModel] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [addfile, setAddFile] = useState({
        name: "",
        path: ""
    });
    const [loading, setLoading] = useState(false);
    const [deleteAni, setDeleteAni] = useState(false);
    const [viewFile, setViewFile] = useState({});
    const [buttonState, setButtonState] = useState(false);
    const [actions, setActions] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [flip, setFlip] = useState(false);

    
    useEffect(() => {
        const initialFetch = async () =>{
            setLoading(true);
            try{
                await getAllImages()
            }catch(error){
                console.log("Error : "+error);
            }
            finally{
                setLoading(false);
            }
        }
        initialFetch();
    }, [id])

    const getAllImages = async () => {
        // setLoading(true);
        setFiles([]);
        try {
            var resImages = await axios.get(`https://localhost:7054/api/Images/All/User/${localStorage.getItem("id")}`);
            console.log(resImages.data);
            if (resImages.data.status === 200) {
                // setLoading(false);
                setFiles([...resImages.data.items]);
            }
            
            if (resImages.data.status === 404) {
                setFiles([]);
                toast.info("No Files Found !!");
            }
        } catch (error) {
            toast.error("Backend Error !!");
            console.log("Error : " + error);
        }
    }

    return (
        <>
            {/* Loading Animation */}
            {
                loading &&
                <div id="loading" className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-80">
                    <div className="z-50 flex flex-col items-center bg-white rounded w-[30%] bg-opacity-100 opacity-100 py-5">
                        <img
                            src={loadingGif}
                        ></img>
                    </div>
                </div>
            }

            <div
                id="main-body"
                onClick={(e) => {
                    if (actions)
                        setActions(false);
                }}
                className="z-10 flex flex-row bg-yellow-100 flex-wrap w-full h-full overflow-y-auto p-5 rounded-lg shadow-md"
            >
                {
                    files.length > 0 &&
                    files?.map((file, index) => {
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center m-[5px] w-[150px] h-[165px] bg-white shadow-lg rounded-md pb-1"
                            >
                                <div className="w-full flex justify-end h-[40px]">
                                    <div
                                        style={{ borderBottomLeftRadius: '50%' }}
                                        className="flex items-center justify-center h-full w-[30px] bg-yellow-500 hover:bg-yellow-700 rounded-tr-md cursor-default"
                                    >
                                        <FontAwesomeIcon
                                            icon={faEllipsisV}
                                            style={{ color: "white", }}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                setFlip(e.clientX + 220 > window.innerWidth ? true : false);
                                                setCoordinates({
                                                    x: e.clientX + 220 > window.innerWidth ? e.clientX - 220 : e.clientX + 14,
                                                    y: e.clientY + 5
                                                });
                                                setWindowSize({
                                                    width: window.innerWidth,
                                                    height: window.innerHeight
                                                });
                                                setActions(!actions);
                                                setViewFile(file);
                                                console.log(e.clientX + " " + e.clientY);
                                                console.log(window.innerHeight + " " + window.innerWidth);
                                                console.log(e.clientX + 220 > window.innerWidth ? e.clientX - 220 : e.clientX + 14);
                                            }}
                                        />
                                    </div>
                                </div>

                                {
                                    actions &&
                                    <div
                                        style={{ left: `${coordinates.x}px`, top: `${coordinates.y}px` }}
                                        className={`fixed flex flex-row -mt-5 items-start justify-start w-[200px] `}
                                    >
                                        {
                                            !flip &&
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                className="h-[35px] w-[35px] text-yellow-400 transform -scale-x-100"
                                            />
                                        }
                                        <div
                                            className="-ml-[1px] flex items-center bg-yellow-400 w-full h-full rounded-md py-3"
                                        >
                                            <table className="w-full">
                                                <tr className="hover:bg-yellow-500 hover:text-white text-gray-700 font-sans">
                                                    <th align="left" className="pl-5">
                                                        <button
                                                            onClick={(e) => {
                                                                window.open(viewFile.path, "_blank");
                                                                setActions(!actions);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEye}
                                                                className="text-cyan-500"
                                                            />
                                                            <span className="ml-3 font-sans">View</span>
                                                        </button>
                                                    </th>
                                                </tr>
                                                <tr className="hover:bg-yellow-500 hover:text-white text-gray-700 font-sans">
                                                    <th align="left" className="pl-5">
                                                        <button
                                                            onClick={(e) => {
                                                                setRenameModel(true);
                                                                setActions(!actions);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faPen}
                                                                className="text-gray-500"
                                                            />
                                                            <span className="ml-3 font-sans">Rename</span>
                                                        </button>
                                                    </th>
                                                </tr>
                                                <tr className="hover:bg-yellow-500 hover:text-white text-gray-700 font-sans">
                                                    <th align="left" className="pl-5">
                                                        <button
                                                            onClick={(e) => {
                                                                setDeleteModel(true);
                                                                setActions(!actions);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                className="text-red-500"
                                                            />
                                                            <span className="ml-3 font-sans">Delete</span>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </table>
                                        </div>

                                        {
                                            flip &&
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                className="h-[35px] w-[35px] text-yellow-400 transform"
                                            />
                                        }
                                    </div>
                                }

                                <a
                                    target="_blank"
                                    href={file.path}
                                >
                                    {
                                        file.type === ".pdf" &&
                                        <FontAwesomeIcon icon={faFilePdf} className="h-[100px] text-yellow-500 cursor-pointer hover:text-yellow-700" />
                                    }
                                    {
                                        (file.type === ".jpg" || file.type === ".jpeg" || file.type === ".png") &&
                                        <FontAwesomeIcon icon={faFileImage} className="h-[100px] text-yellow-500 cursor-pointer hover:text-yellow-700" />
                                    }
                                </a>

                                <p
                                    className="font-sans font-semibold"
                                // onDoubleClick={}
                                >
                                    {
                                        file.name.length > 18 ?
                                            file.name.slice(0, 5) + "..." + file.name.slice(-7)
                                            :
                                            file.name
                                    }
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}