import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

export default function ContactLand({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log('Landlord data:', data);  // Log the response to check the structure
        
        if (data.success) {
          setLandlord(data.data);  // Set the user data (including 'username')
        } else {
          console.error('Failed to fetch landlord');
        }
      } catch (error) {
        console.log('Error fetching landlord:', error);
      }
    };
    
    if (listing.userRef) {
      fetchLandlord();
    }
  }, [listing.userRef]);

  return (
    <>
      {landlord ? (
        <div className="flex flex-col space-y-4 gap-2">
          <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>  {/* Use lowercase 'username' */}
          <textarea name="message" id="message" rows="2" value={message} onChange={onChange} className="w-full border p-3 rounded-lg" placeholder="Enter your message here!!!"></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white py-2 px-4 rounded-lg text-center p-3 uppercase hover:opacity-95">
            Send Message
          </Link>
        </div>
      ) : (
        <p>Loading...</p>  // Optional: Show a loading message while waiting for the data
      )}
    </>
  );
}
