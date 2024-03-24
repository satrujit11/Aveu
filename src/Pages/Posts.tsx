import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Confessions from "../Components/Confessions";
import Button from "../Components/Button";

const Posts = () => {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("aveu") || "{}").id;
  const [shareError, setShareError] = useState("");
  const [shareMessage, setShareMessage] = useState("Share!");
  const [copied, setCopied] = useState(false);

  const url = `google.com/${id}`;

  const handleShare = async () => {
    setShareError("");
    setShareMessage("Sharing...");
    try {
      const text = `💌 Share your thoughts anonymously and join the conversation! 🤫✨ ${url} #Aneu #AnonymousMessage`;
      await navigator.share({ text });
      setShareMessage("Share Again");
    } catch (error) {
      console.error("Error sharing:", error);
      setShareError("Sharing failed. Please try again.");
      setShareMessage("Share Again");
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(`${url}`);
      setCopied(true);
    } catch (error) {
      console.error("Error copying:", error);
      setShareError("Copying failed. Please try again.");
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  useEffect(() => {
    if (
      !localStorage.getItem("aveu") ||
      !JSON.parse(localStorage.getItem("aveu")!).name
    ) {
      navigate("/create");
    }
  }, []);

  return (
    <div className="bg-primary h-screen">
      <div className="container mx-auto px-4 flex flex-col gap-6">
        <section className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <Header />
            <div className="w-full h-[1px] bg-secondary_light"></div>
            <h2 className="text-2xl font-bold text-center text-secondary">
              Share your Link to get{" "}
              <span className="font-cursiveStyle">Anonymous messages</span>
            </h2>
            <div className="p-2 bg-primary_light rounded w-full text-center flex gap-2 justify-between items-center">
              <p className="text-sm font-bold text-center text-secondary">
                {url}
              </p>
              <i
                className={
                  copied
                    ? "material-symbols-outlined text-success"
                    : "material-symbols-outlined cursor-pointer text-secondary"
                }
                onClick={handleCopy}
              >
                {copied ? "check_circle" : "content_copy"}
              </i>
            </div>
            <Button onClick={handleShare}>{shareMessage}</Button>
            {shareError && (
              <p className="text-danger font-bold">{shareError}</p>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <Confessions />
        </section>
      </div>
    </div>
  );
};

export default Posts;
