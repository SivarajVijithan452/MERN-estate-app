import React from 'react';

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side: Search Form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form action="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4 bg-white p-12 rounded-xl shadow-lg mt-20">
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="search" className="whitespace-nowrap font-semibold">Search Term:</label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Enter search term"
                className="border rounded-lg p-3 w-full"
              />
            </div>

            {/* Type Section */}
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="type" className="font-semibold">Type:</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="all" className="w-5" />
                <span className="font-semibold">Rent & Sale</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span className="font-semibold">Rent</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <span className="font-semibold">Sale</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                <span className="font-semibold">Offer</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="type" className="font-semibold">Amenities:</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <span className="font-semibold">Parking</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <span className="font-semibold">Furnished</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="sort" className="font-semibold">Sort:</label>
              <select id="sort_order" className="border rounded-lg p-3">
                <option value="">Price high to low</option>
                <option value="">Price low to high</option>
                <option value="">Latest</option>
                <option value="">Oldest</option>
              </select>
            </div>

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full">Search</button>
          </div>
        </form>
      </div>

      {/* Right side: Listing Results */}
      <div className="p-7">
        <div className="flex flex-col items-start gap-4 bg-white p-12 rounded-xl shadow-lg mt-20 w-full">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">Listing Results :</h1>
          </div>
          {/* Add your listing results content here */}
        </div>
    </div>
  );
}
