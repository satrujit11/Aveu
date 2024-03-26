import { useEffect, useRef, useState } from "react";
import { CommentDialog } from "./ConfessionCard";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Config/firebase";

const RepliesCard = ({ replies }: any) => {
  const confessionCard = useRef(null);
  const [relevantComments, setRelevantComments] = useState(replies?.comments);
  const [showCommentCount, setShowCommentCount] = useState(false);
  const [commentCount, setCommentCount] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [comment, setComment] = useState("");
  const id = JSON.parse(localStorage.getItem("aveu")!).id;
  const [otherUserId, setOtherUserId] = useState("");

  useEffect(() => {
    if (relevantComments) {
      if (relevantComments.length > 0) {
        setShowCommentCount(true);
        if (relevantComments.length === 1) {
          setCommentCount(`1 reply`);
        } else if (relevantComments.length <= 5) {
          setCommentCount(`${relevantComments.length} replies`);
        } else {
          setCommentCount(`5+ replies`);
        }
      }
    }
  }, [relevantComments]);

  useEffect(() => {
    if (replies) {
      console.log(replies);
      setRelevantComments(replies?.comments);
    }
  }, [replies]);

  const handleComment = () => {
    setShowCommentDialog(true);
  };

  const handleCommentSubmit = () => {
    const q2 = query(
      collection(db, "data"),
      where("userId", "==", replies?.userId)
    );
    getDocs(q2)
      .then((data) => {
        const datas = data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        console.log(datas, "Super Data");
        setOtherUserId(datas[0].id);

        const docRef = doc(db, "data", otherUserId);
        const randomId = generateRandomId();
        const time = new Date().toLocaleString();
        updateDoc(docRef, {
          comments: arrayUnion({
            id: randomId,
            postId: replies.postId,
            message: comment,
            time: time,
            submittedBy: JSON.parse(localStorage.getItem("aveu")!).id,
          }),
        })
          .then(() => {
            const q3 = query(
              collection(db, "posts"),
              where("postId", "==", replies.postId)
            );
            getDocs(q3)
              .then((data) => {
                const datas = data.docs.map((doc) => {
                  return { ...doc.data(), id: doc.id };
                });
                const otherPostId = datas[0].id;
                const postsRef = doc(db, "posts", otherPostId);
                updateDoc(postsRef, {
                  comments: arrayUnion({
                    id: randomId,
                    postId: replies.id,
                    message: comment,
                    time: time,
                    submittedBy: JSON.parse(localStorage.getItem("aveu")!).id,
                  }),
                });
              })
              .catch((err) => console.log(err));
            setComment("");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }
  return (
    <div
      className="flex flex-col gap-3 w-full p-2 border border-secondary_light rounded-lg bg-primary_light relative"
      ref={confessionCard}
      id="confession-card"
    >
      <h3 className="text-2xl font-semibold text-secondary font-sans">
        {replies.message}
      </h3>
      <div className="flex justify-between">
        <span className="text-secondary_light font-sans">{replies.time}</span>
        <div className="flex justify-end items-center gap-4 remove-me">
          {showCommentCount && (
            <p className="text-secondary_light font-sans">{commentCount}</p>
          )}

          <i
            className="material-symbols-outlined text-secondary_light"
            onClick={() => handleComment()}
          >
            {"comment"}
          </i>
        </div>
      </div>
      {showCommentDialog && (
        <CommentDialog
          setShowCommentDialog={setShowCommentDialog}
          confession={replies}
          comment={comment}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
          comments={relevantComments}
          id={id}
        />
      )}
    </div>
  );
};

export default RepliesCard;
