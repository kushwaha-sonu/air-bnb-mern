import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from '../pages/PlacesPage.jsx'
import AccountNav from "../component/AccountNav.jsx";

const ProfilePage = () => {
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    const [redirect, setRedirect] = useState(null);
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/api/logout');
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav />

            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="bg-rose-600 max-w-sm mt-2 w-full p-2 rounded-md hover:bg-red-500 text-2xl font-semibold">Logout</button>
                </div>
            )}
            {subpage === 'places' && (

                <PlacesPage />

            )}
        </div>
    );
};

export default ProfilePage;