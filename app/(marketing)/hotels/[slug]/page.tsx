import Link from "next/link";
import { featuredHotels, hotelRooms, hotelReviews } from "@/lib/demo-data";
import { Star, MapPin, Wifi, ShieldCheck, Check, Heart, Share2, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HotelDetailPage({ params }: { params: { slug: string } }) {
  const hotel = featuredHotels.find((h) => h.slug === params.slug) ?? featuredHotels[0];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Back */}
      <Link href="/hotels" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </Link>

      {/* Photo Gallery placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6">
        <div className="col-span-2 row-span-2 bg-gradient-to-br from-brand-200 to-brand-100 flex items-center justify-center text-7xl h-60 md:h-72">
          {hotel.image}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center h-28 md:h-34 text-gray-400 text-sm">
            Photo {i}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Hotel info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center gap-1 text-xs text-warning-500 mt-1">
                {"★".repeat(hotel.stars)}
              </div>
              {hotel.verified && <span className="flex items-center gap-0.5 text-[10px] bg-success-100 text-success-700 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" />Verified</span>}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{hotel.location}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                <span className="font-bold text-gray-900">{hotel.rating}</span>
                <span className="text-gray-400">({hotel.reviews} reviews)</span>
              </div>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"><Heart className="w-4 h-4" />Save</button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"><Share2 className="w-4 h-4" />Share</button>
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Located along the pristine coastline with direct sea access, {hotel.name} offers an unparalleled beachfront experience. Guests enjoy spacious rooms, world-class dining, a relaxing spa, and stunning sunset views. Ideal for families, couples, and business travelers.
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Check className="w-4 h-4 text-success-500" /> {a}
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Available Rooms</h2>
            <div className="space-y-3">
              {hotelRooms.map((room) => (
                <div key={room.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all">
                  <div className="w-20 h-20 bg-brand-50 rounded-xl flex items-center justify-center text-3xl shrink-0">🛏</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900">{room.type}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{room.beds} · {room.size}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {room.amenities.slice(0, 4).map((a) => <span key={a} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{a}</span>)}
                    </div>
                  </div>
                  <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{room.available} available</p>
                      <p className="text-xl font-bold text-gray-900">৳{room.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span></p>
                    </div>
                    <Button size="sm" className="mt-0 sm:mt-2">Reserve</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Guest Reviews</h2>
            <div className="space-y-3">
              {hotelReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold">{review.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{review.name}</p>
                      <p className="text-[10px] text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5 text-xs text-warning-500">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl shadow-lg p-5 space-y-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">From</p>
              <p className="text-3xl font-bold text-gray-900">৳{hotel.priceFrom.toLocaleString()}<span className="text-sm font-normal text-gray-400">/night</span></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
                <input type="date" defaultValue="2026-04-26" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Check-out</label>
                <input type="date" defaultValue="2026-04-29" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
                  <option>1 Adult</option><option>2 Adults</option><option>2 Adults + 1 Child</option><option>3 Adults</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">৳{hotel.priceFrom.toLocaleString()} × 3 nights</span><span className="font-semibold">৳{(hotel.priceFrom * 3).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service fee</span><span className="font-semibold">৳{Math.round(hotel.priceFrom * 3 * 0.03).toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-2 mt-2"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-gray-900">৳{Math.round(hotel.priceFrom * 3 * 1.03).toLocaleString()}</span></div>
            </div>

            <Button className="w-full py-3 text-sm">Reserve Now</Button>
            <p className="text-xs text-center text-gray-400">Free cancellation up to 24 hours before check-in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
