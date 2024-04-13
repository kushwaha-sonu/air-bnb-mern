import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../component/BookingWidget";
import PlaceGallery from "../component/PlaceGallery";
import AddressLink from "../component/AddressLink";
// import PlaceGallery from "../component/PlaceGallery";

const HomePlacePage = () => {
    const { id } = useParams();
    const [individualPlace, setIndividualPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const getAllPlaces = async () => {
        const data = await axios.get(`/api/places/${id}`);

        setIndividualPlace(data.data);
        // console.log(data.data);
    };

    useEffect(() => {
        if (!id) return;
        getAllPlaces();
    }, [id]);

    if (!individualPlace) return "";

    return (


        <div className=" -mt-16 -mx-8 px-8">

            <h1 className="text-3xl font-bold">{individualPlace.title}</h1>

            <div className="">
                <AddressLink>{individualPlace.address}</AddressLink>
            </div>
            <div className="mt-14">
                <PlaceGallery place={individualPlace} />

            </div>
            <div className="grid md:grid-cols-2 gap-4 py-6">

                <div className="text-xl">
                    <div className="my-4">
                        <h2 className="font-bold text-2xl">Description</h2>
                        {individualPlace.description}
                    </div>
                    Check-in: {individualPlace.checkIn}<br />
                    Check-out: {individualPlace.checkOut}<br />
                    Max number of guests: {individualPlace.maxGuests}
                </div>

                <BookingWidget place={individualPlace} />

            </div>
            <div className="bg-white -mx-8 px-8 py-8 mb-14 mt-4 rounded-">

                <h2 className="font-bold text-2xl">Extra info</h2>

                <div className="mb-4 mt-2 text-xl text-gray-600 leading-5">{individualPlace.extraInfo}</div>
            </div>
        </div>

    );
};

export default HomePlacePage;