import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";
import "swiper/css/bundle";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);

  useEffect(() => {
    const fetchSaleListings = async () => {
      const res = await fetch("/api/listing/get?sale=true&limit=4");
      const data = await res.json();
      setSaleListings(data.listings);
    };

    const fetchRentListings = async () => {
      const res = await fetch("/api/listing/get?rent=true&limit=4");
      const data = await res.json();
      setRentListings(data.listings);
      fetchSaleListings();
    };

    const fetchOfferListings = async () => {
      const res = await fetch("/api/listing/get?offer=true&limit=4");
      const data = await res.json();
      setOfferListings(data.listings);
      fetchRentListings();
    };

    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className=" flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Ajmir Estate is the best palce to find you next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold
         hover:underline">
          Lets Start now...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url('http://localhost:3000${listing.imageUrls[0]}') center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing result for offer, sale and rent */}
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?offer=true">
                Show more Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                // listing item component
                offerListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
        {/* rent */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Rents
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=rent">
                Show more palces for Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                // listing item component
                rentListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
        {/* sale */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=sale">
                Show more palces for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                // listing item component
                saleListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
