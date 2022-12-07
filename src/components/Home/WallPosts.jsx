import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function WallPosts() {
  return (
    <div className=" w-60">
      <textarea
        className="textarea textarea-primary w-96"
        placeholder="Write a post"
      ></textarea>
      <button className="btn btn-sm btn-secondary">Submit</button>
    </div>
  );
}
