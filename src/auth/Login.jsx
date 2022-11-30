import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";

export default function Login() {
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = "f66d801286b24df78db5be66cb18b8e4";
  const REDIRECT_URI = "http://localhost:5173/";
  const RESPONSE_TYPE = "token";
  const scope = `ugc-image-upload
    user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    streaming
    app-remote-control
    user-library-modify
    user-library-read
    user-top-read
    user-read-email
    user-read-private
    user-read-playback-position
    user-read-recently-played
    user-follow-read
    user-follow-modify
    playlist-read-private
    playlist-read-collaborative
    playlist-modify-public
    playlist-modify-private`;

  const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`;

  const [token, setToken] = useState("");
  const [myInfo, setMyInfo] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const me = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMyInfo(data.items);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  //TESTED DB FETCH ID
  //done with vibe
    //adding a vibe, mutual still false
    const vibe = async ()=>{
      try {
        const { data, error } = await supabase
      .from('Vibe')
      .insert([
      { friendId: 6, userId: 10 },
    ])
    console.log('clicked')
      } catch (error) {
        console.log(error)
      }
    }

    //delete a vibe && setMutual false
    const deleteVibe = async (userId, friendId)=>{
      try {
        const { data, error } = await supabase
      .from('Vibe')
      .delete()
      .match({userId:userId,friendId:friendId})
      let {data:deleteMutual}  = await supabase.from('Vibe').update({ mutual: 'false' }).match({ userId:friendId, friendId:userId })
      } catch (error) {
        console.log(error)
      }
    }

  
  // fetching user's friends
  const superbaseDB = async () => {
    try {
      let { data: friends, error } = await supabase.from("Vibe").select("friendId").eq("userId",6);
      console.log("before map",friends);

     let users = await Promise.all(friends.map(friend => 
       supabase
      .from("User")
      .select("*")
      .eq("id",friend.friendId)))
      console.log("after map",users[0].data)
    } catch (error) {
      console.log(error);
    }
  };

  //
  const addCategories =async ()=>{
    try {
      let { data: users, error } = await supabase
  .from('User_Top_Cat')
  .select('*') 
  console.log(users)
  let filteredUsers = users.filter(user=>user.favCats.includes('pop'))
  console.log(filteredUsers)
    } catch (error) {
      console.log(error)
    }
  }

  //checkFriend
  //ex. check before writing on wall
  const checkMutual = async() => {
    try {
      //find status of one user's mutual, if one is true assume the other is also true. in this case checking userid 6
      let {data : user}  = await supabase.from("Vibe").select("mutual").match({userId:6,friendId:10})
      console.log(user)
    } catch (error) {
      console.log(error)
    }
  }

  //change status to true on both user rows
  const setMutual = async()=>{
      //update mutual status of one user, if one is false, will need to update the other one
      try{
      let {data:setMutualA}  = await supabase.from('Vibe').update({ mutual: 'true' }).match({userId:6,friendId:10})
      console.log(setMutualA)
      let {data:setMutualB}  = await supabase.from('Vibe').update({ mutual: 'true' }).match({userId:10,friendId:6})
      console.log(setMutualB)
    } catch (error) {
      console.log(error)
    }
  }


//Jerry goes to Le's page they are strangers, useEffect runs SELECT on Vibe table JerryUser and LeFriend check if row exists, 
//if return null, you did not vibe yet, so vibe button is "VIBE".
//Jerry clicks on vibe,  it will run the vibe function to add the row with jerry USER le Friend.
//check relationship exist in the opposite, where Le user Jerry friend. if both rows exist, run setMutual. 
//with Le's Userid check Jerry Friendid,if returns null = then dont do anything.
//if returns a row, then run setMutual on both side.

//if returns a row,button will show "VIBED" check mutual value.
    //if mutual=true, allow write on wall. else cannot write on wall

 
//two days, Le goes on Jerrys page after jerry already vibed, useEffects run checkmutual(), which still return false at this point. Le clicks on vibe, whichs runs the vibe function to add row Le User Jerry Friend. where Jerry user Le friend. if both rows exist, run setMutual.


//removeVibe



  return (
    <div>
      <h1 className="flex justify-center items-center font-medium text-6xl">
        Vibe
      </h1>
      {!token ? (
        <a
          className="flex justify-center items-center h-screen p-20"
          href={AUTH_URL}
        >
          <button
            className="bg-teal-500 hover:bg-teal-700 h-10 w-40 active:ring"
            type="submit"
            href={AUTH_URL}
          >
            Login
          </button>
        </a>
      ) : (
        <div>
          <h1 className="flex justify-center items-center font-medium text-3xl">
            Welcome
          </h1>
          <button onClick={superbaseDB}>getfriend</button>
          <button onClick={vibe}>Vibe</button>
          <button onClick={addCategories}>addCategories</button>
          <button onClick={checkMutual}>checkMutual</button>
          <button onClick={setMutual}>setMutual</button>
          <button onClick={()=>deleteVibe(6,10)}>deleteVibe</button>
          <a className="flex justify-center items-center">
            <button
              className="bg-teal-500 hover:bg-teal-700 h-10 w-40 active:ring"
              onClick={me}
            >
              Get My Info
            </button>
          </a>
          <a className="flex justify-center items-center h-screen p-20">
            <button
              className="bg-teal-500 hover:bg-teal-700 h-10 w-40 active:ring"
              onClick={logout}
            >
              Logout
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
