"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Shield, CreditCard, Smartphone, Landmark, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

const cartItems = [
  { id: 1, type: "Hotel", icon: "🏖", name: "Sea Pearl Beach Resort", detail: "Deluxe Sea View Room · Apr 26–29 (3 nights) · 2 guests", price: 4200, qty: 3, subtotal: 12600 },
  { id: 2, type: "Tour", icon: "🌊", name: "Cox's Bazar 3D2N Tour", detail: "Apr 26 departure · 2 persons · TourBD Agency", price: 8500, qty: 2, subtotal: 17000 },
];

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: Smartphone, color: "bg-pink-50 border-pink-200" },
  { id: "nagad", label: "Nagad", icon: Smartphone, color: "bg-orange-50 border-orange-200" },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, color: "bg-blue-50 border-blue-200" },
  { id: "bank", label: "Bank Transfer", icon: Landmark, color: "bg-gray-50 border-gray-200" },
];

const STEPS = ["Cart Review", "Guest Info", "Payment", "Confirm"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const subtotal = cartItems.reduce((a, i) => a + i.subtotal, 0);
  const fee = Math.round(subtotal * 0.03);
  const total = subtotal + fee;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Back */}
      <Link href="/hotels" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue browsing
      </Link>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2",
                i < step ? "bg-brand-500 border-brand-500 text-white" :
                i === step ? "border-brand-500 text-brand-600 bg-white" :
                "border-gray-300 text-gray-400 bg-white"
              )}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[10px] font-medium mt-1 text-gray-500 hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-brand-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 0: Cart */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Review Your Booking</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.type}</span>
                      <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">৳{item.subtotal.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{item.qty} × ৳{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Guest Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Guest Information</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label><input type="text" defaultValue="Rahim Ahmed" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label><input type="text" defaultValue="+880 1711-234567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Email *</label><input type="email" defaultValue="rahim@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">NID / Passport</label><input type="text" placeholder="1990-XXXX-XXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Special Requests</label><textarea rows={3} placeholder="Any special requirements..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((pm) => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                    className={cn("border-2 rounded-xl p-4 flex items-center gap-3 text-left transition-all",
                      paymentMethod === pm.id ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                    )}>
                    <pm.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{pm.label}</span>
                    {paymentMethod === pm.id && <Check className="w-4 h-4 text-brand-500 ml-auto" />}
                  </button>
                ))}
              </div>
              {paymentMethod === "bkash" && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1">bKash Number</label>
                  <input type="text" defaultValue="01711-234567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <p className="text-xs text-gray-400 mt-2">You will receive a payment confirmation PIN on this number.</p>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label><input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label><input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">CVC</label><input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-success-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
              <p className="text-gray-500">Your booking reference is <span className="font-mono font-bold text-brand-600">BK-48291</span></p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left max-w-md mx-auto space-y-2">
                {cartItems.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm"><span className="text-gray-600">{i.name}</span><span className="font-semibold">৳{i.subtotal.toLocaleString()}</span></div>
                ))}
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2 font-bold"><span>Total Paid</span><span className="text-brand-600">৳{total.toLocaleString()}</span></div>
              </div>

              <p className="text-xs text-gray-400">Confirmation sent to rahim@email.com and +880 1711-234567</p>

              <div className="flex gap-3 justify-center pt-2">
                <Link href="/"><Button variant="secondary">Back to Home</Button></Link>
                <Button>View My Bookings</Button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm"><span className="text-gray-600 truncate mr-2">{item.name}</span><span className="font-semibold shrink-0">৳{item.subtotal.toLocaleString()}</span></div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-500"><span>Platform fee (3%)</span><span>৳{fee.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
            </div>

            {step < 3 && (
              <div className="space-y-2">
                <Button className="w-full" onClick={() => setStep(Math.min(3, step + 1))}>
                  {step === 2 ? <><Lock className="w-3.5 h-3.5" /> Confirm & Pay ৳{total.toLocaleString()}</> : <>Continue <ChevronRight className="w-3.5 h-3.5" /></>}
                </Button>
                {step > 0 && <Button variant="ghost" className="w-full" onClick={() => setStep(step - 1)}>Back</Button>}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 justify-center"><Shield className="w-3 h-3" />Secure checkout · SSL encrypted</div>
          </div>
        </div>
      </div>
    </div>
  );
}
