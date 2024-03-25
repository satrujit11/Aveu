import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SuccessAnimation from "../assets/loading-animation.json";

const MyLottieLoadingAnimation = () => {
  const containerRef: any = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: SuccessAnimation, // Use animationData instead of path
    });

    if (containerRef.current) {
      containerRef.current.style.transform = 'scale(0.5)';
    }

    return () => {
      animation.destroy(); // Clean up animation when component unmounts
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} ></div>
    </div>
  );
};

export default MyLottieLoadingAnimation;
