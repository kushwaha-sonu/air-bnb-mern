import Navbar from "./component/Navbar.jsx";
import {Outlet} from "react-router-dom";



const Layout = () => {
    return (
        <div className="px-8" >
            <Navbar/>
            <div className=" pl-4 pr-4 mt-44">
                <Outlet/>
            </div>
        </div>
    );
};

export default Layout;