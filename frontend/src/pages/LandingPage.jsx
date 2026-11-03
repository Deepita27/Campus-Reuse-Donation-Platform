import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Cpu,
  PenTool,
  Shirt,
  FlaskConical,
  Trophy,
  Armchair,
  PackageCheck,
  Recycle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  CheckCircle2,
  TrendingUp,
  Leaf
} from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [itemsRes, catRes] = await Promise.all([
          itemService.getFeaturedItems(),
          itemService.getCategoryStats()
        ]);

        if (itemsRes.success) setFeaturedItems(itemsRes.items || []);
        if (catRes.success) setCategories(catRes.categories || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLandingData();
  }, []);

  const categoryIcons = {
    'Books & Study Materials': BookOpen,
    Electronics: Cpu,
    Stationery: PenTool,
    Clothing: Shirt,
    'Lab Equipment': FlaskConical,
    'Sports Equipment': Trophy,
    Furniture: Armchair,
    Others: PackageCheck
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-campus-secondary/40 via-campus-bg to-campus-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-campus-secondary text-campus-primaryDark font-bold text-xs uppercase tracking-wider border border-campus-secondaryDark/50 shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-campus-primary" />
                <span>Campus Sustainability & Circular Sharing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-campus-text tracking-tight leading-[1.12]">
                One Student's Unused Item Is Another Student's{' '}
                <span className="text-campus-primary underline decoration-campus-accent decoration-wavy decoration-4">
                  Treasure.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-campus-textMuted max-w-2xl leading-relaxed">
                Connect with verified classmates across departments to donate, exchange, and request
                reusable books, lab gear, electronic components, and dorm essentials. Save money and
                cut campus waste with every exchange.
              </p>

              {/* Two CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/browse"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-campus-primary hover:bg-campus-primaryDark text-white font-bold rounded-2xl shadow-lg shadow-campus-primary/25 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Explore Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={isAuthenticated ? '/donate' : '/login?redirect=/donate'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-campus-primary border-2 border-campus-primary font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-campus-accent" />
                  <span>Donate an Item</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-campus-textMuted font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-campus-primary" />
                  <span>College Email Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-campus-primary" />
                  <span>Admin-Approved Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-campus-primary" />
                  <span>100% Free Campus Exchange</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Eco Impact Pill */}
                <div className="absolute -top-4 -left-4 z-20 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-campus-secondary flex items-center justify-center text-campus-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-campus-textMuted block">
                      Waste Diverted
                    </span>
                    <span className="text-sm font-extrabold text-campus-text">
                      +850 Kg This Semester
                    </span>
                  </div>
                </div>

                {/* Primary Card Showcase */}
                <div className="campus-card overflow-hidden shadow-2xl relative">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="Campus Reuse Community"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-eco">College Verified</span>
                      <span className="text-xs font-bold text-campus-primary">Zero Fees</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-campus-text">
                      Give What You Don't Need. Get What You Do.
                    </h3>
                    <p className="text-xs text-campus-textMuted leading-relaxed">
                      "I received an Arduino kit from a senior in 4th year and donated my engineering
                      mechanics textbooks. Both found new lives instead of ending up in dorm trash!"
                    </p>
                  </div>
                </div>

                {/* Floating Category Pill */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-campus-accent/20 flex items-center justify-center text-campus-text">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-campus-textMuted block">
                      Active Community
                    </span>
                    <span className="text-sm font-extrabold text-campus-text">
                      500+ Verified Students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="campus-card p-6 text-center bg-white">
            <span className="text-3xl sm:text-4xl font-extrabold text-campus-primary">500+</span>
            <p className="text-xs sm:text-sm font-semibold text-campus-textMuted mt-1">
              Registered Students
            </p>
          </div>
          <div className="campus-card p-6 text-center bg-white">
            <span className="text-3xl sm:text-4xl font-extrabold text-campus-primary">1,200+</span>
            <p className="text-xs sm:text-sm font-semibold text-campus-textMuted mt-1">
              Items Reused & Exchanged
            </p>
          </div>
          <div className="campus-card p-6 text-center bg-white">
            <span className="text-3xl sm:text-4xl font-extrabold text-campus-primary">$28,500</span>
            <p className="text-xs sm:text-sm font-semibold text-campus-textMuted mt-1">
              Student Money Saved
            </p>
          </div>
          <div className="campus-card p-6 text-center bg-white">
            <span className="text-3xl sm:text-4xl font-extrabold text-campus-primary">1,850 kg</span>
            <p className="text-xs sm:text-sm font-semibold text-campus-textMuted mt-1">
              Landfill Waste Diverted
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-campus-text">
            Explore By Campus Category
          </h2>
          <p className="text-sm text-campus-textMuted">
            Find exactly what you need for this semester or list your unused materials in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.category] || PackageCheck;
            return (
              <Link
                key={cat.category}
                to={`/browse?category=${encodeURIComponent(cat.category)}`}
                className="campus-card p-5 group flex flex-col items-center text-center hover:border-campus-primary/50 transition duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-campus-secondary/60 text-campus-primary flex items-center justify-center mb-3 group-hover:bg-campus-primary group-hover:text-white transition duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-campus-text group-hover:text-campus-primary transition">
                  {cat.category}
                </h3>
                <span className="text-xs text-campus-textMuted mt-1 font-medium">
                  {cat.count} {cat.count === 1 ? 'item' : 'items'} available
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. RECENTLY ADDED ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge-eco mb-2 inline-block">Fresh Listings</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              Recently Donated on Campus
            </h2>
            <p className="text-sm text-campus-textMuted mt-1">
              Verified items posted by students across faculties.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-campus-primary hover:text-campus-primaryDark transition"
          >
            <span>View All Marketplace Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="campus-card h-80 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : featuredItems.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-campus-border">
            <p className="text-campus-textMuted text-sm">No items currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-white py-16 border-y border-campus-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="badge-eco">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-campus-text">
              How Campus Reuse Works
            </h2>
            <p className="text-sm text-campus-textMuted">
              Three simple steps to pass along what you don't need or pick up what you do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative campus-card p-6 text-center space-y-3 bg-campus-bg/40">
              <div className="w-12 h-12 bg-campus-primary text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
                1
              </div>
              <h3 className="font-bold text-lg text-campus-text">List Your Item</h3>
              <p className="text-xs sm:text-sm text-campus-textMuted leading-relaxed">
                Take a quick photo of your unused textbook, calculator, or lab coat. Select condition
                and choose a safe campus pickup spot.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative campus-card p-6 text-center space-y-3 bg-campus-bg/40">
              <div className="w-12 h-12 bg-campus-primary text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
                2
              </div>
              <h3 className="font-bold text-lg text-campus-text">Connect with Peers</h3>
              <p className="text-xs sm:text-sm text-campus-textMuted leading-relaxed">
                Interested classmates submit requests. Review their department details and accept the
                request in your student dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative campus-card p-6 text-center space-y-3 bg-campus-bg/40">
              <div className="w-12 h-12 bg-campus-primary text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg text-campus-text">Handover & Reuse</h3>
              <p className="text-xs sm:text-sm text-campus-textMuted leading-relaxed">
                Meet at the agreed campus spot (e.g. library lobby, cafeteria). Mark the exchange
                complete and support a circular campus!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUSTAINABILITY IMPACT SECTION */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="campus-card bg-gradient-to-br from-campus-primaryDark via-campus-primary to-emerald-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-campus-secondary text-xs font-semibold backdrop-blur-sm">
                <Leaf className="w-3.5 h-3.5 text-campus-accent" />
                Sustainability Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Small Student Actions, Massive Environmental Difference.
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl">
                Every textbook reused prevents 2.5 kg of paper waste. Every electronic component
                recirculated avoids toxic e-waste. By connecting directly with classmates, we create
                an affordable, zero-waste campus ecosystem.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-campus-accent block">
                  -85%
                </span>
                <span className="text-xs text-gray-200 mt-1 block">
                  Embodied Carbon vs Buying New
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-campus-accent block">
                  100%
                </span>
                <span className="text-xs text-gray-200 mt-1 block">
                  Student-to-Student Campus Direct
                </span>
              </div>
              <div className="col-span-2 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-300 block">Ready to join?</span>
                  <span className="text-sm font-bold text-white">Create an account in 30 seconds</span>
                </div>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-campus-accent text-campus-text font-bold text-xs rounded-xl shadow hover:bg-campus-accentHover transition"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
