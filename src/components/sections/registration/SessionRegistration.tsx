import React from 'react';

const SessionRegistration: React.FC = () => {
  return (
    <section className="bg-[#1a1a1a] w-full p-6 md:p-12 lg:px-20 lg:py-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

        {/* Left Column - Typography & Form */}
        <div className="flex flex-col">
          <p className="text-orange-500 uppercase tracking-widest text-xs md:text-sm font-semibold mb-4 md:mb-6">
            PARTICIPANT REGISTRATION
          </p>

          <h2 className="text-white text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Your Xtreme <br /> Starts <span className="whitespace-nowrap">Here<span className="text-orange-500">.</span></span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base mb-10 md:mb-12 max-w-md leading-relaxed">
            Bring your curiosity. Find your people. <br />
            Turn your next challenge into a breakthrough.
          </p>

          <form className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col">
              <label className="text-white text-sm md:text-base mb-2">Full Name (or Name with Initials)</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="bg-transparent border-b border-gray-600 focus:border-orange-500 focus:outline-none py-2 text-white w-full transition-colors placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="flex flex-col">
                <label className="text-white text-sm md:text-base mb-2">Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. IT21..."
                  className="bg-transparent border-b border-gray-600 focus:border-orange-500 focus:outline-none py-2 text-white w-full transition-colors placeholder:text-gray-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white text-sm md:text-base mb-2">Batch</label>
                <select
                  className="bg-transparent border-b border-gray-600 focus:border-orange-500 focus:outline-none py-2 text-white w-full transition-colors appearance-none [&>option]:bg-[#1a1a1a]"
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-500">Select your batch</option>
                  <option value="20.1">UGC Batch 04</option>
                  <option value="20.2">UGC Batch 05</option>
                  <option value="21.1">UGC Batch 06</option>
                  <option value="23.1">UGC Batch 07</option>
                  <option value="23.2">UGC Batch 08</option>
                  <option value="21.2">UK Batch 07</option>
                  <option value="22.1">UK Batch 08</option>
                  <option value="22.2">Network Batch 01</option>
                  <option value="23.3">Network Batch 02</option>
                  <option value="24.1">ARU Batch 01</option>
                  <option value="24.2">ARU Batch 02</option>

                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="flex flex-col">
                <label className="text-white text-sm md:text-base mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-transparent border-b border-gray-600 focus:border-orange-500 focus:outline-none py-2 text-white w-full transition-colors placeholder:text-gray-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white text-sm md:text-base mb-2">Contact Number</label>
                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX"
                  className="bg-transparent border-b border-gray-600 focus:border-orange-500 focus:outline-none py-2 text-white w-full transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 md:mt-2 w-full md:w-fit px-8 py-4 border border-orange-500 text-orange-500 flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all duration-300 group font-medium"
            >
              Register Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </form>
        </div>

        {/* Right Column - Graphic & Footer Text */}
        <div className="flex flex-col items-center lg:items-end justify-center lg:justify-start lg:mt-16 w-full">
          {/* Blob Graphic */}
          <img
            src="/registration-blob.svg"
            alt="Registration Graphic"
            className="w-full h-auto max-w-md md:max-w-lg lg:max-w-xl mb-12 mt-8 lg:mt-0 lg:mr-8 object-contain"
          />

          <div className="text-center lg:text-right flex flex-col items-center lg:items-end w-full">
            <p className="text-orange-500 font-mono text-sm tracking-[0.15em] mb-3">
              [ EVERY CONNECTION COUNTS ]
            </p>
            <p className="text-gray-400 text-xs md:text-sm tracking-widest font-light">
              Connect , Collaborate , Go Xtreme
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SessionRegistration;
