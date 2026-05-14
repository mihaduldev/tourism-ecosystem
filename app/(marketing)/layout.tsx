"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/hotels", label: "Hotels" },
  { href: "/tours", label: "Tours" },
  { href: "/flights", label: "Flights" },
  { href: "/restaurants", label: "Restaurants" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderColor: "#e5e7eb" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563eb" }}>
                <Building2 className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="hidden sm:block">
                <span className="text-sm font-bold text-gray-900">Tourism</span>
                <span className="text-sm font-bold" style={{ color: "#2563eb" }}> Ecosystem</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={active
                      ? { background: "#eff6ff", color: "#2563eb" }
                      : { color: "#4b5563" }
                    }>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-gray-500" style={{ border: "1px solid #e5e7eb" }}>
              <Search className="w-3.5 h-3.5" /> Search...
            </button>
            <Link href="/admin" className="hidden sm:block px-3.5 py-2 text-xs font-semibold rounded-lg" style={{ background: "#eff6ff", color: "#2563eb" }}>
              Admin Panel
            </Link>
            <Link href="/tenant" className="hidden sm:block px-3.5 py-2 text-xs font-medium rounded-lg text-gray-600" style={{ background: "#f3f4f6" }}>
              Tenant Demo
            </Link>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <User className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div className="md:hidden px-6 py-3 flex flex-col gap-1 bg-white" style={{ borderTop: "1px solid #f3f4f6" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileNav(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">{item.label}</Link>
            ))}
            <Link href="/admin" onClick={() => setMobileNav(false)} className="px-3 py-2.5 rounded-lg text-sm" style={{ color: "#2563eb" }}>Admin Panel</Link>
            <Link href="/tenant" onClick={() => setMobileNav(false)} className="px-3 py-2.5 rounded-lg text-sm text-gray-600">Tenant Demo</Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-14 px-6 md:px-8 mt-16" style={{ background: "#0f172a", color: "#94a3b8" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#2563eb" }}>
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Tourism Ecosystem</span>
            </div>
            <p className="text-xs leading-relaxed">The operating system for tourism and service businesses. One platform, unlimited businesses.</p>
          </div>
          {[
            { title: "Platform", links: [{ label: "Hotels", href: "/hotels" }, { label: "Tours", href: "/tours" }, { label: "Flights", href: "/flights" }, { label: "Restaurants", href: "/restaurants" }] },
            { title: "Business", links: [{ label: "For Hotels", href: "#" }, { label: "For Restaurants", href: "#" }, { label: "For Agencies", href: "#" }, { label: "Pricing", href: "#" }] },
            { title: "Company", links: [{ label: "About", href: "#" }, { label: "Contact", href: "#" }, { label: "Careers", href: "#" }, { label: "Blog", href: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}><Link href={link.href} className="text-xs hover:text-white transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 text-xs text-center" style={{ borderTop: "1px solid #1e293b" }}>
          &copy; 2026 Tourism Ecosystem. All rights reserved. Built in Bangladesh 🇧🇩
        </div>
      </footer>
    </div>
  );
}
