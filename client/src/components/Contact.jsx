import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  //   data Listing that user create
  console.log(listing);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        // data user that create listing
        setLandlord(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord?.username}</span>{" "}
            for
            <span className="font-semibold">
              {" "}
              {listing.name.toLowerCase()}
            </span>{" "}
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"></textarea>
          <Link
            to={`mailto:${landlord.email}?Subject=Regarding${listing.name}&body=${message}`}
            className="bg-slate-700 hover:bg-slate-600 w-full p-3 text-white text-center uppercase hover:opacity-95 rounded-lg">
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
