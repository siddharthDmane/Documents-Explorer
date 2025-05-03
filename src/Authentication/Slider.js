import react, { useState } from 'react';
import c1 from './Images/c1.jpg';
import c2 from './Images/c2.jpg';
import c3 from './Images/c3.jpg';
import c4 from './Images/c4.jpg';

export function Slider() {

    const images = [c1, c2, c3, c4];
    const [index, setIndex] = useState(0);

    return (
        <>
            <div classname="flex flex-row  border border-gray-400  rounded-lg w-full h-full">
                <button
                    onClick={(e) => setIndex(index + 1 > images.length-1 ? 0 : index + 1)}
                    className={`hidden md:block absolute  top-[310px] left-[80px] w-[5%] h-5 bg-gray-500 text-gray-700 hover:text-white
                 font-bold  rounded-xl`}
                >
                </button>
                <img
                    className='w-[100%] h-[100%] border border-gray-400 rounded-xl'
                    src={images[index]}
                >
                </img>
                <button
                    onClick={(e) => setIndex(index - 1 < 0 ? images.length-1 : index - 1)}
                    className={`hidden md:block absolute top-[310px] left-[640px] w-[5%] h-5 bg-gray-500 text-gray-700 hover:text-white
                 font-bold p-2 rounded-xl`}
                >
                </button>
            </div>
        </>
    );
}