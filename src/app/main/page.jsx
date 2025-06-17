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
import domtoimage from "dom-to-image";

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

  // Flip camera
  const flipCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: newMode } })
      .then((newStream) => {
        if (videoRef.current) videoRef.current.srcObject = newStream;
        setStream(newStream);
      })
      .catch((err) => console.error("Camera flip error:", err));
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
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          alert("Unable to access camera. Please check permissions.");
        });
    }
  }, [step, stream, facingMode]);

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

    domtoimage
      .toPng(photoStripRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "PikTà.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
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
                  className="bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md transition duration-300 ease-in-out cursor-pointer"
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

                {/* Flip Camera Button */}
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
                        if (t === 0) setAutoCapture(false); // Reset auto if timer is none
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
              {/* Capture Button */}
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
            </div>

            {/* RIGHT PANEL - DISPLAY OUTPUT */}
            <div className="flex flex-col w-full items-start">
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
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border p-6 flex flex-col lg:flex-row gap-6 mb-10">
            {/* LEFT SIDE - CUSTOMIZATION CONTROLS */}
            <div className="flex flex-col w-full max-w-md gap-4">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">
                Customize Your Photos
              </h2>

              {/* Frame Style Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Frame Style
                </label>
                <div className="flex gap-4">
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Frame Color
                </label>

                {/* Preset Colors */}
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

                {/* Custom Color Button */}
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

              {/* Add Message Toggle */}
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

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 cursor-pointer"
                >
                  <DownloadIcon size={18} />
                  Download Photostrip
                </button>

                <button
                  onClick={() => {
                    setImages([]);
                    setStep(2);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 cursor-pointer"
                >
                  <RefreshCcwIcon size={18} />
                  Retake
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - FINAL PHOTO STRIP FRAME */}
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-2xl font-extrabold mb-4">
                <span className="text-emerald-600">Y</span>
                <span className="text-gray-800">our </span>
                <span className="text-emerald-600">P</span>
                <span className="text-gray-800">hoto </span>
                <span className="text-emerald-600">S</span>
                <span className="text-gray-800">trip</span>
              </h2>

              <div
                ref={photoStripRef}
                className={`relative overflow-hidden ${frameStyle}`}
                style={{
                  border: `8px solid ${frameColor}`,
                  backgroundColor: frameColor,
                  padding: "16px",
                  width: "fit-content",
                }}
              >
                {/* Top Text - PikTa */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-5 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-md">
                    <div
                      className="text-sm font-extrabold tracking-wide leading-none text-center"
                      style={{ color: "#10b981" }} // Optional overall color
                    >
                      <span style={{ color: "#10b981" }}>P</span>
                      <span style={{ color: "#1f2937" /* gray-800 */ }}>
                        ik
                      </span>
                      <span style={{ color: "#10b981" }}>T</span>
                      <span style={{ color: "#1f2937" }}>à</span>
                    </div>
                  </div>
                </div>

                {/* Image Grid */}
                <div
                  className="grid grid-cols-2 gap-2 justify-center items-center"
                  style={{
                    width: "300px",
                    margin: "auto",
                  }}
                >
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img.src}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto object-cover border border-white"
                      style={{
                        borderRadius: "0px",
                        maxHeight: "150px",
                      }}
                    />
                  ))}
                </div>

                {/* Bottom Text */}
                <div className="text-white text-center text-xs py-3 space-y-1">
                  {showMessage && <div>{customMessage}</div>}
                  {showDate && (
                    <div className="text-xs font-medium">
                      {new Date().toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
