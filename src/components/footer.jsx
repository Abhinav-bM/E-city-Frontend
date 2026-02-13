"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 tracking-tight block"
            >
              E-City<span className="text-primary">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your premium destination for the latest gadgets and certified
              refurbished electronics. Quality you can trust, prices you'll
              love.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?condition=New"
                  className="hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?condition=Refurbished"
                  className="hover:text-primary transition-colors"
                >
                  Refurbished
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=accessories"
                  className="hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="/profile"
                  className="hover:text-primary transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-primary transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="hover:text-primary transition-colors"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-500 mb-4">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-primary transition-colors"
                required
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Mail size={18} />
              </button>
            </form>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>123 Tech Avenue, Silicon Valley</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 E-City. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
