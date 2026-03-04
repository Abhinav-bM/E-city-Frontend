"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Input, Button, Accordion } from "@/components/ui";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Mobile Accordion Items
  const accordionItems = [
    {
      id: "shop",
      title: "Shop Options",
      content: (
        <ul className="space-y-3 pb-2 pt-1">
          <li>
            <Link
              href="/shop?condition=new"
              className="hover:text-blue-400 transition-colors"
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <Link
              href="/shop?condition=refurbished"
              className="hover:text-blue-400 transition-colors"
            >
              Refurbished Phones
            </Link>
          </li>
          <li>
            <Link
              href="/shop?category=laptops"
              className="hover:text-blue-400 transition-colors"
            >
              Laptops & PCs
            </Link>
          </li>
          <li>
            <Link
              href="/shop?category=accessories"
              className="hover:text-blue-400 transition-colors"
            >
              Accessories
            </Link>
          </li>
          <li>
            <Link
              href="/shop?deal=flash"
              className="hover:text-blue-400 transition-colors text-amber-500"
            >
              Flash Sales
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: "support",
      title: "Customer Support",
      content: (
        <ul className="space-y-3 pb-2 pt-1">
          <li>
            <Link
              href="/contact"
              className="hover:text-blue-400 transition-colors"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-blue-400 transition-colors">
              FAQ & Help Center
            </Link>
          </li>
          <li>
            <Link
              href="/track-order"
              className="hover:text-blue-400 transition-colors"
            >
              Track Your Order
            </Link>
          </li>
          <li>
            <Link
              href="/returns"
              className="hover:text-blue-400 transition-colors"
            >
              Returns & Exchanges
            </Link>
          </li>
          <li>
            <Link
              href="/warranty"
              className="hover:text-blue-400 transition-colors"
            >
              Warranty Policy
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: "company",
      title: "About E-City",
      content: (
        <ul className="space-y-3 pb-2 pt-1">
          <li>
            <Link
              href="/about"
              className="hover:text-blue-400 transition-colors"
            >
              Our Story
            </Link>
          </li>
          <li>
            <Link
              href="/quality"
              className="hover:text-blue-400 transition-colors"
            >
              Quality Assurance
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="hover:text-blue-400 transition-colors"
            >
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <footer className="bg-navy-900 text-navy-300 pt-16 pb-[calc(var(--bottom-nav-height)+20px)] md:pb-8 border-t border-navy-800">
      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding)]">
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-navy-800 border border-navy-700/50 mb-12 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              Subscribe to our Newsletter
            </h3>
            <p className="text-sm text-navy-400">
              Get updates on new arrivals and exclusive deals.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Your email address"
              className="bg-navy-900 border-navy-700 text-white min-w-[280px]"
              leftIcon={<Mail size={18} />}
            />
            <Button variant="primary" className="whitespace-nowrap">
              Subscribe Now
            </Button>
          </div>
        </div>

        {/* Desktop Footer Links */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-10 w-32">
                <Image
                  src="/logo.png"
                  alt="E-City Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed mb-6">
              E-City Mobiles offers the best deals on new and certified
              refurbished electronics. Every refurbished device undergoes a
              rigorous 32-point quality check.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-500" /> 123 Tech Street,
                Mumbai, 400001
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />{" "}
                support@ecitymobiles.com
              </div>
            </div>
          </div>

          {/* Link Cols */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">
              Shop Options
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/shop?condition=new"
                  className="hover:text-blue-400 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?condition=refurbished"
                  className="hover:text-blue-400 transition-colors"
                >
                  Refurbished Phones
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=laptops"
                  className="hover:text-blue-400 transition-colors"
                >
                  Laptops & PCs
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=accessories"
                  className="hover:text-blue-400 transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?deal=flash"
                  className="hover:text-blue-400 transition-colors text-amber-500"
                >
                  Flash Sales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">
              Customer Support
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  FAQ & Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-blue-400 transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-blue-400 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="hover:text-blue-400 transition-colors"
                >
                  Warranty Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">
              About E-City
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/quality"
                  className="hover:text-blue-400 transition-colors"
                >
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion Footer (Hidden on Desktop) */}
        <div className="md:hidden space-y-8 mb-10">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-8 w-24 mx-auto">
                <Image
                  src="/logo.png"
                  alt="E-City Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-navy-400 px-4">
              The best deals on new and certified refurbished electronics.
            </p>
          </div>
          <div className="border-t border-b border-navy-800">
            {/* Custom dark theme styling for accordion via a wrapper */}
            <div className="[&_button]:text-white [&_button]:py-5 [&_svg]:text-navy-400 [&_div.text-sm]:text-navy-300">
              <Accordion items={accordionItems} />
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm items-center justify-center text-navy-400">
            <div className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} /> support@ecitymobiles.com
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-500">
            &copy; {currentYear} E-City Mobiles. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
