import { useState, useEffect } from "react";
import Button from "./Button";
import { useParams } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Config/firebase";

const ConfessionForm = ({ setShowGetYourOwnMessages, setSendMessage }: any) => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const id = localStorage.getItem("aveu")
    ? JSON.parse(localStorage.getItem("aveu")!).id
    : generateRandomId();
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  // @ts-ignore
  const [accuracy, setAccuracy] = useState<any>(null); //@ts-ignore
  const [error, setError] = useState<any>(null);

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setAccuracy(position.coords.accuracy);
        },
        function (error) {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    const q = query(collection(db, "data"), where("userId", "==", userId));
    getDocs(q).then((data) => {
      const availableData = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      // @ts-ignore
      setUserName(availableData[0].name);
      setOtherUserId(availableData[0].id);
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const prevUserIds = localStorage.getItem("aveu")
      ? JSON.parse(localStorage.getItem("aveu")!).userIds
      : [];
    const userIds = [...prevUserIds, userId];
    const data = {
      id: id,
      name:
        (localStorage.getItem("aveu") &&
          JSON.parse(localStorage.getItem("aveu")!).name) ||
        "",
      userIds: userIds,
    };
    localStorage.setItem("aveu", JSON.stringify(data));
    setSendMessage(true);

    handleConfessionSubmit();

    const q = query(collection(db, "data"), where("userId", "==", id));
    getDocs(q).then((data) => {
      const availableData = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      if (availableData.length == 0) {
        addDoc(collection(db, "data"), {
          userId: id,
        })
          .then(() => {
            console.log("Document added successfully");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        console.log("Already Exists");
      }
    });
  };

  const handleConfessionSubmit = () => {
    const docRef = doc(db, "data", otherUserId);

    updateDoc(docRef, {
      confessions: arrayUnion({
        id: generateRandomId(),
        message: message,
        location: `${latitude}, ${longitude}`,
        time: new Date().toLocaleString(),
        submittedBy: JSON.parse(localStorage.getItem("aveu")!).id,
      }),
    }).then(() => {
      setMessage("");
    }).catch((err) => console.log(err));
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-secondary text-center font-cursiveStyle">
        Send anonymous message to{" "}
        <span className="font-bold font-roboto">{userName}</span>
      </h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <textarea
          name="confession"
          id="confession"
          placeholder="Send me anonymous messages....."
          className="w-full rounded-lg p-4 h-32 bg-primary_light outline-none  border border-secondary focus:border focus:border-secondary focus:border-4 text-lg font-bold text-secondary placeholder-black resize-none"
          value={message}
          onFocus={() => setShowGetYourOwnMessages(false)}
          onBlur={() => setShowGetYourOwnMessages(true)}
          onChange={(e) => setMessage(e.target.value.trimStart())}
        />
        {message && <Button type="submit">Confess</Button>}
      </form>
    </>
  );
};

export default ConfessionForm;
