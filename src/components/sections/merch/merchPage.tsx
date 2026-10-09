"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowUpRight, Maximize2, ScanLine } from "lucide-react";
import "./Merch.css";

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"] as const;
type Size = (typeof SIZES)[number];

// SAMPLE ONLY: replace with the supplier's confirmed size chart.
// Chest is the full garment circumference, in inches.
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
  const [selected, setSelected] = useState<Size>("M");
  const [tab, setTab] = useState<"guide" | "finder">("guide");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [chest, setChest] = useState(38);
  const [quantity, setQuantity] = useState(1);
  const [remaining, setRemaining] = useState<number | null>(null);

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
              } ${zoomed ? "zoomed" : ""}`}
            >
              <div className="xm-shirt-wrap" key={view}>
                {/* Original combined image; only the viewport changes. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="xm-shirt"
                  src="/assets/images/merch/merch.jpeg"
                  alt={
                    view === "front"
                      ? "Front of the original Road to Xtreme polo"
                      : "Back of the original Road to Xtreme polo"
                  }
                  width={2048}
                  height={1152}
                  draggable={false}
                />
              </div>

              <span className="xm-view">
                {view.toUpperCase()} VIEW
              </span>

              <button
                type="button"
                className="xm-zoom"
                aria-pressed={zoomed}
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
                    <strong>
                      {suggested?.size ?? "No match"}
                    </strong>
                  </span>

                  <button
                    type="button"
                    className="xm-use"
                    disabled={!suggested}
                    onClick={() => {
                      if (suggested) {
                        setSelected(suggested.size);
                      }
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