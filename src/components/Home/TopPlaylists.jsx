import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserArtists } from '../../redux/Spotify/userTopArtists';
import { fetchUserByIdPlaylists } from '../../redux/Spotify/userPlaylists';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper';
import '../../styles/index.css';
import TopTracks from './TopTracks';
import TopGenres from './TopGenres';
import WallPosts from './WallPosts';
import { useParams } from 'react-router-dom';

export default function TopPlaylists({ token, session }) {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { items } = useSelector((store) => store.userPlaylists);
  useEffect(() => {
    dispatch(fetchUserArtists(token));
    dispatch(fetchUserByIdPlaylists(userId, token));
  }, [token]);

  if (items) {
    return (
      <div className="flex">
        <WallPosts session={session} />
        <div>
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="container left-96 block p-6 rounded-lg shadow-lg w-60 bg-gradient-to-r from-blue-200 to-cyan-200"
          >
            <div className="">
              {items.map((item) => {
                return (
                  <SwiperSlide className="" key={item.id}>
                    <h1 className="text-center text-lg font-semibold mt-2">
                      Top Playlists
                    </h1>
                    <img
                      src={item.images[0]?.url}
                      className="rounded-full resize h-60 w-60 p-4"
                    />
                    <p className="text-center font-semibold p-4">{item.name}</p>
                  </SwiperSlide>
                );
              })}
            </div>
          </Swiper>
        </div>
      </div>
    );
  }
  console.log('Sorry, there are no artists');
}
