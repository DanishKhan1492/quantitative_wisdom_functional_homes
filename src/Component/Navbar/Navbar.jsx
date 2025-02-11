// Navbar.jsx
import React,{useState,useEffect} from "react";
import { User } from "lucide-react";
import SecureLS from "secure-ls";
import jwt_decode from "jwt-decode";

const ls = new SecureLS({ encodingType: "aes" });

const Navbar = () => {
   const [data,setData] = useState({})

   useEffect(()=>{
    const token =ls.get("authToken")
    const decoded = jwt_decode(token);
    console.log(decoded,"------------------------------------decode-----------------")
    setData(decoded)
   },[])

  const userName = "Anna";
  const userRole = "Admin";

  return (
    <div className="bg-slate-900 shadow-sm p-4 flex justify-end items-center">
      <div className="flex items-center">
        <User
          className="w-8 h-8 text-white mr-3"
          style={{
            padding: "4px",
            borderRadius: "50%",
            border: "2px solid currentColor",
          }}
        />
        <div className="flex flex-col mr-2">
          <span className="text-lg text-white font-semibold mr-5">
            {data.firstName + " " + data.lastName}
          </span>
          <span className="text-md font-bold text-white bg-primary px-2 py-0.5 rounded-full">
            {data.roles}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
