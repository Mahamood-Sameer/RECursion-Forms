import React, { useState, useEffect } from "react";
import "./Myforms.css";
import MyFormCards from "./MyFormCards";
import { db } from "../Firebase/firebase";

function Myforms({ user }) {
  const [myforms, setMyforms] = useState(null);
  useEffect(() => {
    db.collection("Users")
      .doc(user?.uid)
      .collection("Forms")
      .onSnapshot((SnapShot) => {
        setMyforms(SnapShot.docs.map((doc) => doc.data()));
      });
  },[user]);
  console.log(myforms);
  return (
    <div className="myforms">
      <div className="myforms__header">
        <span>My Forms</span>
      </div>
      <div className="myforms__container">
        {myforms ? (
          <>
            {myforms?.map((form) => (
              <MyFormCards title={form?.Title} user={user} />
            ))}
          </>
        ) : (
          <>
            <center>
              No forms created yet.....
            </center>
          </>
        )}
      </div>
    </div>
  );
}

export default Myforms;
