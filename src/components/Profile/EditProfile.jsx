import React, { useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavBar from "../Home/Navbar";

const EditProfile = ({ token, session }) => {
  const spotifyId = session?.user.user_metadata.sub;
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameForm = {};
    const bioForm = {};
    const submitForm = [nameForm, bioForm];

    if (image) {
      const { data } = await supabase.storage
        .from("profile-images")
        .upload(`${spotifyId}-avatar`, image);
      if (data) {
        const { data: img } = await supabase.storage
          .from("profile-images")
          .getPublicUrl(`${spotifyId}-avatar`);
        await supabase
          .from("Profile_Image")
          .update({ url: img.publicUrl })
          .match({ userSpotify: `${spotifyId}` });
      }
    }
    if (e.target.display_name.value)
      nameForm.display_name = e.target.display_name.value;
    if (e.target.bio.value) bioForm.bio = e.target.bio.value;

    const updateForm = async () => {
      const { data, error } = await supabase
        .from("User")
        .update({ bio: bioForm.bio })
        .match({ spotifyId: spotifyId })
        .select();
    };

    await supabase
      .from("User")
      .update({ display_name: nameForm.display_name })
      .match({ spotifyId: spotifyId });
    updateForm();

    navigate(`/profile/${spotifyId}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase
        .from("User")
        .select()
        .match({ spotifyId: `${spotifyId}` });
      if (data) {
        setName(data[0].display_name);
        setBio(data[0].bio);
      }
    };
    fetchUser();
  }, [spotifyId]);

  return (
    <div>
      <NavBar />
      <form
        id="editForm"
        className="flex justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-96 mt-20">
          <h1 className="flex justify-center text-2xl font-semi-bold mb-6">
            Edit Profile
          </h1>
          <div className="form-control">
            <label className="input-group input-group-vertical ">
              <span className="dark:text-white/80 dark:bg-gray-600">
                Username
              </span>
              <input
                type="text"
                placeholder="Username"
                name="display_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
              />
            </label>
          </div>
          <div className="form-control mt-4">
            <label className="input-group input-group-vertical">
              <span className="dark:text-white/80 dark:bg-gray-600">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Bio"
                name="bio"
              ></textarea>
            </label>
          </div>
          <div className="grid justify-center">
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text dark:text-white/80">
                  Profile Pic
                </span>
              </label>
              <label className="input-group input-group-vertical ">
                <input
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  className="file-input file-input-bordered file-input-md w-full max-w-xs dark:text-black/80"
                />
              </label>
            </div>
          </div>
          <div className="flex  justify-center">
            <button
              type="submit"
              form="editForm"
              value="Submit"
              className="btn dark:bg-orange-300 btn-secondary dark:border-0 text-black/60 hover:bg-gray-300 dark:text-black/80 bg-purple-200 border-0 w-60 mt-4"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
