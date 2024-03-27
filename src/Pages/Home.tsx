import { useEffect, useState } from "react";
import Button from "../Components/Button";
import ConfessionForm from "../Components/ConfessionForm";
import Logo from "../assets/logo-transparent.png";
import { useNavigate } from "react-router-dom";
import MyLottieAnimation from "../Components/SuccessAnimation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../Config/firebase";

const Home = () => {
  const navigate = useNavigate();
  const [sendMessage, setSendMessage] = useState(false);
  const [showGetYourOwnMessages, setShowGetYourOwnMessages] = useState(true);
  const [replies, setReplies] = useState([]);
  const userIds = localStorage.getItem("aveu")
    ? JSON.parse(localStorage.getItem("aveu")!).userIds
    : [];

  useEffect(() => {
    if (userIds.length > 0 && !JSON.parse(localStorage.getItem("aveu")!).name) {
      const id = JSON.parse(localStorage.getItem("aveu")!).id;
      const q2 = query(collection(db, "posts"), where("submittedBy", "==", id));
      onSnapshot(q2, (snapshot) => {
        const filteredPosts = snapshot.docs
          .filter((doc) => doc.data().comments) // Filter out posts with a non-empty comments array
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        //@ts-ignore
        setReplies(filteredPosts);
      });
      if (replies.length > 0) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // Show the notification
            new Notification("You have got replies on your confession", {
              body: "Click to create an account and start conversation",
              icon: Logo,
              requireInteraction: true, // This will keep the notification open until the user interacts with it
            }).onclick = () => navigate("/create");
          }
        });
      }
    }
  }, [sendMessage, replies]);
  return (
    <div className="bg-primary h-[100dvh]">
      <div className="container mx-auto px-4">
        <section className="flex flex-col items-center gap-8 justify-between h-[100dvh] pb-4">
          <div className="flex flex-col gap-4 w-full">
            <img src={Logo} alt="logo" className="max-h-36 mx-auto" />
            {sendMessage ? (
              <MyLottieAnimation showCheckBackMessage={replies.length === 0 && true} />
            ) : (
              <ConfessionForm
                setShowGetYourOwnMessages={setShowGetYourOwnMessages}
                setSendMessage={setSendMessage}
              />
            )}
          </div>
          <div className="flex flex-col gap-10 w-full">
            {replies.length > 0 &&
              !JSON.parse(localStorage.getItem("aveu")!).name && (
                <p className="text-center text-secondary font-bold">
                  You have {replies.length} replies on the confession you gave.
                  Please click on below link to create aacount to start
                  conversation
                </p>
              )}
            {showGetYourOwnMessages && (
              <Button
                onClick={() => navigate("/")}
                className={
                  sendMessage
                    ? "animate-bounce bg-secondary text-[#ffffff] font-bold py-4 px-6 rounded-lg w-full hover:saturate-200"
                    : " bg-secondary text-[#ffffff] font-bold py-4 px-6 rounded-lg w-full hover:saturate-200"
                }
              >
                {replies.length > 0 &&
                !JSON.parse(localStorage.getItem("aveu")!).name
                  ? "Create Account"
                  : localStorage.getItem("aveu") &&
                      JSON.parse(localStorage.getItem("aveu")!).name
                    ? "See Your Messages"
                    : "Get Your Own Messages!"}
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
