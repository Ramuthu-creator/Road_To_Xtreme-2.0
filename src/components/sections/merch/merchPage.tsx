"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Maximize2, ScanLine, X } from "lucide-react";
import "./Merch.css";

const SHIRT_IMAGE = "/assets/images/merch/merch.jpeg";

const STICKERS = [
  {
    id: "sticker-1",
    name: "Cyber Visor",
    edition: "EDITION 01",
    src: "/assets/images/stickers/Sticker01.png",
    alt: "Road to Xtreme 20.0 Cyber Visor Laptop Sticker",
  },
  {
    id: "sticker-2",
    name: "Mecha Bot",
    edition: "EDITION 02",
    src: "/assets/images/stickers/Sticker02.png",
    alt: "Road to Xtreme 20.0 Mecha Bot Laptop Sticker",
  },
] as const;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
type Size = (typeof SIZES)[number];

// Garment measurements. Chest measured flat (half-width).
const SIZE_CHART = [
  { size: "XS", chest: 18, length: 24.5 },
  { size: "S", chest: 19, length: 25.5 },
  { size: "M", chest: 20, length: 26.5 },
  { size: "L", chest: 21, length: 27.5 },
  { size: "XL", chest: 22, length: 28.5 },
  { size: "XXL", chest: 23, length: 29.5 },
  { size: "XXXL", chest: 24, length: 30.5 },
] satisfies {
  size: Size;
  chest: number;
  length: number;
}[];

type MerchPageProps = {
  price?: number;
  preorderClosesAt?: string;
  googleFormUrl?: string;
};

const currency = (value: number) =>
  `LKR ${value.toLocaleString("en-US")}`;

// Cache the processed image when navigating away and back.
let processedShirtCache: string | null = null;

/**
 * Removes near-white pixels connected to the outer image boundary.
 * Enclosed white details, such as the shirt prints, are not selected.
 * The original image file remains unchanged.
 */
function createTransparentShirt(image: HTMLImageElement): string {
  const canvas = document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is unavailable.");
  }

  context.drawImage(image, 0, 0);

  const { width, height } = canvas;
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;

  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);

  let head = 0;
  let tail = 0;

  const enqueue = (position: number) => {
    if (visited[position]) return;

    visited[position] = 1;

    const offset = position * 4;
    const red = pixels[offset];
    const green = pixels[offset + 1];
    const blue = pixels[offset + 2];

    const lightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);

    if (darkest >= 235 && lightest - darkest <= 20) {
      queue[tail++] = position;
    }
  };

  // Start at every outer edge of the original image.
  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }

  for (let y = 0; y < height; y++) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const position = queue[head++];
    const x = position % width;
    const y = Math.floor(position / width);

    pixels[position * 4 + 3] = 0;

    if (x > 0) enqueue(position - 1);
    if (x < width - 1) enqueue(position + 1);
    if (y > 0) enqueue(position - width);
    if (y < height - 1) enqueue(position + width);
  }

  context.putImageData(frame, 0, 0);

  return canvas.toDataURL("image/png");
}

