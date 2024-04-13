import "./App.css";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./Layout.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {UserContextProvider} from "./UserContext.jsx";
import axios from "axios";


import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlacesForm from "./pages/PlacesForm.jsx";
import HomePlacePage from "./pages/HomePlacePage.jsx";
import MyBookingPage from "./pages/MyBookingPage.jsx";
import SingleBookingPage from "./pages/SingleBookingPage.jsx";

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {

    return (
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<IndexPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/account/" element={<ProfilePage/>}/>
                        <Route path="/account/places" element={<PlacesPage/>}/>
                        <Route path="/account/places/new" element={<PlacesForm/>}/>
                        <Route path="/account/places/:id" element={<PlacesForm/>}/>
                        <Route path="/place/:id" element={<HomePlacePage/>}/>
                        <Route path="/account/bookings" element={<MyBookingPage/>}/>
                        <Route path="/account/bookings/:id" element={<SingleBookingPage/>}/>
                    </Route>
                </Routes>
                <ToastContainer/>
            </UserContextProvider>

    );
}

export default App;
