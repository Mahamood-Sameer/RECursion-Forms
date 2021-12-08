import React, { useEffect, useState } from "react";
import "./Paragraph.css";
import { db } from "../Firebase/firebase";

function Paragraph({ question, Disable, Id, formName, user, ChoosenAnswer }) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!Disable) {
      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .collection(formName)
        .doc(question.Question)
        .set({
          Question: question.Question,
          Answer: answer,
          Type: question.type,
          FileType: question.FileType,
          FileURL: question.FileURL
        });
      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .set({
          ResponseName: user?.user.displayName,
          ResponseId: user?.user.uid,
        });
    }
  }, [answer]);

  return (
    <>
      <div className="paragraph_questions">
        <strong className="question">{question?.Question}</strong>
        {question?.FileType == "Image" ? (
          <>
            <img
              src={question?.FileURL}
              style={{ width: "380px", objectFit: "contain" }}
            />
          </>
        ) : (
          <>
            {question?.FileType == "Video" ? (
              <>
                <video width="400" height="240" controls>
                  <source src={question?.FileURL} type="video/mp4" />
                </video>
              </>
            ) : (
              <>
                {question?.FileType == "Audio" ? (
                  <>
                    <audio controls>
                      <source src={question?.FileURL} type="audio/mpeg" />
                    </audio>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
        <input
          type="text"
          className="paragraph"
          placeholder="Long-Answer text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          disabled={Disable}
        />
        {ChoosenAnswer ? (
          <>
            <br />
            <br />
            Given answer : <br />
            <br />
            {ChoosenAnswer}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Paragraph;
