import { useState } from "react";
import Image from "../component/Image";

export default function PlaceGallery({ place }) {

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className=" absolute inset-0 text-white top-28">
                <div className="bg-slate-800 rounded-2xl w-36 relative -right-8 text-center flex justify-center">
                    <button onClick={() => setShowAllPhotos(false)} className="flex gap-1 justify-center items-center p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                        Close photos
                    </button>
                </div>
                <h2 className="text-3xl left-7 mt-3 font-semibold relative text-black">Photos of {place.title}</h2>
                <div className="bg-white p-8 grid gap-4 grid-cols-2 mt-48">

                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div key={photo._id}>
                            {/* <img className="aspect-square object-cover w-full min-h-[20rem] h-[33rem] rounded-2xl" src={'http://localhost:4000/api/upload-image/' + photo} alt="img" /> */}
                            <Image src={photo} alt="..." />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="-mx-8 -mt-12 px-8 h-full">
            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
            <div className="mt-4 mb-8 grid gap-2 grid-cols-1 md:grid-cols-[2fr_1fr] bg-gray-200">
                <div className="w-full h-full p-4">
                    {
                        place.photos?.[0] && (
                            <Image onClick={() => setShowAllPhotos(true)} src={place.photos[0]} alt="" />
                        )
                    }
                </div>
                <div className="grid gap-3 p-4">
                    {
                        place.photos?.[1] && (
                            <Image onClick={() => setShowAllPhotos(true)}  src={place.photos[1]} alt="" />
                        )
                    }
                    <div className="relative">
                        {
                            place.photos?.[2] && (
                                <Image onClick={() => setShowAllPhotos(true)}src={place.photos[2]} alt="" />
                            )
                        }

                        <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-6 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            Show more photos
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}