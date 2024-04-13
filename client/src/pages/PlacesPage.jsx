import { Link, useParams } from "react-router-dom";
import AccountNav from "../component/AccountNav";
import { useEffect, useState } from "react";
import axios from 'axios';
import PlaceImg from "../component/PlaceImg";

const PlacesPage = () => {

  const { action } = useParams();
  const [places, setPlaces] = useState([]);
  // const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get('/api/places').then(({ data }) => {
      setPlaces(data);
    })
   
  }, [])


  return (
    <div>
      <AccountNav />
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      <div className="mt-4 mb-20 grid gap-8">
        {places.length > 0 && places.map(place => (
          <Link key={place._id} to={'/account/places/' + place._id}
            className="flex cursor-pointer gap-4 bg-gray-100 p-4">
            <div className="flex w-[40%] h-80 grow shrink-0 overflow-hidden">
              <PlaceImg place={place}/>
            </div>
            <div className="grow-0 shrink py-6 px-4">
              <h2 className="text-2xl font-semibold">{place.title}</h2>
              <p className="text-xl mt-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlacesPage;
