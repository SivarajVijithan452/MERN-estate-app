import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ViewListing() {
    useEffect(() => {
    // fetch listing data
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listing/get/${id}`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    }, []);
  return (
    <div>
      <h1>View Listing</h1>
    </div>
  )
}