export default function MerchPage({
  price = 1800,
  preorderClosesAt = "2026-10-16T23:59:59+05:30",
  googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScotabcvcrfotx6qL9vsp_CPV3duoVTKccLQhq62ag0LlsZbw/viewform?usp=publish-editor",
}: MerchPageProps) {
  const showcaseRef = useRef<HTMLElement>(null);

  const [panelHeight, setPanelHeight] = useState(640);

  const [view, setView] = useState<"front" | "back">("front");
  const [lightboxSticker, setLightboxSticker] = useState<(typeof STICKERS)[number] | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [backgroundWarning, setBackgroundWarning] = useState(false);

  const [selected, setSelected] = useState<Size | null>(null);
  const [tab, setTab] = useState<"guide" | "finder">("guide");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [chest, setChest] = useState(38);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Process the original image once, before displaying it.
  useEffect(() => {
    let cancelled = false;

    if (processedShirtCache) {
      setImageSrc(processedShirtCache);
      return;
    }

    const source = new window.Image();
    source.decoding = "async";

    source.onload = () => {
      if (cancelled) return;

      try {
        const result = createTransparentShirt(source);
        processedShirtCache = result;
        setImageSrc(result);
      } catch (error) {
        console.error("Could not process the shirt background:", error);

        // Keep the product visible if image processing is unavailable.
        setBackgroundWarning(true);
        setImageSrc(SHIRT_IMAGE);
      }
    };

    source.onerror = () => {
      if (!cancelled) setImageError(true);
    };

    source.src = SHIRT_IMAGE;

    return () => {
      cancelled = true;
      source.onload = null;
      source.onerror = null;
    };
  }, []);

  // Match the desktop scroll panel to the image column.
  useEffect(() => {
    const element = showcaseRef.current;
    if (!element) return;

    const update = () => {
      setPanelHeight(
        Math.ceil(element.getBoundingClientRect().height),
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const deadline = preorderClosesAt
      ? Date.parse(preorderClosesAt)
      : NaN;

    if (!Number.isFinite(deadline)) {
      setRemaining(null);
      return;
    }

    const update = () => {
      setRemaining(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
      );
    };

    update();

    const timer = window.setInterval(update, 1000);

    return () => window.clearInterval(timer);
  }, [preorderClosesAt]);

  const suggested =
    SIZE_CHART.find((item) => item.chest * 2 >= chest + 2) ??
    (chest <= SIZE_CHART[SIZE_CHART.length - 1].chest * 2
      ? SIZE_CHART[SIZE_CHART.length - 1]
      : undefined);

  const clock =
    remaining === null
      ? null
      : [
          Math.floor(remaining / 86400),
          Math.floor(remaining / 3600) % 24,
          Math.floor(remaining / 60) % 60,
          remaining % 60,
        ];

  const expired = remaining === 0;

  const measurement = (value: number) =>
    unit === "cm" ? (value * 2.54).toFixed(1) : `${value}″`;

  return (
    <div
      id="xtreme-merch"
      style={
        {
          "--xm-panel-height": `${panelHeight}px`,
        } as CSSProperties
      }
    >
      <main className="xm-main">
        <div className="xm-topline">
          <Link href="/" className="xm-home-btn" aria-label="Back to Home">
            <ArrowLeft className="xm-home-arrow" aria-hidden="true" />
            <span>BACK TO HOME</span>
          </Link>

          <span>
            <b className="xm-dot" aria-hidden="true" />
            MERCH // 2.0
          </span>
        </div>

        <div className="xm-grid">
          <section
            ref={showcaseRef}
            className="xm-showcase"
            aria-label="Shirt images"
          >
            <div
              className={`xm-stage ${
                view === "back" ? "is-back" : ""
              } ${zoomed ? "zoomed" : ""} ${
                imageReady ? "is-ready" : ""
              }`}
              aria-busy={!imageReady && !imageError}
            >
              <div className="xm-shirt-wrap">
                {imageSrc && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    className="xm-shirt"
                    src={imageSrc}
                    alt={
                      view === "front"
                        ? "Front of the original Road to Xtreme polo"
                        : "Back of the original Road to Xtreme polo"
                    }
                    width={2048}
                    height={1152}
                    draggable={false}
                    onLoad={() => setImageReady(true)}
                    onError={() => {
                      setImageReady(false);
                      setImageError(true);
                    }}
                  />
                )}
              </div>

              {!imageReady && (
                <div className="xm-image-status" role="status">
                  {!imageError && (
                    <span
                      className="xm-image-loader"
                      aria-hidden="true"
                    />
                  )}

                  <span>
                    {imageError
                      ? "Unable to load the shirt image."
                      : "LOADING PRODUCT"}
                  </span>
                </div>
              )}

              <span className="xm-view">
                {`${view.toUpperCase()} VIEW`}
              </span>

              <button
                type="button"
                className="xm-zoom"
                aria-pressed={zoomed}
                disabled={!imageReady}
                onClick={() => setZoomed((previous) => !previous)}
              >
                <Maximize2 aria-hidden="true" />
                {zoomed ? "Full view" : "View detail"}
              </button>
            </div>

            <div
              className="xm-view-controls"
              role="group"
              aria-label="Product view"
            >
              {(
                [
                  { id: "front", label: "FRONT" },
                  { id: "back", label: "BACK" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={view === tab.id}
                  onClick={() => {
                    setView(tab.id);
                    setZoomed(false);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="xm-product-note">
              <span>BLACK / BLUE TRIM</span>
              <span>POLO + LAPTOP STICKER PACK</span>
            </div>

            {backgroundWarning && (
              <p className="xm-note" role="status">
                Showing the original image. Background removal
                was unavailable.
              </p>
            )}
          </section>

          <section
            className="xm-details"
            aria-label="Choose your polo"
            tabIndex={0}
          >
            <div className="xm-status">
              <b className="xm-dot" aria-hidden="true" />
              ROAD TO XTREME
              <span>// 2.0</span>
            </div>

            <h1>
              Go beyond.
              <br />
              <em>Wear Xtreme.</em>
            </h1>

            <h2>Road to Xtreme Merch Pack</h2>

            <p className="xm-description">
              CINEC Campus Student Branch exclusive edition.
            </p>

            <div className="xm-price">
              <strong>{currency(price)}</strong>
              <span>PER PACK</span>
            </div>

            <div className="xm-timer">
              <p className="xm-timer-label">
                {expired
                  ? "PRE-ORDER WINDOW CLOSED"
                  : "PRE-ORDER CLOSES IN"}
              </p>

              <div
                className="xm-clock"
                aria-label={
                  clock
                    ? "Pre-order countdown"
                    : "Deadline not announced"
                }
              >
                {["DAYS", "HOURS", "MIN", "SEC"].map(
                  (label, index) => (
                    <div key={label}>
                      <b>
                        {clock
                          ? String(clock[index]).padStart(2, "0")
                          : "--"}
                      </b>
                      <span>{label}</span>
                    </div>
                  ),
                )}
              </div>

              {!clock && (
                <p className="xm-note">
                  Pre-order deadline to be announced.
                </p>
              )}
            </div>

            <div className="xm-pack-inclusions">
              <div className="xm-pack-item">
                <span className="xm-pack-icon" aria-hidden="true">👕</span>
                <div>
                  <strong>Road to Xtreme Polo</strong>
                  <small>Black / Blue trim · Unisex fit</small>
                </div>
              </div>

              <div className="xm-pack-item">
                <span className="xm-pack-icon" aria-hidden="true">✨</span>
                <div>
                  <div className="xm-pack-item-head">
                    <strong>1× Laptop Sticker</strong>
                    <span className="xm-badge-random">1 OF 2 RANDOM</span>
                  </div>
                  <small>Exclusive die-cut vinyl sticker</small>
                </div>
              </div>
            </div>

            <div className="xm-stickers-section">
              <div className="xm-stickers-section-head">
                <div>
                  <span className="xm-stickers-tag">INCLUDED LAPTOP STICKER</span>
                  <span className="xm-stickers-sub">1 OF 2 COLLECTIBLE DESIGNS</span>
                </div>
                <span className="xm-stickers-random-pill">1 PACKED AT RANDOM</span>
              </div>

              <div className="xm-stickers-grid">
                {STICKERS.map((sticker) => (
                  <div
                    key={sticker.id}
                    className={`xm-sticker-card ${sticker.id}`}
                    onClick={() => setLightboxSticker(sticker)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxSticker(sticker);
                      }
                    }}
                    title={`Click to preview ${sticker.name} in full size`}
                  >
                    <div className="xm-sticker-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sticker.src}
                        alt={sticker.alt}
                        className={`xm-sticker-img xm-img-${sticker.id}`}
                      />
                      <span className="xm-sticker-zoom-hint" aria-hidden="true">
                        <Maximize2 />
                      </span>
                    </div>
                    <div className="xm-sticker-info">
                      <span className="xm-sticker-badge">{sticker.edition}</span>
                      <strong className="xm-sticker-name">{sticker.name}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="xm-stickers-note-banner">
                <span aria-hidden="true">🎲</span>
                <span>
                  1 of these 2 sticker designs is packed at random with every Polo!
                </span>
              </div>
            </div>


            <div className="xm-fit">
              <div
                className="xm-tabs"
                role="group"
                aria-label="Sizing tools"
              >
                <button
                  type="button"
                  aria-pressed={tab === "guide"}
                  aria-controls="xm-guide-panel"
                  onClick={() => setTab("guide")}
                >
                  Size guide
                </button>

                <button
                  type="button"
                  aria-pressed={tab === "finder"}
                  aria-controls="xm-finder-panel"
                  onClick={() => setTab("finder")}
                >
                  <ScanLine aria-hidden="true" />
                  Find my size
                </button>
              </div>

              <div
                id="xm-guide-panel"
                className="xm-guide"
                hidden={tab !== "guide"}
              >
                <div className="xm-units">
                  <span>GARMENT MEASUREMENTS · FLAT</span>

                  <button
                    type="button"
                    className="xm-unit"
                    onClick={() =>
                      setUnit((previous) =>
                        previous === "in" ? "cm" : "in",
                      )
                    }
                    aria-label={`Change measurements to ${
                      unit === "in" ? "centimetres" : "inches"
                    }`}
                  >
                    {unit === "in" ? "IN → CM" : "CM → IN"}
                  </button>
                </div>

                <table>
                  <caption className="xm-sr-only">
                    Garment measurements in{" "}
                    {unit === "in" ? "inches" : "centimetres"}.
                    Chest is measured flat from armpit to armpit.
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      <th scope="col">Chest</th>
                      <th scope="col">Length</th>
                    </tr>
                  </thead>

                  <tbody>
                    {SIZE_CHART.map((item) => (
                      <tr
                        key={item.size}
                        className={
                          selected === item.size
                            ? "chosen"
                            : undefined
                        }
                        onClick={() =>
                          setSelected((previous) =>
                            previous === item.size ? null : item.size,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <th scope="row">{item.size}</th>
                        <td>{measurement(item.chest)}</td>
                        <td>{measurement(item.length)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="xm-note">
                  Chest is measured flat from armpit to armpit.
                </p>
              </div>

              <div
                id="xm-finder-panel"
                className="xm-finder"
                hidden={tab !== "finder"}
              >
                <label htmlFor="xm-chest">
                  Your chest measurement
                  <output htmlFor="xm-chest">{chest} in</output>
                </label>

                <input
                  id="xm-chest"
                  type="range"
                  min={32}
                  max={48}
                  step={1}
                  value={chest}
                  onChange={(event) =>
                    setChest(Number(event.target.value))
                  }
                />

                <div className="xm-range-label">
                  <span>32 IN</span>
                  <span>48 IN</span>
                </div>

                <div className="xm-result" aria-live="polite">
                  <span>
                    SUGGESTED FIT
                    <strong>{suggested?.size ?? "No match"}</strong>
                  </span>

                  <button
                    type="button"
                    className="xm-use"
                    disabled={!suggested}
                    onClick={() => {
                      if (suggested) {
                        setSelected(suggested.size);
                        setTab("guide");
                      }
                    }}
                  >
                    View in chart ↗
                  </button>
                </div>

                <p className="xm-note">
                  {suggested
                    ? "Estimate based on approx. 2 inches of ease for a comfortable fit."
                    : "This chart does not cover your measurement. Contact us for custom sizing."}
                </p>
              </div>
            </div>

            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`xm-order ${expired ? "is-disabled" : ""}`}
              aria-disabled={expired}
              onClick={(event) => {
                if (expired) {
                  event.preventDefault();
                } else if (!googleFormUrl || googleFormUrl === "#") {
                  event.preventDefault();
                  alert("Google Form link will be updated shortly.");
                }
              }}
            >
              <span>
                {expired ? "PRE-ORDERS CLOSED" : "PRE-ORDER NOW"}
              </span>

              <span className="xm-total">
                {currency(price)}
              </span>

              <ArrowUpRight aria-hidden="true" />
            </a>

            <p className="xm-order-note">
              {expired
                ? "Pre-orders closed on October 16th at 12:00 AM."
                : "Secure your pack via the official pre-order form."}
            </p>
          </section>
        </div>
      </main>

      {lightboxSticker && (
        <div
          className="xm-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${lightboxSticker.name}`}
          onClick={() => setLightboxSticker(null)}
        >
          <div
            className="xm-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="xm-lightbox-close"
              onClick={() => setLightboxSticker(null)}
              aria-label="Close preview"
            >
              <X aria-hidden="true" />
            </button>

            <div className="xm-lightbox-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxSticker.src}
                alt={lightboxSticker.alt}
                className={`xm-lightbox-img xm-img-${lightboxSticker.id}`}
              />
            </div>

            <div className="xm-lightbox-meta">
              <span className="xm-lightbox-badge">{lightboxSticker.edition}</span>
              <h3 className="xm-lightbox-title">{lightboxSticker.name}</h3>
              <p className="xm-lightbox-note">
                🎲 1 of 2 collectible die-cut vinyl stickers packed at random with every Road to Xtreme Polo!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}