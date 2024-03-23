import { useState } from "react";
import Navigation from "./Navigation";

const Confessions = () => {
  const [tab, setTab] = useState("message");
  const navigationData = [
    { name: "Messages", id: "message" },
    { name: "Replies", id: "replies" },
  ];
  const userIds = JSON.parse(localStorage.getItem("aveu")!).userIds;
  return (
    <>
      <h2 className="text-xl font-bold text-secondary">Confessions</h2>
      {userIds.length > 0 && (
        <Navigation navigationData={navigationData} setTab={setTab} tab={tab} />
      )}
    </>
  );
};

export default Confessions;
