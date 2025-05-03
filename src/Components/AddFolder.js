import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFolder, faX, faI, faA, faV, faP } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import loadingGif from "../Animations/loading.gif";

export function AddFolder() {

    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [nameModel, setNameModel] = useState(false);
    const [editfolder, setEditFolder] = useState({
        id: "0",
        name: "unknown"
    });
    const [loading, setLoading] = useState(false);
    const getAllFolders = async () => {
        try {
            var res = await axios.get(
                `https://localhost:7054/api/Folders/User/${localStorage.getItem("id")}`
            );
            console.log(res.data);
            setFolders(res.data.items);
        }
        catch (e) {
            console.log("Error : " + e);
            toast.error("Backend Error !!");
        }
    }

    useEffect(() => {
        const initialLoading = async () => {
            setLoading(true);
            try{
                await getAllFolders();
            }
            catch(error){
                console.log("Error : "+error);
                setLoading(false);
            }
            finally{
                setLoading(false);
            }
        }
        initialLoading();
    }, [])

    const handleAddMoreFolder = async () => {
        let newFolder = {
            id: `${folders.length + 1}`,
            name: "new folder " + `${folders.length + 1}`
        }

        try {
            var res = await axios.post(
                `https://localhost:7054/api/Folders/Add/${localStorage.getItem("id")}`,
                { Name: newFolder.name }
            );
            if (res.data.status === 200) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("Error : " + error);
            toast.error("Backend Error !!");
        }
        finally {
            await getAllFolders();
        }
    }

    const initiateNameChange = (folder) => {
        setNameModel(true);
    }

    const handleCloseModal = () => {
        setNameModel(false);
    }

    const handleChange = (e) => {
        setEditFolder({
            ...editfolder,
            name: e.target.value
        });
    }

    const handleFolderName = async () => {
        try {
            var res = await axios.post(
                `https://localhost:7054/api/Folders/Rename/${editfolder.id}`,
                { Name: editfolder.name }
            );
            if (res.data.status === 200) {
                toast.success("Folder Renamed Successfully.");
            }
            if (res.data.status === 404) {
                toast.error(res.data.message);
                return;
            }
        } catch (error) {
            toast.error(res.data.message);
            console.log("Error : " + error);
            return;
        }
        finally {
            await getAllFolders();
            setNameModel(false);
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

            <div id="main-body" className="flex flex-row md:justify-normal justify-evenly bg-cyan-100 flex-wrap w-full h-full overflow-y-auto p-5 rounded-lg shadow-md">
                {
                    folders.length > 0 &&
                    folders?.map((folder, index) => {
                        return (
                            <div
                                key={index}
                                // onClick={(e) => handleAddMoreFolder()}
                                className="flex flex-col items-center justify-center m-[5px] w-[150px] h-[150px] bg-white shadow-lg rounded-md cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    icon={faFolder}
                                    style={{ color: "#74C0FC", }}
                                    onClick={(e) => { navigate(`/document-manager/folder/${folder.id}`); }}
                                    className="h-[100px]"
                                />
                                <p
                                    className="font-sans font-semibold"
                                    onDoubleClick={
                                        (e) => {
                                            setEditFolder({
                                                id: folder.id,
                                                name: folder.name
                                            });
                                            initiateNameChange(folder);
                                        }
                                    }
                                >
                                    {folder.name}
                                </p>
                            </div>
                        )
                    })
                }
                <div
                    onClick={(e) => handleAddMoreFolder()}
                    className="flex flex-col items-center justify-center m-[5px] w-[150px] h-[150px] bg-white shadow-xl rounded-md cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} style={{ color: "#74C0FC" }} className="h-[80px]" />
                    <p
                        className="font-sans font-semibold"
                    > Add Folder</p>
                </div>
            </div>

            {/* folder name change modal */}
            {
                nameModel &&
                <div id="change-folder-name" className="z-50 flex items-center justify-center fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-90">
                    <div className="flex flex-col items-center bg-zinc-200 rounded w-[50%] opacity-100">
                        <div className="flex justify-end mt-1 mr-2 w-full">
                            <button
                                onClick={(e) => handleCloseModal()}
                                className="bg-red-500 hover:bg-red-700 p-1 w-[30px] h-[30px] rounded-full"
                            >
                                <FontAwesomeIcon icon={faX} style={{ color: "white", }} />
                            </button>
                        </div>
                        <div className="flex w-full justify-center bg-zinc-200 rounded h-[150px]">
                            <table align='center' className='w-[80%]'>
                                <tr>
                                    <td>
                                        <div className="mt-3 mb-3 relative w-full">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={editfolder.name}
                                                onChange={(e) => handleChange(e)}
                                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="ml-1 absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-zinc-200 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                            >
                                                Change Folder Name
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align='center'>
                                        <button
                                            onClick={(e) => handleFolderName()}
                                            className='py-1 px-4 mb-3 rounded-lg text-black font-serif bg-green-500 hover:bg-green-800 hover:text-white'
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
            <ToastContainer />
        </>
    );
}