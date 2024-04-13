import { useState } from "react";
import axios from "axios";


// eslint-disable-next-line react/prop-types
export const PhotoUploader = ({ addPhotos, onChange }) => {

    const [photoLink, setPhotoLink] = useState("");
    const addPhotosByLink = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('/api/upload-by-link', {
                link: photoLink,
            });
            const fileName = data.image;
            // console.log(fileName);
            onChange((prev) => {
                return [...prev, fileName];
            })
            setPhotoLink('');


        } catch (error) {
            console.error('Error uploading photo:', error.message);


        }
    }

    const uploadPhotoFromDevice = (e) => {
        const files = e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {

            data.append('photos', files[i]);
        }

        axios.post('/api/upload-image', data, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            // console.log(filenames)
            onChange((prev) => {
                return [...prev, ...filenames];
            })
        })


    }

    const removePhoto = (ev,filename) => {
        ev.preventDefault();
        // eslint-disable-next-line react/prop-types
        onChange([...addPhotos.filter(photo => photo !== filename)]);
    }

    const selectAsMainPhoto = (ev,photoname) => { 
        ev.preventDefault();
        // eslint-disable-next-line react/prop-types
        onChange([photoname,...addPhotos.filter(photo => photo!==photoname)]);
    }


    return (
        <>
            <div className="grid mb-3">
                <label htmlFor="photoLink" className="font-semibold text-xl">
                    Photos :
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        id="photoLink"
                        value={photoLink}
                        onChange={(ev) => setPhotoLink(ev.target.value)}
                        placeholder="Add using link .... jpg"
                        className="p-2 rounded-md outline-none bg-slate-300 w-[70%]"
                    />
                    <button onClick={addPhotosByLink} className="p-2 w-[30%] text-center rounded-md border-2 bg-slate-300">
                        Add&nbsp;photo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3">

                {
                    // eslint-disable-next-line react/prop-types
                    addPhotos.length > 0 && addPhotos.map(imageAdd => (

                        <div className=" w-full h-ful relative" key={imageAdd} >
                            <img src={'http://localhost:4000/api/upload-image/' + imageAdd} alt="image" className="w-full h-40 object-cover rounded-md p-1" />
                            <button
                                onClick={ev => removePhoto(ev,imageAdd)}
                                className="absolute bottom-2 right-2 text-white bg-slate-800 p-2 bg-opacity-60 rounded-full hover:bg-red-600 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25
                                        2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5
                                        0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>

                            </button>
                            <button
                                onClick={ev => selectAsMainPhoto(ev,imageAdd)}
                                className="absolute left-2 bottom-2 bg-slate-800 p-2 bg-opacity-60 rounded-full hover:bg-white cursor-pointer text-2xl text-white hover:text-black">

                                {imageAdd === addPhotos[0] && (

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>


                                )}
                                {
                                    imageAdd !== addPhotos[0] && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0
                                            .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562
                                            0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563
                                            0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    )
                                }
                            </button>
                        </div>
                    ))
                }

                <div className=" w-52 h-40 flex items-center justify-center rounded-md border-2 border-blue-300">
                    <label className="p-4 text-xl flex items-center justify-center flex-col bg-transparent cursor-pointer">
                        <input type="file" name="file" multiple className="hidden" onChange={uploadPhotoFromDevice} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                            />
                        </svg>
                        Upload
                    </label>
                </div>
            </div>
        </>
    )
}
