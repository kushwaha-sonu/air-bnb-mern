import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

// eslint-disable-next-line react/prop-types
export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
        // console.log(user);
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        const response = await axios.post('/api/bookings', {
            checkIn, checkOut, numberOfGuests, name, phone,
            // eslint-disable-next-line react/prop-types
            place: place._id,
            // eslint-disable-next-line react/prop-types
            price: numberOfNights * place.price,
        });
        const bookingId = response.data._id;
        // console.log(bookingId);
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl mt-8">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="grid">
                    <div className="py-1 px-4 w-full block items-center">
                        <label className="text-xl">Check in:</label>
                        <input type="date"
                            className="w-full p-2 border-2 border-slate-500 rounded-md"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="px-4 border-l block items-center">
                        <label className=" text-xl">Check out:</label>
                        <input type="date"
                            className="w-full p-2 border-2 border-slate-500 rounded-md"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-1 px-4 border-t block items-center">
                    <label className="w-[50%] text-xl">Number of guests:</label>
                    <input type="number"
                        className="p-2 w-full border-2 border-slate-500 rounded-md"
                        value={numberOfGuests}
                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="py-1 px-4 border-t grid md:grid-cols-2 gap-2">
                        <div>
                            <label className="w-full text-xl">Your full name:</label>
                            <input
                                className="p-2 w-full border-2 border-slate-500 rounded-md"
                                type="text"
                                value={name}
                                onChange={ev => setName(ev.target.value)} />
                        </div>
                        <div className="-py-1">
                            <label className="w-[50%] text-xl">Phone number:</label>
                            <input type="tel"
                                className="p-2 w-full border-2 border-slate-500 rounded-md"
                                value={phone}
                                onChange={ev => setPhone(ev.target.value)} />
                        </div>
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="bg-rose-700 mt-4 p-3 text-2xl text-white w-full rounded-md hover:bg-red-500">
                Book this place
                {numberOfNights > 0 && (
                    // eslint-disable-next-line react/prop-types
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    );
}