import { useState } from "react";
import Button from "../Components/Button";
import ConfessionForm from "../Components/ConfessionForm";
import Logo from "../assets/logo-transparent.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showGetYourOwnMessages, setShowGetYourOwnMessages] = useState(true);
  return (
    <div className="bg-primary h-[100dvh]">
      <div className="container mx-auto px-4">
        <section className="flex flex-col items-center gap-8 justify-between h-[100dvh] pb-4">
          <div className="flex flex-col gap-4 w-full">
            <img src={Logo} alt="logo" className="max-h-36 mx-auto" />
            <ConfessionForm
              setShowGetYourOwnMessages={setShowGetYourOwnMessages}
            />
          </div>
          {showGetYourOwnMessages && (
            <Button onClick={() => navigate("/")}>
              Get Your Own Messages!
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
