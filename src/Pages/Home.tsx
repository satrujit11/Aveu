import { useState } from "react";
import Button from "../Components/Button";
import ConfessionForm from "../Components/ConfessionForm";
import Logo from "../assets/logo-transparent.png";
import { useNavigate } from "react-router-dom";
import MyLottieAnimation from "../Components/SuccessAnimation";

const Home = () => {
  const navigate = useNavigate();
  const [sendMessage, setSendMessage] = useState(false);
  const [showGetYourOwnMessages, setShowGetYourOwnMessages] = useState(true);
  return (
    <div className="bg-primary h-[100dvh]">
      <div className="container mx-auto px-4">
        <section className="flex flex-col items-center gap-8 justify-between h-[100dvh] pb-4">
          <div className="flex flex-col gap-4 w-full">
            <img src={Logo} alt="logo" className="max-h-36 mx-auto" />
            {sendMessage ? (
              <MyLottieAnimation />
            ) : (
              <ConfessionForm
                setShowGetYourOwnMessages={setShowGetYourOwnMessages}
                setSendMessage={setSendMessage}
              />
            )}
          </div>
          {showGetYourOwnMessages && (
            <Button
              onClick={() => navigate("/")}
              className={
                sendMessage
                  ? "animate-bounce bg-secondary text-[#ffffff] font-bold py-4 px-6 rounded-lg w-full hover:saturate-200"
                  : " bg-secondary text-[#ffffff] font-bold py-4 px-6 rounded-lg w-full hover:saturate-200"
              }
            >
              Get Your Own Messages!
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
