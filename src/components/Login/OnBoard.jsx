import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Bee from "../../assets/bee.png";
import Card from "../Cards/Card";
import { motion } from "framer-motion";
import CategoryButton from "./CategoryButton";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { fetchUserArtists } from "../../redux/Spotify/userTopArtists";
import { fetchUserTracks } from "../../redux/Spotify/userTopTracks";

const OnBoard = ({ session, token }) => {
  const count = useSelector((state) => state);
  const video =
    "https://llxcoxktsyswmxmrwjsr.supabase.co/storage/v1/object/public/video/background.mp4";
  let userId = session?.user.id;
  let spotifyId = session?.user.user_metadata.name;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tracks } = useSelector((store) => store.userTopTracks);
  const { artists } = useSelector((store) => store.userTopArtists);
  const bounceTransition = {
    y: {
      duration: 1,
      yoyo: Infinity,
      ease: "easeOut",
    },
  };

  useEffect(() => {
    if (userId) {
      updateUser(userId, spotifyId, spotifyId);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUserArtists(token));
    console.log("top artist", tracks);
  }, [token]);

  useEffect(() => {
    dispatch(fetchUserTracks(token));
    console.log("top artist", artists);
  }, [token]);

  const updateUser = async (id, spotifyId, display_name) => {
    try {
      const { data: user } = await supabase
        .from("User")
        .update({ spotifyId, display_name })
        .eq("id", id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen relative">
      <video
        className="bg-cover w-full h-full object-cover"
        src={video}
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white p-4 bg-gray-900/30">
        <div className="absolute inset-x-0 top-0">
          <motion.span
            transition={bounceTransition}
            animate={{ y: ["6%", "-7%"] }}
            className="flex justify-center item-center"
          >
            <img src={Bee} className="object-contain h-50 w-96 " alt="logo" />
          </motion.span>
          <h1 className="p-5 md:text-4xl font-bold">
            Welcome To Vibe, please pick your TOP 3 Categories
          </h1>
        </div>
        <div className="flex justify-center">
          <Card />
        </div>

        <div
          className={
            count.count !== 3 ? "hidden" : "absolute inset-x-0 bottom-5"
          }
        >
          <CategoryButton session={session} />
        </div>
      </div>
    </div>
  );
};

export default OnBoard;
