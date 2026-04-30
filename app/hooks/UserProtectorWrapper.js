"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserDataStore } from "../context/userContext";
import { useRouter } from "next/navigation";
import MainLoader from "../components/MainLoader";

const UserProtectorWrapper = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  const { user, setUser, isAuthenticated, setIsAuthenticated } = UserDataStore();

  const tokenChecker = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        toast.error("Login First");
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      console.log(isAuthenticated, user);

      if(isAuthenticated && user){
        console.log("User already authenticated");
        setLoading(false);
        setError(false);
        return;
      }
      console.log("User is not already authenticated");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token-verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data.UserDetails);
        setIsAuthenticated(true);
      }
      setError(false);
    } catch (error) {
      if (error.status === 409) {
        toast.error("First verify your email");
        return router.push(`/auth/otp-verification/${token}?forgotPassword=false`);
      } else if (error.status === 404 || error.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        toast.error("Login First");
        router.push("/auth/login");
      } else {
        toast.error("OOPS! Something went wrong");
        router.push("/");
      }
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    tokenChecker();
  }, []);

  return (
    <div>
      {(loading || error)? (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center w-screen h-screen">
          <MainLoader/>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default UserProtectorWrapper;
