import {Link} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../UserContext.jsx";

const Navbar = () => {
    const {user}=useContext(UserContext);
    return (
        <header className="px-8 py-4 shadow-xl flex justify-between bg-blue-100 fixed top-0 left-0 w-full z-40">
            <Link to={'/'} className="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-12 h-12 -rotate-90"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                </svg>
                <h1 className="font-bold text-4xl">airbnb</h1>
            </Link>

            <div
                className="flex items-center border border-gray-400 rounded-full py-2 px-6 gap-4 shadow-md shadow-slate-500">
                <div className="font-medium">Anywhere</div>
                <div className=" border border-l-2 border-gray-400 h-full"></div>
                <div className="font-medium">Any week</div>
                <div className=" border border-l-2 border-gray-400 h-full"></div>
                <div className="font-medium">Any guest</div>
                <button className=" bg-red-500 rounded-full p-2 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                </button>
            </div>

            <div className=" flex items-center gap-3 border border-gray-500 rounded-full px-2 bg-white">
                <div className=" ml-4 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                        />
                    </svg>
                </div>

                <div className='flex items-center overflow-hidden gap-3 justify-center'>
                    <Link to={user?'/account':'/login'} className="bg-slate-500 rounded-full flex items-center p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>

                    </Link>
                    {
                        !!user &&(
                            <div className='text-2xl font-semibold capitalize text-center'>
                                {user.name}
                            </div>
                        )
                    }

                </div>

            </div>
        </header>
    )
}

export default Navbar
