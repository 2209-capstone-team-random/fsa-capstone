import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import VibesList from "./VibesList.jsx";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Drawer({
  children,
  isOpen,
  setIsOpen,
  userId,
  session,
}) {
  const nav = useNavigate();
  const [vibes, setVibes] = useState([]);
  const [status, setStatus] = useState(false);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    nav("/");
  };

  useEffect(() => {
    if (status) {
      nav("/");
    }
  }, [status]);

  useEffect(() => {
    const getVibes = async () => {
      const { data } = await supabase
        .from("Vibe")
        .select("*")
        .match({ userSpotify: session?.user?.user_metadata.sub, mutual: true });
      if (vibes.length < 1) {
        setVibes(data);
      }
    };
    getVibes();
  }, []);

  return (
    <main
      className={
        " fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          " w-screen  max-w-lg right-0 absolute bg-blue-100 dark:bg-zinc-600 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
          <header className="p-4 font-bold text-center text-2xl dark:bg-black/70  bg-white">
            V I B E
          </header>
          <Link to={`/profile/${session?.user.user_metadata.sub}`}>
            <h2 className=" p-3 text-center hover:bg-blue-300 dark:hover:bg-black/60 font-semibold">
              Home
            </h2>
          </Link>
          {children}
          <Link to="/editProfile" className="">
            <p className="justify-between text-center font-semibold dark:hover:bg-black/60 hover:bg-blue-300  p-3">
              Edit Profile
            </p>
          </Link>
          <button
            className="font-semibold dark:hover:bg-black/60 hover:bg-blue-300 p-3"
            onClick={signOut}
          >
            Sign Out
          </button>

          <h2 className="font-semibold text-center text-2xl">VIBEES</h2>
          <VibesList
            userId={userId}
            vibes={vibes}
            ownId={session?.user.user_metadata.sub}
          />
          <div className="">
            <ul className="flex mt-4 justify-evenly">
              <li className="avatar  h-10 w-10 bg-gray-100 text-black rounded-full p-2  flex justify-center">
                <a href="https://www.linkedin.com/in/lelu95/">L.L</a>
              </li>
              <li className="avatar h-10 w-10 bg-gray-100 text-black rounded-full p-2  flex justify-center">
                <a href="https://www.linkedin.com/in/kevinan1004/">K.A</a>
              </li>
              <li className="avatar  h-10 w-10  bg-gray-100 text-black rounded-full p-2  flex justify-center">
                <a href="https://www.linkedin.com/in/jerryhwu/">J.W</a>
              </li>
              <li className="avatar  h-10 w-10  bg-gray-100 text-black rounded-full p-2  flex justify-center">
                <a href="https://www.linkedin.com/in/henry-cardenas89/">H.C</a>
              </li>
            </ul>
          </div>
        </article>
      </section>
      <button
        className="fixed top-5 right-5 text-xl p-1 hover:bg-gray-200 dark:hover:bg-zinc-600"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        X
      </button>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
