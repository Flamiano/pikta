"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Users, User, Timer } from "lucide-react";

const Page = () => {
  const [step, setStep] = useState(0);
  const [boxType, setBoxType] = useState("solo");
  const [pictureCount, setPictureCount] = useState(1);
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(null);
  const [timerVisible, setTimerVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (step === 3 && !stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          alert("Unable to access camera. Please check permissions.");
        });
    }
  }, [step, stream]);

  useEffect(() => {
    let countdownInterval;
    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      takePicture();
      setCountdown(null);
    }
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  const takePicture = () => {
    if (!videoRef.current || images.length >= pictureCount) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");

    setImages((prev) => {
      const newImages = [...prev, imageData];
      if (newImages.length < pictureCount && timer > 0) {
        setTimeout(() => setCountdown(timer), 1000);
      }
      return newImages;
    });
  };

  const startTimerCapture = () => {
    if (timer > 0) {
      setCountdown(timer);
    } else {
      takePicture();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4">
      <header className="py-6 text-center">
        <h1 className="text-6xl font-extrabold tracking-widest">
          <span className="text-emerald-700">P</span>ik
          <span className="text-emerald-700">T</span>à
        </h1>
        <p className="text-sm mt-2 text-gray-600 tracking-widest">
          capture your moment
        </p>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
        {step === 0 && (
          <button
            onClick={() => setStep(1)}
            className="border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white px-8 py-3 rounded-xl text-lg shadow-md flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Allow Camera Access
          </button>
        )}

        {step === 1 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-extrabold tracking-wide">
              Choose Mode
            </h2>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => {
                  setBoxType("solo");
                  setStep(2);
                }}
                className="border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white px-8 py-3 rounded-xl text-lg shadow-md"
              >
                <User className="w-5 h-5 inline-block mr-1" /> Solo
              </button>
              <button
                onClick={() => {
                  setBoxType("multiple");
                  setStep(2);
                }}
                className="border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white px-8 py-3 rounded-xl text-lg shadow-md"
              >
                <Users className="w-5 h-5 inline-block mr-1" /> Multiple
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">
              {boxType === "solo"
                ? "How many photos? (Solo)"
                : "How many group photos?"}
            </h2>
            <div className="flex gap-4 justify-center">
              {(boxType === "solo" ? [1, 2, 4] : [4, 6, 8]).map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setPictureCount(count);
                    setImages([]);
                    setStep(3);
                  }}
                  className="border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white px-6 py-3 rounded-xl text-lg shadow-md"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
            <div
              className="relative flex flex-col items-center w-full max-w-md group"
              onMouseEnter={() => setTimerVisible(true)}
              onMouseLeave={() => setTimerVisible(false)}
            >
              {/* Camera Preview */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`rounded-xl border-4 w-full h-auto shadow transition-all duration-300 ${
                  images.length >= pictureCount
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />

              {/* Timer Selection on Hover */}
              {timerVisible && images.length < pictureCount && (
                <div className="absolute top-2 left-2 bg-white border rounded-lg p-1 shadow flex gap-1 z-10">
                  {[0, 3, 10, 12].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimer(t)}
                      className={`text-xs px-2 py-1 rounded hover:bg-emerald-600 hover:text-white ${
                        timer === t
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      {t === 0 ? "No Timer" : `${t}s`}
                    </button>
                  ))}
                </div>
              )}

              {/* Capture Button */}
              <button
                onClick={startTimerCapture}
                disabled={!stream || images.length >= pictureCount}
                className={`mt-4 px-6 py-3 rounded-xl text-white font-semibold shadow transition ${
                  images.length >= pictureCount
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {countdown ? `Capturing in ${countdown}s...` : "Capture"}
              </button>

              {/* Count Status */}
              <p className="mt-2 text-sm text-gray-500">
                {images.length} / {pictureCount} photo
                {pictureCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* Captured Photo(s) Display */}
            <div className="w-full max-w-md mb-10 lg:mb-0">
              {images.length === 1 ? (
                <img
                  src={images[0]}
                  alt="Captured"
                  className="rounded-lg border shadow w-full"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Capture ${idx + 1}`}
                      className="rounded border shadow w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
