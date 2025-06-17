"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Timer as TimerIcon,
  Wand2,
  Undo2,
  ToggleRight,
  ToggleLeft,
  Download as DownloadIcon,
  RefreshCcw as RefreshCcwIcon,
  Palette,
} from "lucide-react";

import "../globals.css";
//import domtoimage from "dom-to-image";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";

const Page = () => {
  // STEP 1: Onboarding and Setup
  const [step, setStep] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [pictureCount, setPictureCount] = useState(1);

  // STEP 2: Camera & Effects
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const [selectedEffect, setSelectedEffect] = useState("none");
  const [isAutoCapturing, setIsAutoCapturing] = useState(false); // NEW: tracks active loop

  const videoStyles = {
    none: "",
    grayscale: "filter grayscale",
    sepia: "filter sepia",
    invert: "filter invert",
  };

  // STEP 2: Timer & Countdown
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [autoCapture, setAutoCapture] = useState(false); // only enables loop when button pressed

  // STEP 3: Captured Photos & Overlays
  const [images, setImages] = useState([]);
  const [frameColor, setFrameColor] = useState("#000000");
  const [frameStyle, setFrameStyle] = useState("rounded-md");

  const [showMessage, setShowMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [showDate, setShowDate] = useState(false);

  const photoStripRef = useRef(null);

  const flipCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);

    try {
      // Stop current stream if any
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Try getting a new stream by facingMode
      const constraints = {
        video: {
          facingMode: { exact: newMode }, // try forcing mode
        },
        audio: false,
      };

      let newStream = null;

      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn("facingMode failed, falling back to deviceId...", err);

        // Fallback: manually find the camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const targetDevice = videoDevices.find((device) =>
          newMode === "environment"
            ? device.label.toLowerCase().includes("back")
            : device.label.toLowerCase().includes("front")
        );

        if (targetDevice) {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: targetDevice.deviceId,
            },
          });
        } else {
          throw new Error("Target camera not found");
        }
      }

      // Set the new stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      setStream(newStream);
    } catch (err) {
      console.error("Camera flip failed:", err);
    }
  };

  // Load camera on step 2
  useEffect(() => {
    if (step === 2 && !stream) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode } })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error("Failed to access camera:", err);
        });
    }
  }, [step, facingMode, stream]);

  // Countdown
  useEffect(() => {
    let interval;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      takePicture();
      setCountdown(null);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Reset loop if user unchecks auto
  useEffect(() => {
    if (!autoCapture) {
      setIsAutoCapturing(false);
    }
  }, [autoCapture]);

  // Start capture
  const startTimerCapture = () => {
    if (!stream || countdown > 0 || images.length >= pictureCount) return;

    // First click — initiate auto loop
    if (autoCapture && !isAutoCapturing) {
      setIsAutoCapturing(true);
    }

    // Manual or first auto trigger
    setCountdown(timer);
  };

  // Stop Camera on Step = 3
  useEffect(() => {
    if (step === 3 && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null); // Release the stream
    }
  }, [step, stream]);

  // Picture logic
  const takePicture = () => {
    if (!videoRef.current || images.length >= pictureCount) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    if (selectedEffect === "grayscale") ctx.filter = "grayscale(100%)";
    else if (selectedEffect === "sepia") ctx.filter = "sepia(100%)";
    else if (selectedEffect === "invert") ctx.filter = "invert(100%)";

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    const newImage = { src: imageDataUrl, effect: selectedEffect };

    setImages((prev) => {
      const updated = [...prev, newImage];
      if (updated.length === pictureCount) {
        setIsAutoCapturing(false); // Stop auto
        setStep(3);
      }
      return updated;
    });

    // Chain next auto if still capturing
    if (autoCapture && isAutoCapturing && images.length + 1 < pictureCount) {
      setTimeout(() => {
        setCountdown(timer);
      }, 1000); // slight delay before next countdown
    }
  };

  // Download handler
  const handleDownload = () => {
    if (!photoStripRef.current) return;

    const node = photoStripRef.current;
    const scale = 2;

    toPng(node, {
      cacheBust: true,
      width: node.offsetWidth * scale,
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${node.offsetWidth}px`,
        height: `${node.offsetHeight}px`,
      },
      filter: (node) => true,
    })
      .then((dataUrl) => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );

        if (isSafari) {
          // Create a new tab or force download fallback
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(
              `<img src="${dataUrl}" style="width:100%;" />`
            );
          } else {
            alert("Please allow pop-ups to download your photo or else use web Chrome");
          }
        } else {
          // For Chrome, Android, Edge, etc.
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "PikTà.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((err) => {
        console.error("Download failed:", err);
        alert("Failed to generate image. Please try again.");
      });
  };

  // Animations
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4">
      <motion.header
        className="py-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-extrabold tracking-widest">
          <span className="text-emerald-700">P</span>ik
          <span className="text-emerald-700">T</span>à
        </h1>
        <p className="text-sm mt-2 text-gray-600 tracking-widest">
          capture your moment
        </p>
      </motion.header>

      <main className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
        {step === 0 && (
          <motion.div
            className="w-full max-w-6xl mx-auto text-center space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Title */}
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-[5px] mt-[-17px]"
              variants={fadeLeft}
            >
              Before You Begin
            </motion.h2>

            {/* Scrollable Full Width Box */}
            <motion.div
              className="bg-white border border-gray-300 rounded-lg shadow p-6 max-h-[32rem] overflow-y-auto text-left space-y-5 text-sm text-gray-700 w-full"
              variants={fadeRight}
            >
              {/* About Piktà */}
              <div>
                <h3 className="text-lg font-bold text-emerald-700">
                  About Piktà
                </h3>
                <p>
                  <span className="font-semibold">Piktà</span> is a digital
                  photo booth web application designed and developed by{" "}
                  <span className="font-semibold">John Roel R. Flamiano</span>,
                  a BSIT student who passionately built this tool to bring
                  people together through fun and technology.
                </p>
                <p>
                  Inspired by his classmates’ constant request for a modern and
                  touchless photobooth experience during school events and group
                  activities, and the rise of short-form content on platforms
                  like TikTok, Roel envisioned a platform where users could take
                  multiple pictures, apply effects, customize frames, and
                  download a stylish photo strip — all without needing any
                  third-party installations.
                </p>
                <p>
                  One of the biggest motivations behind this project was his
                  girlfriend, who supported the idea of creating something
                  creative, functional, and easy to use — something that could
                  be used during birthdays, celebrations, or just moments worth
                  capturing.
                </p>
                <p>
                  Piktà is not just a tool — it's a project of passion. It’s
                  about preserving moments, sharing joy, and expressing
                  personality in every captured photo.
                </p>
              </div>

              {/* Privacy Policy */}
              <div>
                <h3 className="text-lg font-bold text-emerald-700">
                  Privacy Policy
                </h3>
                <p>
                  We take your privacy seriously. When using Piktà, your camera
                  feed stays entirely on your device. We do not upload, share,
                  store, or analyze your pictures.
                </p>
                <p>
                  Piktà does not collect biometric data or personal identifiers.
                  No cookies, tracking tools, or ads. Once your session ends,
                  your images and settings are lost unless you choose to
                  download them.
                </p>
                <p>
                  You upload content at your own discretion. Always ensure you
                  use the application in a private and secure environment.
                </p>
              </div>

              {/* Terms of Service */}
              <div>
                <h3 className="text-lg font-bold text-emerald-700">
                  Terms of Service
                </h3>
                <p>
                  By using Piktà, you agree to use it only for personal,
                  educational, or non-commercial purposes.
                </p>
                <p>
                  The app is provided as-is with no guarantee of availability.
                </p>
                <p>
                  John Roel R. Flamiano retains all rights to the source code
                  and design. Unauthorized copying, selling, or repackaging is
                  prohibited.
                </p>
                <p>
                  You acknowledge responsibility for the content you create and
                  download using Piktà.
                </p>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2 pt-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  className="mt-1 w-4 h-4 border-gray-300 rounded cursor-pointer"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                />
                <label htmlFor="privacyConsent" className="text-sm">
                  I have read and agree to the Privacy Policy and Terms of
                  Service, and understand that this is a locally run photobooth
                  app created by John Roel R. Flamiano.
                </label>
              </div>
            </motion.div>

            {/* Allow Camera Button */}
            <motion.div
              className="flex justify-center items-center"
              variants={fadeUp}
            >
              <button
                onClick={() => consentChecked && setStep(1)}
                disabled={!consentChecked}
                className={`border px-8 py-3 rounded-xl text-lg shadow-md flex items-center gap-2 transition duration-300 mb-10 ${
                  consentChecked
                    ? "border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white cursor-pointer"
                    : "border-gray-400 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Camera className="w-5 h-5" />
                Allow Camera Access
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            className="w-full max-w-xl mx-auto bg-emerald-50/30 border border-emerald-300 p-6 sm:p-8 rounded-3xl shadow-lg text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title and Description */}
            <div className="flex flex-col items-center space-y-2">
              <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 tracking-wide">
                Choose Number of Photos
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-md">
                Get ready for your photo shoot! Pick how many photos you’d like
                to take — we’ll handle the countdown and effects after.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[2, 4, 6, 8, 12].map((count) => (
                <motion.button
                  key={count}
                  onClick={() => {
                    setPictureCount(count);
                    setImages([]);
                    setStep(2);
                  }}
                  className="bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-lg font-semibold shadow-md transition duration-300 ease-in-out cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: count * 0.05 }}
                >
                  {count} {count === 1 ? "photo" : "photos"}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-7xl bg-white rounded-3xl shadow-lg border p-6 flex flex-col lg:flex-row gap-6 mb-10"
          >
            {/* LEFT PANEL - CAMERA + CONTROLS BELOW */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center w-full max-w-md space-y-4"
            >
              {/* STEP 1: Camera Preview */}
              <div className="relative w-full group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`rounded-xl border-4 w-full h-auto shadow transition-all duration-300 transform
            ${
              images.length >= pictureCount
                ? "border-green-500"
                : "border-gray-300"
            }
            ${videoStyles[selectedEffect]}
            ${facingMode === "user" ? "-scale-x-100" : ""}`}
                />
                <button
                  onClick={flipCamera}
                  className="absolute top-2 right-2 p-2 rounded-full shadow-md bg-white/80 hover:bg-white transition
            opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-events-auto"
                  title="Flip Camera"
                >
                  <Undo2 size={20} className="text-gray-800" />
                </button>
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

              {/* STEP 2: Timer Options */}
              <div className="w-full">
                <h3 className="text-md font-extrabold mb-2 flex items-center gap-2">
                  <TimerIcon size={18} /> Timer
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {[0, 3, 10, 12].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimer(t);
                        if (t === 0) setAutoCapture(false);
                      }}
                      className={`px-3 py-1 rounded-full border transition text-sm cursor-pointer ${
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

              {/* STEP 3: Auto Capture Toggle */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoCapture"
                  checked={autoCapture}
                  disabled={timer === 0}
                  onChange={(e) => setAutoCapture(e.target.checked)}
                  className="accent-emerald-700 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="autoCapture"
                  className={`text-sm ${
                    timer === 0 ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Auto Capture (enabled only if timer is selected)
                </label>
              </div>

              {/* STEP 4: Effects */}
              <div className="w-full">
                <h3 className="text-md font-extrabold mb-2 flex items-center gap-2">
                  <Wand2 size={18} /> Effects
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {["none", "grayscale", "sepia", "invert"].map((effect) => (
                    <button
                      key={effect}
                      onClick={() => setSelectedEffect(effect)}
                      className={`capitalize px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
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

              {/* STEP 5: Capture Button */}
              <button
                onClick={startTimerCapture}
                disabled={
                  !stream || images.length >= pictureCount || countdown > 0
                }
                className={`px-6 py-3 rounded-xl font-extrabold cursor-pointer shadow flex items-center gap-2 transition ${
                  !stream || images.length >= pictureCount || countdown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "border-1 border-emerald-700 hover:bg-emerald-700 hover:text-white transition duration-300 ease-in-out"
                }`}
              >
                <Camera size={18} />
                Capture PikTà
              </button>

              {/* Auto Capturing Status */}
              {autoCapture && (
                <p className="text-xs text-emerald-600 font-bold mt-2 animate-pulse">
                  Auto capturing...
                </p>
              )}

              {/* STEP 6: Counter */}
              <p className="text-sm text-gray-500">
                {images.length} / {pictureCount} photo
                {pictureCount > 1 ? "s" : ""}
              </p>
            </motion.div>

            {/* RIGHT PANEL - DISPLAY OUTPUT */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col w-full items-start"
            >
              <h2 className="text-1xl font-extrabold mb-4 text-gray-800 flex items-center gap-2">
                <Camera size={25} className="text-emerald-700" />
                <span>
                  <span className="text-emerald-700">C</span>aptured{" "}
                  <span className="text-emerald-700">P</span>hotos
                </span>
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
            </motion.div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border p-4 sm:p-6 flex flex-col lg:flex-row gap-6 mb-10"
          >
            {/* LEFT SIDE - CUSTOMIZATION CONTROLS */}
            <div className="flex flex-col w-full lg:max-w-md gap-4">
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 text-center">
                <span className="text-emerald-600">C</span>us
                <span className="text-emerald-600">T</span>omiza
                <span className="text-emerald-600">T</span>ion
              </h2>

              {/* Frame Style Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Frame Style
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Classic", value: "rounded-md" },
                    { label: "Round", value: "rounded-3xl" },
                  ].map((style) => {
                    const isSelected = frameStyle === style.value;
                    return (
                      <div
                        key={style.value}
                        onClick={() => setFrameStyle(style.value)}
                        className={`cursor-pointer transition-all border-4 flex flex-col items-center justify-center w-24 h-24 p-2 ${
                          isSelected
                            ? "border-emerald-600 shadow-lg"
                            : "border-gray-300 hover:border-emerald-400"
                        }`}
                      >
                        <div
                          className={`w-full h-16 bg-gray-200 ${style.value}`}
                        ></div>
                        <span className="mt-2 text-sm font-medium text-gray-700">
                          {style.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Frame Color Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Frame Color
                </label>

                <div className="flex gap-2 flex-wrap items-center mb-3">
                  {["#000000", "#ffffff", "#10b981", "#ef4444", "#3b82f6"].map(
                    (color) => (
                      <button
                        key={color}
                        style={{ backgroundColor: color }}
                        onClick={() => setFrameColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 cursor-pointer ${
                          frameColor === color
                            ? "border-black scale-110"
                            : "border-white"
                        }`}
                      />
                    )
                  )}
                </div>

                <div className="flex">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer shadow-sm hover:bg-gray-100 transition">
                    <Palette size={18} className="text-gray-700" />
                    <span className="text-sm text-gray-800 font-medium">
                      Custom Color
                    </span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-400"
                      style={{ backgroundColor: frameColor }}
                    ></div>
                    <input
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Message Toggle */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  Add Message
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMessage}
                    onChange={(e) => setShowMessage(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 transition-all"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
              {showMessage && (
                <input
                  type="text"
                  placeholder="Enter your message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                />
              )}

              {/* Show Date Toggle */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  Show Date
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 transition-all"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 font-bold">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white rounded-2xl text-sm sm:text-lg font-semibold shadow-md transition duration-300 ease-in-out cursor-pointer"
                >
                  <DownloadIcon size={18} />
                  Download
                </button>

                <button
                  onClick={() => {
                    setImages([]);
                    setStep(2);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-600 text-gray-800 hover:bg-gray-700 hover:text-white rounded-2xl text-sm sm:text-lg font-semibold shadow-md transition duration-300 ease-in-out cursor-pointer"
                >
                  <RefreshCcwIcon size={18} />
                  Retake
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - FINAL PHOTO STRIP FRAME */}
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-2xl font-extrabold mb-4 text-center">
                <span className="text-emerald-600">Y</span>
                <span className="text-gray-800">our </span>
                <span className="text-emerald-600">P</span>
                <span className="text-gray-800">hoto </span>
                <span className="text-emerald-600">S</span>
                <span className="text-gray-800">trip</span>
              </h2>

              <div
                ref={photoStripRef}
                style={{
                  border: `8px solid ${frameColor}`,
                  backgroundColor: frameColor,
                  padding: 16,
                  width: "fit-content",
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontFamily: "'Poppins', sans-serif",
                }}
                className={frameStyle}
              >
                {/* PikTa Label */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 64,
                    height: 20,
                    backgroundColor: "white",
                    borderRadius: 9999,
                    border: "4px solid white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 12,
                      color: "#10b981",
                    }}
                  >
                    <span style={{ color: "#10b981" }}>P</span>
                    <span style={{ color: "#1f2937" }}>ik</span>
                    <span style={{ color: "#10b981" }}>T</span>
                    <span style={{ color: "#1f2937" }}>à</span>
                  </div>
                </div>

                {/* Image Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    maxWidth: 300,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: frameStyle.includes("rounded")
                      ? "0px"
                      : "0px",
                    overflow: "hidden",
                  }}
                >
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img.src}
                      alt={`Photo ${index + 1}`}
                      crossOrigin="anonymous"
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        objectFit: "cover",
                        border: "2px solid white",
                        borderRadius: "0px",
                      }}
                    />
                  ))}
                </div>

                {/* Message and Date */}
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 8,
                    paddingTop: 12,
                    fontFamily: "'Poppins', sans-serif",
                    minHeight: 30,
                  }}
                >
                  {showMessage && <div>{customMessage}</div>}
                  {showDate && <div>{new Date().toLocaleDateString()}</div>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Page;
