import react, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf, faX, faEllipsisV, faExclamationTriangle, faPlay, faEye, faTrash, faPen,faFileImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loadingGif from "../Animations/loading.gif";
import deleteGif from "../Animations/deleting.gif";

export function ViewFolder() {
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
                await getAllPDFS()
            }catch(error){
                console.log("Error : "+error);
            }
            finally{
                setLoading(false);
            }
        }
        initialFetch();
    }, [id])

    const getAllPDFS = async () => {
        // setLoading(true);
        setFiles([]);
        try {
            var resPdfs = await axios.get(`https://localhost:7054/api/Files/GetAll/${id}`);
            var resImages = await axios.get(`https://localhost:7054/api/Images/GetAll/${id}`);
            console.log(resPdfs.data);
            console.log(resImages.data);
            let resAll = [];
            if (resPdfs.data.status === 200) {
                // setLoading(false);
                resAll = [...resPdfs.data.items];
            }
            if (resImages.data.status === 200) {
                // setLoading(false);
                resAll = [...resAll,...resImages.data.items];
            }
            setFiles([...resAll]);
            if (resPdfs.data.status === 404 && resImages.data.status === 404) {
                setFiles([]);
                toast.info("No Files Found !!");
            }
        } catch (error) {
            toast.error("Backend Error !!");
            console.log("Error : " + error);
        }
    }

    const checkFileName = async (filename) => {
        try {
            var res = await axios.post(
                `https://localhost:7054/api/Files/GetPDFNames/${id}`,
                new String(filename)
            );
            if (res.data.status === 200) {
                var r = res.data.message === "true" ? true : false;
                setButtonState(r);
            }
        } catch (error) {
            console.log("Error : " + error);
        }
    }

    const handleAddFiles = async () => {
        console.log(selectedFile);
        console.log(addfile);
        if (selectedFile === null) {
            toast.warning("Please, Upload the document.");
            return;
        }
        setFileModel(false);
        setLoading(true);
        try {
            if (selectedFile.type === "application/pdf") {
                var formData = new FormData();
                formData.append("Name", addfile.name);
                formData.append("Document", selectedFile);
                formData.append("OwnerId", localStorage.getItem("id"));
                var res = await axios.post(
                    `https://localhost:7054/api/Files/Add/Folder/${id}`,
                    formData
                );
                if (res.data.status === 200) {
                    setLoading(false);
                    toast.success("PDf uploaded successfully.")
                }
            }
            else if (selectedFile.type === "image/jpeg") {
                var formData = new FormData();
                formData.append("Name", addfile.name);
                formData.append("Document", selectedFile);
                formData.append("OwnerId", localStorage.getItem("id"));
                var res = await axios.post(
                    `https://localhost:7054/api/Images/Add/Folder/${id}`,
                    formData
                );
                if (res.data.status === 200) {
                    setLoading(false);
                    toast.success("Image uploaded successfully.")
                }
            }
        } catch (error) {
            toast.error("Backend Error !!");
            console.log("Error : " + error);
        } finally {
            setFiles([]);
            getAllPDFS();
            setLoading(false);
            setSelectedFile(null);
            setFileModel(false);
            setAddFile({
                name: "",
            });
        }
    }

    const handleRenameFile = async (id) => {
        setRenameModel(false);
        setLoading(true);
        try {
            var res = await axios.post(
                `https://localhost:7054/api/Files/Rename/${id}`,
                { Name: viewFile.name }
            );
            if (res.data.status === 200) {
                
                setLoading(false);
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (error) {
            console.log("Error : " + error);
            toast.error("Backend Error !!");
        }
        finally {
            getAllPDFS();
            setLoading(false);
            setRenameModel(false);
        }
    }

    const handleDeleteFile = async (id) => {
        setDeleteModel(false);
        setDeleteAni(true);
        try {
            var res = await axios.post(
                `https://localhost:7054/api/Files/Delete/${id}`
            );
            if (res.data.status === 200) {
                setDeleteAni(false);
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (error) {
            console.log("Error : " + error);
            toast.error("Backend Error !!");
        }
        finally {
            setDeleteAni(false);
            getAllPDFS();
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
                className="z-10 flex flex-row md:justify-normal justify-evenly bg-yellow-100 flex-wrap w-full h-full overflow-y-auto p-5 rounded-lg shadow-md"
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
                <div
                    onClick={(e) => setFileModel(true)}
                    className="flex flex-col items-center justify-center mt-[17px] m-[5px] w-[150px] h-[145px] bg-white shadow-xl rounded-xl cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} className="h-[80px] text-yellow-500" />  {/* blue color =>style={{color: "#74C0FC" }}*/}
                    <p
                        className="font-sans font-semibold"
                    > Add Files</p>
                </div>
            </div>

            {/* Modal for adding File */}
            {
                fileModel &&
                <div id="add-file" className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-80">
                    <div className="z-50 flex flex-col items-center bg-zinc-200 rounded w-[50%] bg-opacity-100 opacity-100">
                        {/* close button */}
                        <div className="flex justify-end mt-1 mr-2 w-full">
                            <button
                                onClick={
                                    (e) => {
                                        setSelectedFile(null);
                                        setFileModel(false);
                                        setAddFile({
                                            name: "",
                                        });
                                        setButtonState(false);
                                    }
                                }
                                className="bg-red-500 hover:bg-red-700 p-1 w-[30px] h-[30px] rounded-full"
                            >
                                <FontAwesomeIcon icon={faX} style={{ color: "white", }} />
                            </button>
                        </div>

                        {/* upload file form */}
                        <div className="flex w-full justify-center bg-zinc-200 rounded">
                            <table align='center' className='w-[80%] mt-3'>
                                <tr>
                                    <td align="center">
                                        {
                                            selectedFile === null &&
                                            <div
                                                className="my-1 flex items-center justify-center w-[80%] md:w-[50%] h-[180px] bg-white rounded-md shadow-md"
                                            >
                                                <p
                                                    className="italic text-center text-red-700 font-sans font-semibold"
                                                >
                                                    No File Selected !!
                                                </p>
                                            </div>
                                        }
                                        {
                                            selectedFile && selectedFile.type === "application/pdf" &&
                                            <div
                                                className="p-2 mt-1 mb-2 flex items-center justify-center  h-[180px] bg-white rounded-md shadow-md"
                                            >
                                                <embed
                                                    src={addfile.path}
                                                    type="application/pdf"

                                                    style={{ width: '100%', height: '100%' }}
                                                ></embed>
                                            </div>
                                        }
                                        {
                                            selectedFile && selectedFile.type === "image/jpeg" &&
                                            <div
                                                className="p-2 mt-1 mb-2 flex items-center justify-center  h-[180px] bg-white rounded-md shadow-md"
                                            >
                                                <img
                                                    src={addfile.path}
                                                    className="h-full w-full overflow-auto"
                                                ></img>
                                            </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            onChange={(e) => {
                                                console.log(e.target.files[0]);
                                                setSelectedFile(e.target.files[0]);
                                                setAddFile({
                                                    ...addfile,
                                                    name: e.target.files[0].name,
                                                    path: URL.createObjectURL(e.target.files[0])
                                                });
                                            }}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={(e) => { fileRef.current.click() }}
                                            className="bg-cyan-500 hover:bg-cyan-700 text-black hover:text-white px-4 py-2 font-sans rounded-md"
                                        >
                                            Browse
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="mt-3 mb-3 relative w-full">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={addfile.name}
                                                onChange={(e) => {
                                                    checkFileName(e.target.value);
                                                    setAddFile({
                                                        ...addfile,
                                                        name: e.target.value
                                                    })
                                                }}
                                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-zinc-200 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                            >
                                                File Name
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                {
                                    buttonState &&
                                    <tr>
                                        <th className="text-red-700 font-sans">
                                            file name is already taken, use another name.
                                        </th>
                                    </tr>
                                }
                                <tr>
                                    <td align='center'>
                                        <button
                                            disabled={buttonState}
                                            onClick={(e) => handleAddFiles()}
                                            className={`py-1 px-4 mb-3 rounded-lg text-black font-serif bg-green-500 ${buttonState ? "" : "hover:bg-green-800 hover:text-white"}`}
                                        >
                                            Done
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            }

            {/* Modal for Renaming the File */}
            {
                renameModel &&
                <div id="rename-file" className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-80">
                    <div className="z-50 flex flex-col items-center bg-zinc-200 rounded w-[50%] bg-opacity-100 opacity-100 py-5 pt-8">
                        <table className="w-[70%]">
                            <tr>
                                <th align="center" className=" text-xl  py-2 pb-3 text-gray-700">
                                    Change File Name
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="file-name"
                                            name="name"
                                            value={viewFile.name}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setViewFile({
                                                    ...viewFile,
                                                    name: e.target.value
                                                });
                                            }}
                                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 bg-white appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=""
                                            required
                                        />
                                        <label
                                            htmlFor="file-name"
                                            className="absolute -ml-[220px] text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                        >
                                            File Name
                                        </label>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <div className="w-full h-full flex items-center justify-evenly py-3">
                                    <button
                                        onClick={(e) => {
                                            handleRenameFile(viewFile.id);
                                        }}
                                        className="px-4 py-2 text-sm font-serif font-semibold bg-red-500 text-gray-900 hover:bg-red-700 hover:text-white rounded-md"
                                    >
                                        Done
                                    </button>
                                    <button
                                        onClick={(e) => setRenameModel(false)}
                                        className="px-4 py-2 text-sm font-serif font-semibold bg-green-500 text-gray-900 hover:bg-green-700 hover:text-white rounded-md"
                                    >
                                        Back
                                    </button>
                                </div>
                            </tr>
                        </table>
                    </div>
                </div>
            }

            {/* Modal for Deleting the File */}
            {
                deleteModel &&
                <div id="delete-file" className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-80">
                    <div className="z-50 flex flex-col items-center bg-zinc-200 rounded w-[50%] bg-opacity-100 opacity-100 py-5">
                        <table className="">
                            <tr>
                                <th colSpan={2} className=" text-xl font-serif font-semibold"> Do you want to delete this File</th>
                            </tr>
                            <tr>
                                <div className="w-full h-full flex items-center justify-evenly py-3">
                                    <button
                                        onClick={(e) => {
                                            handleDeleteFile(viewFile.id);
                                        }}
                                        className="px-5 py-2 text-sm font-serif font-semibold bg-red-500 text-gray-900 hover:bg-red-700 hover:text-white rounded-md"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={(e) => setDeleteModel(false)}
                                        className="px-5 py-2 text-sm font-serif font-semibold bg-green-500 text-gray-900 hover:bg-green-700 hover:text-white rounded-md"
                                    >
                                        No
                                    </button>
                                </div>
                            </tr>
                        </table>
                    </div>
                </div>
            }

            {/* Loading Animation */}
            {
                deleteAni &&
                <div id="loading" className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-80">
                    <div className="z-50 flex flex-col items-center bg-white rounded w-[30%] bg-opacity-100 opacity-100 py-5">
                        <img
                            src={deleteGif}
                        ></img>
                    </div>
                </div>
            }

            <ToastContainer />
        </>
    );
}