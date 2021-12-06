import React, { useEffect, useState } from "react";
import "./Paragraph.css";
import { db } from "../Firebase/firebase";

function Paragraph({ question, Disable, Id, formName, user , ChoosenAnswer }) {
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
    <div className="paragraph_questions">
      <strong className="question">{question?.Question}</strong>
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
      {
        ChoosenAnswer?<><br /><br />Given answer : <br /><br />{ChoosenAnswer}</>:<></>
      }
    </div>
  );
}

export default Paragraph;
