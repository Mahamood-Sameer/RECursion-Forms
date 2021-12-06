import React, { useEffect, useState } from "react";
import "./ResponseForm.css";
import { useParams } from "react-router";
import { db } from "../Firebase/firebase";
import MultipleChoice from "./MultipleChoice";
import Paragraph from "./Paragraph";
import CheckBox from "./CheckBox";

function ResponseForm() {
  let { Id, name, ResId, Resname } = useParams();

  const [responses, setResponses] = useState(null);

  useEffect(() => {
    db.collection("Response")
      .doc(Id)
      .collection(name)
      .doc(ResId)
      .collection(name)
      .onSnapshot((SnapShot) => {
        setResponses(SnapShot.docs.map((doc) => doc.data()));
      });
  }, []);

  console.log(responses);

  return (
    <>
      <div className="responseForm">
        <p>{Resname}</p>
        <div className="responseForm__header">
          <h1>{name}</h1>
        </div>
        <div className="responseForm__questions">
          {responses ? (
            <>
              {responses?.map((response) => {
                if (response?.Type === "Multiple Choice") {
                  return (
                    <MultipleChoice
                      question={response}
                      Disable={true}
                      ChoosenAnswer={response.Answer}
                    />
                  );
                } else if (response?.Type === "Paragraph") {
                  return (
                    <Paragraph
                      question={response}
                      Disable={true}
                      ChoosenAnswer={response.Answer}
                    />
                  );
                }
                else if(response?.Type === "Checkboxes"){
                    return (
                        <CheckBox
                          question={response}
                          Disable={true}
                          ChoosenAnswer={response.Answer}
                        />
                      ); 
                }
              })}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <br />
      <br />
    </>
  );
}

export default ResponseForm;
