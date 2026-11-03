import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Mail, MapPin, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-campus-text text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-campus-primary flex items-center justify-center text-white shadow-md">
                <Recycle className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                CAMPUS<span className="text-campus-accent">REUSE</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              "Give What You Don't Need. Get What You Do."
              <br />
              A college-exclusive circular exchange platform empowering students to share textbooks, electronics, lab supplies, and dorm essentials while eliminating campus waste.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-campus-secondary">
                <Sparkles className="w-3.5 h-3.5 text-campus-accent" />
                Zero Waste Campus Initiative
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-campus-accent">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition">
                  Donate an Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-campus-accent">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/browse?category=Books %26 Study Materials" className="hover:text-white transition">
                  Books & Study Materials
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Electronics" className="hover:text-white transition">
                  Electronics & Kits
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Lab Equipment" className="hover:text-white transition">
                  Lab Equipment & Coats
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Stationery" className="hover:text-white transition">
                  Stationery & Drafting
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Furniture" className="hover:text-white transition">
                  Dorm Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-campus-accent">
              Campus Office
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-campus-accent shrink-0 mt-0.5" />
                <span>Student Affairs & Eco-Sustainability Wing, University Center</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-campus-accent shrink-0" />
                <span>reuse@campus.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-campus-accent shrink-0" />
                <span>campus-reuse.internal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Campus Reuse & Donation Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
            <span>for Sustainable College Campuses</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
