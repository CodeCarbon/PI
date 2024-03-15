"use client"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"

export default function Home() {
  const [num, setNum] = useState("CLIPPPPPPPX1245676");
  const [canUseButton, setcanUseButton] = useState(false);
  const [isAnimatingPI, setisAnimatingPI] = useState(false);
  const [aniClickButton, setAniClickButton] = useState({
    key: "",
    type: true // t=> transparent f=> blue
  });
  const [err, setErr] = useState({
    key: "",
  });
  const [score, setScore] = useState(1);

  const PI = useRef(Math.PI.toString());
  const keyList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "↵"];

  const varient = {
    "0": {
      //   backgroundColor: "transparent",
      scale: 1
    },

    "1": {
      backgroundColor: "#8b5cf6",
      scale: 0.8
    },
    "err": {
      backgroundColor: "#dc2626",
    }
  }
  const index = useRef(1);
  const validate = async (key) => {
    if (num === "") return;
    if (num === PI.current.slice(0, index.current)) {
      index.current++;
    } else {
      setisAnimatingPI(true);
      setErr({
        key: key
      })
      index.current = 1;
    }
    if (num === PI.current.slice(0, score + 3)) {
      setScore(score + 1);
      index.current = 1;
      setNum("");
      setisAnimatingPI(true);
    }
  }
  useEffect(() => {
    if (isAnimatingPI) {
      start();
    }
  }, [score]);

  const keyListenr = (e) => {
    if (!canUseButton || isAnimatingPI || !keyList.includes(e.key)) return;
    setAniClickButton({
      key: e.key,
      type: "1"
    });
    setcanUseButton(false);
    setNum(num + e.key);
  }
  useEffect(() => {
    window.addEventListener("keydown", keyListenr);
    return () => window.removeEventListener("keydown", keyListenr);
  })
  const start = async () => {
    setisAnimatingPI(true);
    setNum("");
    setErr({
      key: ""
    })
    for (const val of PI.current.slice(0, score + 3)) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setNum(pre => pre + val);
          setAniClickButton({
            key: val,
            type: "2"
          })
          resolve();
        }, 1000);
      });
    }
    await new Promise(r => setTimeout(r, 1000));
    setisAnimatingPI(false);
    setNum("");
  }

  return (
    <>
      <main className="flex flex-col h-screen justify-center items-center gap-y-5">
        <div className="flex items-center gap-x-2">
          <h1 className="text-4xl font-bold font-sans">&#x3C0; </h1>
          <sub className="text-xl font-sans">{"# "}{score}</sub>
        </div>
        <div className="flex  w-5/12 h-4/6 lg:w-1/5 lg:h-1/2 rounded-md flex-col gap-y-5">
          {/* DISPLAY */}
          <div className="flex border-2 border-zinc-900 w-full h-1/5  items-center justify-end rounded-xl">
            <div className="mr-2 font-serif font-semibold text-3xl scroll-mx-1 overflow-x-auto max-w-full">{num}</div>
          </div>
          {/* BUTTONS */}
          <div className="grid grid-cols-3 w-full h-full gap-2">
            {keyList.map((val, index) => {
              return (
                <motion.button
                  key={index}
                  className="font-mono font-semibold text-xl hover:border bg-transparent rounded-lg lg:text-2xl lg:font-medium"
                  onClick={() => index != keyList.length - 1 ? keyListenr({ val }) : start()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8, backgroundColor: "#4c1d95" }}
                  animate={err.key !== val ? (aniClickButton.key === val ? (aniClickButton.type == 0 ? "0" : "1") : "0") : "err"}
                  variants={varient}
                  transition={{ backgroundColor: { duration: 0.2 } }}
                  onAnimationComplete={async (defination) => {
                    setAniClickButton({ key: "", type: "0" })
                    if (Object.keys(defination)[0] !== "backgroundColor") return;
                    if (!isAnimatingPI) validate(val);
                    setcanUseButton(true);
                  }}
                >
                  {val}
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}