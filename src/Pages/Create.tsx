import { useState } from "react";
import Button from "../Components/Button";
import Logo from "../assets/logo-transparent.png";
import { useNavigate } from "react-router-dom";
import { db } from "../Config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const Create = () => {
  const navigate = useNavigate();
  const collectionRef = collection(db, "data");
  const [name, setName] = useState("");
  const handleLinkCreate = () => {
    let id, localName, userIds;
    if (localStorage.getItem("aveu")) {
      id = JSON.parse(localStorage.getItem("aveu")!).id;
      localName = JSON.parse(localStorage.getItem("aveu")!).name;
    } else {
      id = generateRandomId();
    }
    userIds = localStorage.getItem("aveu")
      ? JSON.parse(localStorage.getItem("aveu")!).userIds
      : [];
    if (localName !== name && name !== "") {
      userIds = [...userIds];
      id = generateRandomId();
    }
    const data = {
      id: id,
      name: name,
      userIds: [...userIds],
    };
    localStorage.setItem("aveu", JSON.stringify(data));

    const q = query(collectionRef, where("userId", "==", id));
    getDocs(q).then((data) => {
      const availableData = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      if (availableData.length > 0) {
        const docRef = doc(db, "data", availableData[0].id);
        updateDoc(docRef, {
          name: name,
        })
          .then(() => {
            navigate("/");
          })
          .catch((err) => console.log(err));
      } else {
        addDoc(collectionRef, {
          name: name,
          userId: id,
        })
          .then(() => {
            navigate("/");
          })
          .catch((err) => console.log(err));
      }
    });
  };

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }
  return (
    <div className="bg-primary min-h-[100dvh]">
      <div className="container mx-auto px-4">
        <section className="flex flex-col items-center gap-8 justify-between min-h-screen pb-8">
          <div className="flex flex-col gap-5 w-full">
            <img src={Logo} alt="logo" className="max-h-36 mx-auto" />
            <h1 className="text-xl font-bold text-secondary text-center ">
              Get your own Aveu link
            </h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.trimStart())}
              placeholder="Enter your name"
              className="w-full rounded-lg p-4 bg-primary_light outline-none  border border-secondary focus:border-secondary focus:border-4 font-bold text-secondary placeholder-black resize-none"
            />
            {name && (
              <Button onClick={() => handleLinkCreate()}>Get Link</Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Create;
