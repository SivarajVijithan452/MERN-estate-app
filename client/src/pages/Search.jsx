import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [sidebardata, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  
    const searchTerm = urlParams.get('searchTerm') || '';
    const type = urlParams.get('type') || 'all';
    const parking = urlParams.get('parking') === 'true' || false;
    const furnished = urlParams.get('furnished') === 'true' || false;
    const offer = urlParams.get('offer') === 'true' || false;
    const sort = urlParams.get('sort') || 'created_at';
    const order = urlParams.get('order') || 'desc';
  
    setSidebarData({
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort,
      order,
    });
  
    // Add your API call here to fetch the listings based on the URL params
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        
        // Log the response to ensure data is coming back correctly
        const data = await res.json();
        console.log('Fetched listings:', data);
        
        if (data.success) {
          setListings(data.listings);
        } else {
          console.error('Error fetching listings:', data.message);
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error during fetch:', error);
        setLoading(false);
      }
    };
  
    fetchListings();
  }, [window.location.search]); // Re-run when search params change
  

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebarData({ ...sidebardata, type: id });
    }

    if (id === 'searchTerm') {
      setSidebarData({ ...sidebardata, searchTerm: value });
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebarData({ ...sidebardata, [id]: checked });
    }

    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebarData({ ...sidebardata, sort, order });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side: Search Form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col items-start gap-4 bg-white p-12 rounded-xl shadow-lg mt-20">
            {/* Search Term */}
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Enter search term"
                className="border rounded-lg p-3 w-full"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            {/* Type Section */}
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="type" className="font-semibold">
                Type:
              </label>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebardata.type === 'all'} />
                <span className="font-semibold">Rent & Sale</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebardata.type === 'rent'} />
                <span className="font-semibold">Rent</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebardata.type === 'sale'} />
                <span className="font-semibold">Sale</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebardata.offer} />
                <span className="font-semibold">Offer</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="amenities" className="font-semibold">
                Amenities:
              </label>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebardata.parking} />
                <span className="font-semibold">Parking</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebardata.furnished} />
                <span className="font-semibold">Furnished</span>
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="sort_order" className="font-semibold">
                Sort:
              </label>
              <select onChange={handleChange} defaultValue="created_at_desc" id="sort_order" className="border rounded-lg p-3">
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full">Search</button>
          </div>
        </form>
      </div>

      {/* Right side: Listing Results */}
      <div className="p-7">
        <div className="flex flex-col items-start gap-4 bg-white p-12 rounded-xl shadow-lg mt-20 w-full">
          <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">Listing Results:</h1>
          {loading ? <p>Loading...</p> : <div>{/* Render listing results here */}</div>}
        </div>
      </div>
    </div>
  );
}
