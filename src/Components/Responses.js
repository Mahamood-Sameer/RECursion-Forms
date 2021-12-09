import React, { useEffect, useState } from "react";
import "./Responses.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { db } from "../Firebase/firebase";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Responses() {
  let { Id, name } = useParams();
  console.log(Id, name);

  const [responses, setResponses] = useState([]);
  useEffect(() => {
    db.collection("Response")
      .doc(Id)
      .collection(name)
      .onSnapshot((Snapshot) => {
        setResponses(Snapshot?.docs.map((doc) => doc.data()));
      });
  }, []);

  console.log(responses);

  return (
    <div className="responses__section">
      <div className="responses__header">
        <Link to={`/form/${Id}/${name}`} target="_blank">
          <h1>{name}</h1>
        </Link>
        <span>Responses</span>
      </div>
      <div className="responses__body">
        {(responses.length !==0)? (
          <>
          <h3 style={{marginLeft:"10px"}}>These are the names of the people who had submitted the form</h3>
          <br />
            {responses?.map((response) => (
              <Link
                to={`/${Id}/${name}/${response.ResponseId}/${response.ResponseName}`}
                className="responsed_people"
              >
                <p>{response.ResponseName}</p>
                <ArrowForwardIcon />
              </Link>
            ))}
          </>
        ) : (
          <>
            <h4>No responses</h4>
          </>
        )}
      </div>
    </div>
  );
}

export default Responses;
