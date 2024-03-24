import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
// import { CN } from "../../utils/functions";

const CountdownTimer = ({ isShow, setIsShow }) => {
  const [remainingTime, setRemainingTime] = useState(2 * 60000);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Retrieve remaining time from local storage on component mount
    const storedTime = localStorage.getItem("countdownTime");
    if (storedTime && storedTime != NaN) {
      setRemainingTime(parseInt(storedTime));
    }
    // else {
    //   setRemainingTime(2 * 60000);
    // }
    if (localStorage.getItem("CountDownCompleted")) {
      setIsShow(false);
    }
  }, []);

  const handleComplete = () => {
    // Clear remaining time in local storage when countdown completes
    localStorage.removeItem("countdownTime");
    localStorage.setItem("CountDownCompleted", 1);
    console.log("ccccc");
    setIsShow(false);
  };

  useEffect(() => {
    if (localStorage.getItem("CountDownCompleted")) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  }, []);
  const RestartTimer = () => {
    setKey(!key);
  };
  const handleTick = (time) => {
    // Store remaining time in local storage on each tick
    localStorage.setItem("countdownTime", time.total);
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  };
  useEffect(() => {
    if (!isShow) {
      setRemainingTime(2 * 60000);
      const newKey = Math.random();
      setKey(newKey);
    }
  }, [isShow]);
    
  return (
    <div className={`${!!isShow ? "" : "hidden"} text-xl`}>
      {/* {!localStorage.getItem("CountDownCompleted") && ( */}
      <Countdown
        key={key}
        date={Date.now() + remainingTime}
        onComplete={handleComplete}
        onTick={handleTick}
        renderer={renderer}
      />
      {/* )} */}
    </div>
  );
};

export default CountdownTimer;
