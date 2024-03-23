import { useState, useEffect } from "react";
import Button from "./Button";
import { useParams } from "react-router-dom";

const ConfessionForm = ({ setShowGetYourOwnMessages }: any) => {
  const { userId } = useParams();
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
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const prevUserIds = localStorage.getItem("aveu")
      ? JSON.parse(localStorage.getItem("aveu")!).userIds
      : [];
    const userIds = [...prevUserIds, userId];
    const data = {
      id: id,
      userIds: userIds,
    };
    localStorage.setItem("aveu", JSON.stringify(data));
    console.log(id, userId, message, latitude, longitude);
  };
  return (
    <>
      <h2 className="text-2xl font-medium text-secondary text-center font-cursiveStyle">
        Send anonymous message to{" "}
        <span className="font-bold font-roboto">{userId}</span>
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
