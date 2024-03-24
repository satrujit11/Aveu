import { useEffect, useState } from "react";
import Navigation from "./Navigation";

const Confessions = () => {
  const [tab, setTab] = useState("message");
  const [refresh, setRefresh] = useState(false);
  const navigationData = [
    { name: "Messages", id: "message" },
    { name: "Replies", id: "replies" },
  ];
  const userIds = localStorage.getItem("aveu")
    ? JSON.parse(localStorage.getItem("aveu")!).userIds
    : [];

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(!refresh);
      }, 2000);
    }
  }, [refresh]);
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary">Confessions</h2>
        <div className="p-2 rounded cursor-pointer bg-primary_light flex justify-center items-center">
          <i
            className={`material-symbols-outlined text-secondary  ${refresh ? "animate-spin" : ""}`}
            onClick={() => handleRefresh()}
          >
            refresh
          </i>
        </div>
      </div>
      {userIds.length > 0 && (
        <Navigation navigationData={navigationData} setTab={setTab} tab={tab} />
      )}
    </>
  );
};

export default Confessions;
