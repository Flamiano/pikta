"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Timer as TimerIcon, Wand2, Undo2 } from "lucide-react";
import "../globals.css";

const Page = () => {
  const [step, setStep] = useState(0);
  const [pictureCount, setPictureCount] = useState(1);
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(null);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);

  const videoRef = useRef(null);

  const [selectedEffect, setSelectedEffect] = useState("none");
  const videoStyles = {
    none: "",
    grayscale: "filter grayscale",
    sepia: "filter sepia",
    invert: "filter invert",
  };

  const [facingMode, setFacingMode] = useState("user"); // "user" or "environment"

  const flipCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Restart stream
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: newFacingMode },
        audio: false,
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error flipping camera:", err);
      });
  };

  useEffect(() => {
    if (step === 2 && !stream) {
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

    // Flip horizontally to fix mirrored image
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");

    setImages((prev) => {
      const newImages = [
        ...prev,
        { src: imageDataUrl, effect: selectedEffect },
      ];
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
          <div className="max-w-2xl text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Before You Begin
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                By using <span className="font-semibold">Piktà</span>, you agree
                to allow temporary access to your device's camera to capture
                photo booth-style pictures. Your images will be processed and
                displayed directly within this application and will not be
                transmitted to external servers unless explicitly saved or
                shared by you.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                We respect your privacy. No biometric data or personal
                information is collected. All captured content remains on your
                device unless you choose to export it. For more details, please
                read our full{" "}
                <span className="underline cursor-pointer text-emerald-700 hover:text-emerald-900">
                  Privacy Policy
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer text-emerald-700 hover:text-emerald-900">
                  Terms of Service
                </span>
                .
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                By checking the box below and clicking "Allow Camera Access",
                you acknowledge that you have read and agree to our legal terms,
                and consent to the use of your camera for photo capture
                purposes.
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-center gap-3">
              <input
                type="checkbox"
                id="privacyConsent"
                className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
              />
              <label htmlFor="privacyConsent" className="text-sm text-gray-700">
                I agree to the Privacy and Legal Terms.
              </label>
            </div>

            {/* Allow Camera Access Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => consentChecked && setStep(1)}
                disabled={!consentChecked}
                className={`border px-8 py-3 rounded-xl text-lg shadow-md flex items-center gap-2 cursor-pointer transition mb-10 lg:mb-0 ${
                  consentChecked
                    ? "border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white"
                    : "border-gray-400 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Camera className="w-5 h-5" />
                Allow Camera Access
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="w-full max-w-xl bg-emerald-50/30 border border-emerald-300 p-8 rounded-3xl shadow-lg text-center space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Camera className="w-12 h-12 text-emerald-700 animate-pulse" />
              <h2 className="text-3xl font-bold text-emerald-900 tracking-wide">
                Choose Number of Photos
              </h2>
              <p className="text-sm text-gray-600 max-w-md">
                Get ready for your photo shoot! Pick how many photos you’d like
                to take — we’ll handle the countdown and effects after.
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {[2, 4, 6, 8, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setPictureCount(count);
                    setImages([]);
                    setStep(2); // go to camera step
                  }}
                  className="bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md transition duration-300 ease-in-out"
                >
                  {count} {count === 1 ? "photo" : "photos"}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg border p-6 flex flex-col lg:flex-row gap-6 mb-10">
            {/* LEFT PANEL - CAMERA + CONTROLS BELOW */}
            <div className="flex flex-col items-center w-full max-w-md space-y-4">
              {/* Camera Preview */}
              <div className="relative w-full group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`rounded-xl border-4 w-full h-auto shadow transition-all duration-300 transform ${
                    images.length >= pictureCount
                      ? "border-green-500"
                      : "border-gray-300"
                  } ${videoStyles[selectedEffect]} -scale-x-100`}
                />

                {/* Flip Camera Button */}
                <button
                  onClick={flipCamera}
                  className="absolute top-2 right-2 p-2 rounded-full shadow-md transition bg-white/80 hover:bg-white
               opacity-100 md:opacity-0 md:group-hover:opacity-100
               pointer-events-auto"
                  title="Flip Camera"
                >
                  <Undo2 size={20} className="text-gray-800" />
                </button>

                {/* Centered Countdown */}
                {countdown > 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      fontSize: "5rem",
                      fontWeight: "bold",
                      color: "white",
                      animation:
                        countdown <= 3
                          ? "blink 1s steps(1, start) infinite"
                          : undefined,
                    }}
                  >
                    {countdown}
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <TimerIcon size={18} /> Timer
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {[0, 3, 10, 12].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimer(t)}
                      className={`px-3 py-1 rounded-full border transition text-sm ${
                        timer === t
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-gray-800 border-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      {t === 0 ? "No Timer" : `${t}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Wand2 size={18} /> Effects
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {["none", "grayscale", "sepia", "invert"].map((effect) => (
                    <button
                      key={effect}
                      onClick={() => setSelectedEffect(effect)}
                      className={`capitalize px-3 py-1 rounded-full border text-sm transition ${
                        selectedEffect === effect
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-gray-800 border-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capture Button */}
              <button
                onClick={startTimerCapture}
                disabled={
                  !stream || images.length >= pictureCount || countdown > 0
                }
                className={`px-6 py-3 rounded-xl text-white font-semibold shadow flex items-center gap-2 transition ${
                  !stream || images.length >= pictureCount || countdown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <Camera size={18} />
                {countdown > 0 ? `Capturing in ${countdown}s...` : "Capture"}
              </button>

              {/* Counter */}
              <p className="text-sm text-gray-500">
                {images.length} / {pictureCount} photo
                {pictureCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* RIGHT PANEL - DISPLAY OUTPUT */}
            <div className="flex flex-col w-full items-start">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Camera size={24} />
                Captured Photos
              </h2>
              <div className="w-full">
                {images.length === 1 ? (
                  <div className="flex flex-col gap-2">
                    <img
                      src={images[0].src}
                      alt="Captured"
                      className="rounded-lg border shadow w-full"
                    />
                    <p className="text-sm text-gray-600 italic">
                      Effect: {images[0].effect}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <img
                          src={img.src}
                          alt={`Capture ${idx + 1}`}
                          className="rounded border shadow w-full"
                        />
                        <p className="text-xs text-gray-600 italic text-center">
                          Effect: {img.effect}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
