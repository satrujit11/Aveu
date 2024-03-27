import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../Config/firebase";
import ConfessionCard from "./ConfessionCard";
import MyLottieLoadingAnimation from "./LoadingAnimation";
import RepliesCard from "./RepliesCard";

const Confessions = () => {
  const [tab, setTab] = useState("message");
  const [userRealId, setUserRealId] = useState("");
  const collectionRef = collection(db, "data");
  const [refresh, setRefresh] = useState(false);
  const [confessions, setConfessions] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const navigationData = [
    { name: "Messages", id: "message" },
    { name: "Replies", id: "replies" },
  ];

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(!refresh);
      }, 1500);
    }
  }, [refresh]);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("aveu")!).id;
    const q = query(collectionRef, where("userId", "==", id));
    onSnapshot(q, (data) => {
      const datas = data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      //@ts-ignore
      setUserRealId(datas[0].id);
      //@ts-ignore
      setConfessions(datas[0].confessions);
      //@ts-ignore
      setComments(datas[0].comments);
    });

    const q2 = query(collection(db, "posts"), where("submittedBy", "==", id));
    onSnapshot(q2, (snapshot) => {
      const filteredPosts = snapshot.docs
        .filter((doc) => doc.data().comments)
        .map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(filteredPosts, "filteredPosts");
      //@ts-ignore
      setReplies(filteredPosts);
      console.log(replies, "replies");
    });
  }, []);
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary">
          { !confessions && replies.length > 0 ? "Replies" : "Confessions"}
        </h2>
        <div className="p-2 rounded cursor-pointer bg-primary_light flex justify-center items-center">
          <i
            className={`material-symbols-outlined text-secondary  ${refresh ? "animate-spin" : ""}`}
            onClick={() => handleRefresh()}
          >
            refresh
          </i>
        </div>
      </div>
      {replies.length > 0 && confessions && (
        <Navigation navigationData={navigationData} setTab={setTab} tab={tab} />
      )}
      {refresh ? (
        <MyLottieLoadingAnimation />
      ) : confessions && tab === "message" ? (
        <div className="flex flex-col gap-3 pb-4">
          {confessions
            .slice()
            .reverse()
            .map((data: any) => (
              <ConfessionCard
                key={data.id}
                confession={data}
                otherUserId={userRealId}
                comments={comments}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {replies
            .slice()
            .reverse()
            .map((data: any) => (
              <RepliesCard key={data.id} replies={data} />
            ))}
        </div>
      )}
    </>
  );
};

export default Confessions;
