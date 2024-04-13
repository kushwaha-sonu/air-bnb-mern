import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const IndexPage = () => {

    const [homePlaces, setHomePlaces] = useState([]);

    const getAllPlaces = async () => {
        const { data } = await axios.get('/api/home-places')
        setHomePlaces(data);
        // console.log(data)
    }

    useEffect(() => {
        getAllPlaces();
    }, []);


    return (
        <div className="-mt-10 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {homePlaces.length > 0 && homePlaces.map(place => (
                <div key={place._id} className="p-2">
                    <Link to={'/place/'+place._id}>
                        <div className="rounded-2xl">
                            {
                                place.photos?.[0] && (
                                    <img className="rounded-2xl aspect-square object-cover" src={'http://localhost:4000/api/upload-image/' + place.photos[0]} alt="img" />
                                )
                            }
                        </div>
                        <h2 className="text-xl font-semibold truncate">{place.address}</h2>
                        <h2 className="text-xl font-bold">{place.title}</h2>

                        <div className="mt-1">
                            <span className="font-bold text-xl">₹{place.price} per night</span>
                        </div>
                    </Link>

                </div>
            ))}
        </div>
    );
};

export default IndexPage;