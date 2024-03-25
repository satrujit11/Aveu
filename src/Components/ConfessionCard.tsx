import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toPng } from "html-to-image";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebase";

const ConfessionCard = ({ confession, otherUserId, comments }: any) => {
  const confessionCard = useRef(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [relevantComments, setRelevantComments] = useState([]);
  const [showCommentCount, setShowCommentCount] = useState(false);
  const [commetCount, setCommentCount] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const id = JSON.parse(localStorage.getItem("aveu")!).id;

  const handleShareImage = useCallback(() => {
    const node = confessionCard.current;
    const filter = (node: any) => {
      const exclusionClasses = ["remove-me"];
      return !exclusionClasses.some((classname) =>
        node.classList?.contains(classname)
      );
    };

    toPng(node!, { cacheBust: true, filter })
      .then(async (dataUrl) => {
        return fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            navigator.share({
              files: [new File([blob], "my-node.png", { type: "image/png" })],
            });
          });
      })
      .catch(function (error) {
        console.error("Error generating or sharing image:", error);
      });
  }, [confessionCard]);

  const handleComment = () => {
    if (relevantComments.length == 0) {
      if (showCommentBox) {
        if (comment !== "") {
          handleCommentSubmit();
        } else {
          // setShowCommentBox(false);
        }
      } else {
        // setShowCommentBox(true);
        setShowCommentDialog(true);
      }
    } else {
      setShowCommentCount(true);
      setShowCommentDialog(true);
    }
  };

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  const handleCommentSubmit = () => {
    const docRef = doc(db, "data", otherUserId);
    updateDoc(docRef, {
      comments: arrayUnion({
        id: generateRandomId(),
        postId: confession.id,
        message: comment,
        time: new Date().toLocaleString(),
        submittedBy: JSON.parse(localStorage.getItem("aveu")!).id,
      }),
    })
      .then(() => {
        setShowCommentBox(false);
        setComment("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
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
  }, [relevantComments]);

  useEffect(() => {
    setRelevantComments(
      comments.filter((comment: any) => comment.postId === confession.id)
    );
  }, [comments]);

  return (
    <div
      className="flex flex-col gap-2 w-full p-2 border border-secondary_light rounded-lg bg-primary_light relative"
      ref={confessionCard}
      id="confession-card"
    >
      <h3 className="text-2xl font-semibold text-secondary font-sans">
        {confession.message}
      </h3>
      <span className="text-secondary_light font-sans">{confession.time}</span>
      <div className="flex justify-end items-center gap-4 remove-me">
        {showCommentBox && (
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value.trimStart())}
            placeholder="Write your response"
            className="w-full rounded-lg p-2 bg-primary_light outline-none  border border-secondary focus:border-secondary focus:border-2 font-bold text-secondary placeholder-black resize-none"
          />
        )}

        {showCommentCount && (
          <p className="text-secondary_light font-sans">{commetCount}</p>
        )}

        <i
          className="material-symbols-outlined text-secondary_light"
          onClick={() => handleComment()}
        >
          {showCommentBox ? (comment !== "" ? "send" : "close") : "comment"}
        </i>

        {!showCommentBox && (
          <i
            className="material-symbols-outlined text-secondary_light"
            onClick={handleShareImage}
          >
            share
          </i>
        )}
      </div>
      {showCommentDialog && (
        <CommentDialog
          setShowCommentDialog={setShowCommentDialog}
          confession={confession}
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

export default ConfessionCard;

const defaultDialogStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  position: "fixed",
  textAlign: "center",
  overflow: "hidden",
  margin: "auto",
  width: "100vw",
  borderRadius: "0.6rem 0.6rem 0 0",
  maxWidth: "900px",
  maxHeight: "60vh",
  minHeight: "20vh",
  top: "inherit",
  animation: "slideUp 0.2s ease-out alternate",

  transition:
    "opacity 0.2s ease-out alternate , display 0.2s ease-out alternate",
};

const CommentDialog = ({
  setShowCommentDialog,
  confession,
  comment,
  setComment,
  handleCommentSubmit,
  comments,
  id,
}: any) => {
  const dialog = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    (dialog.current as any).showModal();
  }, [dialog]);

  const handleClose = () => {
    (dialog.current as any).close();
    setShowCommentDialog(false);
  };

   const commentsContainerRef = useRef(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    // @ts-ignore
    commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
  };

  // Scroll to bottom when comments change
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  return (
    <dialog
      ref={dialog}
      style={defaultDialogStyle}
      className="bg-primary p-4 flex flex-col justify-between"
    >
      <div className="pb-2 ">
        <div className="flex flex-row-reverse gap-2 items-start">
          <i
            className="material-symbols-outlined text-secondary p-2 border-[1px] rounded border-secondary cursor-pointer bg-primary_light h-full"
            onClick={() => handleClose()}
          >
            close
          </i>
          <div className="flex flex-col gap-2 w-full p-2 border border-secondary_light rounded-lg bg-primary_light relative items-start">
            <h3 className="text-lg font-semibold text-secondary font-sans">
              {confession.message}
            </h3>
          </div>
        </div>
      </div>
      <div className="h-full w-full bg-red flex-1 flex flex-col gap-3 overflow-y-scroll max-h-[50vh]" ref={commentsContainerRef}>
        {comments.map((comment: any) => (
          <div key={comment.id} className="flex flex-col gap-2 ">
            <div
              className={`flex flex-col max-w-70 ${comment.submittedBy === id ? "items-end" : "items-start"}`}
            >
              <h5
                className={`font-semibold text-secondary font-sans p-1 bg-primary_light rounded  max-w-[70vw] ${comment.submittedBy === id ? "text-right" : "text-left"}`}
              >
                {comment.message}
              </h5>

              <span className="text-secondary_light font-sans text-[12px]">
                {comment.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-4 pt-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value.trimStart())}
          placeholder="Write your response"
          className="w-full rounded-lg p-2 bg-primary outline-none  border border-secondary focus:border-secondary focus:border-2 font-bold text-secondary placeholder-black resize-none transition-transform"
        />
        {comment && (
          <i
            className="material-symbols-outlined text-[#ffffff] p-2  rounded  cursor-pointer h-full bg-secondary"
            onClick={() => handleCommentSubmit()}
          >
            send
          </i>
        )}
      </div>
    </dialog>
  );
};