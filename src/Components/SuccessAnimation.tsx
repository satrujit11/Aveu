import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SuccessAnimation from "../assets/success-animation.json";

const MyLottieAnimation = () => {
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
      <p className="text-center text-secondary text-xl font-bold">
        Secret message sent!
      </p>
    </div>
  );
};

export default MyLottieAnimation;
