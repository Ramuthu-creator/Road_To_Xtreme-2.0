"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowUpRight, Maximize2, ScanLine } from "lucide-react";
import "./Merch.css";

const SHIRT_IMAGE = "/assets/images/merch/merch.jpeg";

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"] as const;
type Size = (typeof SIZES)[number];

// Sample measurements. Replace with the supplier's final chart.
const SIZE_CHART = [
  { size: "S", chest: 38, length: 27, shoulder: 16.5 },
  { size: "M", chest: 40, length: 28, shoulder: 17.5 },
  { size: "L", chest: 42, length: 29, shoulder: 18.5 },
  { size: "XL", chest: 44, length: 30, shoulder: 19.5 },
  { size: "XXL", chest: 46, length: 31, shoulder: 20.5 },
  { size: "3XL", chest: 48, length: 32, shoulder: 21.5 },
] satisfies {
  size: Size;
  chest: number;
  length: number;
  shoulder: number;
}[];

type MerchPageProps = {
  price?: number;
  preorderClosesAt?: string;
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
  price = 2500,
  preorderClosesAt,
}: MerchPageProps) {
  const showcaseRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reviewButtonRef = useRef<HTMLButtonElement>(null);

  const [panelHeight, setPanelHeight] = useState(640);

  const [view, setView] = useState<"front" | "back">("front");
  const [zoomed, setZoomed] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [backgroundWarning, setBackgroundWarning] = useState(false);

  const [selected, setSelected] = useState<Size>("M");
  const [tab, setTab] = useState<"guide" | "finder">("guide");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [chest, setChest] = useState(38);
  const [quantity, setQuantity] = useState(1);
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

  const suggested = SIZE_CHART.find(
    (item) => item.chest >= chest + 2,
  );

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
          <span>THE XTREME COLLECTION</span>

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
                {view.toUpperCase()} VIEW
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
              aria-label="Shirt view"
            >
              {(["front", "back"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  aria-pressed={view === side}
                  onClick={() => {
                    setView(side);
                    setZoomed(false);
                  }}
                >
                  {side.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="xm-product-note">
              <span>BLACK / BLUE TRIM</span>
              <span>UNISEX FIT</span>
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

            <h2>Road to Xtreme Polo</h2>

            <p className="xm-description">
              CINEC Campus Student Branch exclusive edition.
            </p>

            <div className="xm-price">
              <strong>{currency(price)}</strong>
              <span>PER SHIRT</span>
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

            <div className="xm-fieldhead">
              <span>01 / SELECT SIZE</span>
              <span className="xm-selected">
                {selected} SELECTED
              </span>
            </div>

            <div
              className="xm-sizes"
              role="group"
              aria-label="Shirt size"
            >
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selected === size}
                  onClick={() => setSelected(size)}
                >
                  {size}
                </button>
              ))}
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
                  <span>GARMENT MEASUREMENTS · SAMPLE</span>

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
                    Sample garment measurements in{" "}
                    {unit === "in" ? "inches" : "centimetres"}.
                    Chest is full circumference.
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      <th scope="col">Chest</th>
                      <th scope="col">Length</th>
                      <th scope="col">Shoulder</th>
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
                      >
                        <th scope="row">{item.size}</th>
                        <td>{measurement(item.chest)}</td>
                        <td>{measurement(item.length)}</td>
                        <td>{measurement(item.shoulder)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="xm-note">
                  Sample chart. Confirm supplier measurements
                  before ordering.
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
                      if (suggested) setSelected(suggested.size);
                    }}
                  >
                    Select size ↗
                  </button>
                </div>

                <p className="xm-note">
                  {suggested
                    ? "Estimate based on 2 inches of extra room. Confirm the final garment chart before ordering."
                    : "This sample chart does not cover your measurement. Check with the supplier."}
                </p>
              </div>
            </div>

            <div className="xm-quantity">
              <span>02 / QUANTITY</span>

              <div>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity === 1}
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                >
                  −
                </button>

                <output className="xm-qty" aria-live="polite">
                  {quantity}
                </output>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity === 20}
                  onClick={() =>
                    setQuantity((value) => Math.min(20, value + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              ref={reviewButtonRef}
              type="button"
              className="xm-order"
              disabled={expired}
              onClick={() => dialogRef.current?.showModal()}
            >
              <span>
                {expired ? "PRE-ORDERS CLOSED" : "REVIEW SELECTION"}
              </span>

              <span className="xm-total">
                {currency(price * quantity)}
              </span>

              <ArrowUpRight aria-hidden="true" />
            </button>

            <p className="xm-order-note">
              Check your size and quantity before ordering.
            </p>
          </section>
        </div>

        <div className="xm-footer">
          <span>THE XTREME COLLECTION</span>
          <span>
            ROAD TO XTREME 2.0 <b>↗</b>
          </span>
        </div>
      </main>

      <dialog
        ref={dialogRef}
        className="xm-dialog"
        aria-labelledby="xm-order-title"
        onClose={() => reviewButtonRef.current?.focus()}
      >
        <form method="dialog">
          <button
            type="submit"
            className="xm-close"
            aria-label="Close selection summary"
          >
            ×
          </button>

          <span className="xm-status">YOUR SELECTION</span>

          <h2 id="xm-order-title">
            Road to
            <br />
            <em>Xtreme Polo.</em>
          </h2>

          <p>
            {quantity} × Road to Xtreme Polo · Size {selected}
          </p>

          <strong className="xm-dialog-total">
            {currency(price * quantity)}
          </strong>

          <p>
            Online ordering is not open yet. No order or payment
            has been submitted.
          </p>

          <button type="submit" className="xm-order">
            CONTINUE EXPLORING
            <ArrowUpRight aria-hidden="true" />
          </button>
        </form>
      </dialog>
    </div>
  );
}