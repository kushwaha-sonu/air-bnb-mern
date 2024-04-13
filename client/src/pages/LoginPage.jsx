import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });
      setUser(data);
      // console.log(data)
      toast.success("Login Successful");
      setRedirect(true);
    } catch (e) {
      toast.error("Login Failed");
      console.log(e);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center h-[25rem]">
      <div className="h-full w-[30rem]">
        <h1 className="text-4xl text-center mb-6 font-semibold">Login</h1>
        <form
          className="w-full flex flex-col gap-6 border-2 h-full p-4 bg-blue-100"
          onSubmit={handleLoginSubmit}
        >
          <input
            className="p-4 rounded border-2"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            className="p-4 rounded border-2"
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="font-bold text-2xl mt-14 bg-rose-800 p-4 rounded-sm">
            Login
          </button>
          <div className="text-center py-2 text-gray-500 ">
            Don't have an account yet? 
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
