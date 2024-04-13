import {useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    // const [redirect, setRedirect] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post('/api/register',{
                name,
                email,
                password
            })

            toast.success("Registration Successful")
        }catch (e) {
            toast.error('Registration failed Please try again later');
        }

    }
    return (
        <div className="mt-4 grow flex items-center justify-center h-[25rem]">
            <div className="h-full w-[30rem]">
                <h1 className="text-4xl text-center mb-6 font-semibold">Register</h1>
                <form className="w-full flex flex-col gap-6 border-2 h-full p-4 bg-blue-100"
                      onSubmit={handleRegisterSubmit}>

                    <input className="p-4 rounded border-2"
                           type="text"
                           placeholder="John Doe"
                           value={name}
                           onChange={ev => setName(ev.target.value)}
                    />
                    <input className="p-4 rounded border-2"
                           type="email"
                           placeholder="your@email.com"
                           value={email}
                           onChange={ev => setEmail(ev.target.value)}
                    />
                    <input className="p-4 rounded border-2"
                           type="password"
                           placeholder="password"
                           value={password}
                           onChange={ev => setPassword(ev.target.value)}
                    />
                    <button className="font-bold text-2xl bg-rose-800 p-4 rounded-sm">Register</button>
                    <div className="text-center py-2 text-gray-500 ">
                        Already have an account? <Link className="underline text-black" to={'/login'}>Login
                        now</Link>
                    </div>
                </form>
            </div>
        </div>);
};

export default RegisterPage;