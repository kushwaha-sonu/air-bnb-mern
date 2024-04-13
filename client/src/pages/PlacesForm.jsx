import { useEffect, useState } from "react";
import { Navigate, useParams } from 'react-router-dom'
import { Perks } from "../component/Perks";
import { PhotoUploader } from "../component/PhotoUploader";
import axios from "axios";
import AccountNav from "../component/AccountNav";

export const PlacesForm = () => {

    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState();
    const [addPhotos, setAddPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkInTime, setCheckInTime] = useState("");
    const [checkOutTime, setCheckOutTime] = useState("");
    const [maxGuest, setMaxGuest] = useState(1);
    const [price, setPrice] = useState(0);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) return;

        axios.get('/api/places/' + id).then((response) => {
            const { data } = response;
            // console.log(data)
            setTitle(data.title);
            setAddress(data.address);
            setAddPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo)
            setCheckInTime(data.checkIn);
            setCheckOutTime(data.checkOut);
            setMaxGuest(data.maxGuests)
            setPrice(data.price)

        })

    }, [id])


    const savePlaces = async (e) => {
        e.preventDefault();

        const placeData = {
            title, address, addPhotos,
            perks, extraInfo, checkInTime,
            checkOutTime, maxGuest, description,price
        }
        if (id) {

            await axios.put('/api/places', {
                id,
                ...placeData
            });
        } else {
            await axios.post('/api/places', placeData);
        }

        setRedirect(true)
    }

  

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }



    return (
        <>
            <AccountNav />
            <div className="container py-10 max-h-[calc(100%-80px)]">
                <div className="bg-slate-100 max-w-[45rem] mx-auto">
                    <form className="p-5" onSubmit={savePlaces}>
                        <div className="grid mb-3">
                            <label htmlFor="tittle" className="font-semibold text-xl">
                                Tittle :
                            </label>
                            <input

                                type="text"
                                name="tittle"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder=" Tittle for your place "
                                className="p-2 rounded-md outline-none bg-slate-300"
                            />
                        </div>
                        <div className="grid mb-3">
                            <label htmlFor="address" className="font-semibold text-xl">
                                Address :
                            </label>
                            <input

                                type="text"
                                name="address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder=" address of the place"
                                className="p-2 rounded-md outline-none bg-slate-300"
                            />
                        </div>

                        <PhotoUploader addPhotos={addPhotos} onChange={setAddPhotos} />


                        <div className="grid mb-3">
                            <label htmlFor="description" className="font-semibold text-xl">
                                Description :
                            </label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                cols="30"
                                rows="6"
                                placeholder="Description of the place"
                                className="bg-slate-300 rounded-md p-2 outline-none"
                            ></textarea>
                        </div>


                        <Perks selected={perks} onChange={setPerks} />


                        <div className="grid mb-3">
                            <label htmlFor="extraInfo" className="font-semibold text-xl">
                                Extra Info :
                            </label>
                            <input
                                type="text"
                                name="extraInfo"
                                value={extraInfo}
                                onChange={e => setExtraInfo(e.target.value)}
                                placeholder=" address of the place"
                                className="p-2 rounded-md outline-none bg-slate-300"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid mb-3">
                                <label htmlFor="checkInTime" className="font-semibold text-xl">
                                    Check in time :
                                </label>
                                <input

                                    type="text"
                                    name="checkInTime"
                                    value={checkInTime}
                                    onChange={e => setCheckInTime(e.target.value)}
                                    placeholder="check in time"
                                    className="p-2 rounded-md outline-none bg-slate-300"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="checkOutTime" className="font-semibold text-xl">
                                    Check out time :
                                </label>
                                <input

                                    type="text"
                                    name="checkOutTime"
                                    value={checkOutTime}
                                    onChange={e => setCheckOutTime(e.target.value)}
                                    placeholder="check out time"
                                    className="p-2 rounded-md outline-none bg-slate-300"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="maxGuest" className="font-semibold text-xl">
                                    Max number of guests :
                                </label>
                                <input

                                    type="text"
                                    name="maxGuest"
                                    value={maxGuest}
                                    onChange={e => setMaxGuest(e.target.value)}
                                    placeholder="number of guests"
                                    className="p-2 rounded-md outline-none bg-slate-300"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="maxGuest" className="font-semibold text-xl">
                                    Price Per Night :
                                </label>
                                <input

                                    type="text"
                                    name="maxGuest"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="number of guests"
                                    className="p-2 rounded-md outline-none bg-slate-300"
                                />
                            </div>
                        </div>
                        <button className="font-bold text-2xl mt-14 bg-rose-800 p-4 rounded-sm w-full mb-5">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}


export default PlacesForm;