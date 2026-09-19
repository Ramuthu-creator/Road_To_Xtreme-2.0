import Preloader from "../components/animations/xtremepreloader";

export default function HomePage() {
  return (
    <Preloader>
      <main className="min-h-screen bg-[#080808] text-white">
        {/* Put your existing hero component here. */}
      </main>
    </Preloader>
  );
}