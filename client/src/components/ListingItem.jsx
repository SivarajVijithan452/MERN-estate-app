import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({listing}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
         <img src={listing.imageUrls[0]} alt="listing cover" className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"/>
         <div className="p-4 flex flex-col gap-2 w-full">
            <p className="truncate text-lg font-semibold text-slate-700">{listing.name}</p>
            <div className="flex items-center gap-2">
                <MdLocationOn className="inline-block text-red-500"/>
                <p className="truncate text-sm inline-block text-slate-600">{listing.address}</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
            <p className="text-slate-500 mt-2 font-semibold">LKR {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPricetoLocaleString('en-US')}</p>
            {listing.type === 'rent' && <p className="text-sm text-gray-600">Monthly Rent</p>} 
            <div className="text-slate-700 flex gap-4">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`}
              </div>
            </div>
         </div>
      </Link>
    </div>
  )
}
