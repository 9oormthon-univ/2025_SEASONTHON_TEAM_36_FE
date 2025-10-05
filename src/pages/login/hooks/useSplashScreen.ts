import { useEffect, useState } from "react";

export const useSplashScreen = () => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowing(false);
    }, 1500);

    return () => clearTimeout(timer);
  });

  return showing;
};
