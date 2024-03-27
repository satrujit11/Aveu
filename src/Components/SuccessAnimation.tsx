import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SuccessAnimation from "../assets/success-animation.json";

const MyLottieAnimation = ({ showCheckBackMessage = false }: any) => {
  const containerRef: any = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: SuccessAnimation, // Use animationData instead of path
    });

    return () => {
      animation.destroy(); // Clean up animation when component unmounts
    };
  }, []);

  return (
    <div>
      <div ref={containerRef}></div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-secondary text-xl font-bold">
          Secret message sent!
        </p>
        {showCheckBackMessage && (
          <p className="text-center text-[#ffffff] text-sm font-bold border-[1px] border-secondary_light p-2 rounded-lg bg-secondary_light">
            Remember to check back later to see if you got any replies
          </p>
        )}
      </div>
    </div>
  );
};

export default MyLottieAnimation;
