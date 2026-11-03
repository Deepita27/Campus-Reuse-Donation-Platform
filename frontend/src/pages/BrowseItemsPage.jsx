import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, RotateCcw, PackageOpen } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { itemService } from '../services/api';

const BrowseItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const categories = [
    'All',
    'Books & Study Materials',
    'Electronics',
    'Stationery',
    'Clothing',
    'Lab Equipment',
    'Sports Equipment',
    'Furniture',
    'Others'
  ];

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        category: category !== 'All' ? category : undefined,
        condition: condition !== 'All' ? condition : undefined,
        sort,
        page,
        limit: 12
      };

      const data = await itemService.getItems(params);
      if (data.success) {
        setItems(data.items || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, condition, sort, page]);

  // Handle instant search with debounce on enter or button click
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="badge-eco">Campus Marketplace</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-campus-text tracking-tight">
          Browse Reusable Campus Items
        </h1>
        <p className="text-sm text-campus-textMuted max-w-2xl">
          Search and request available textbooks, components, lab kits, and student supplies
          donated by peers across all university departments.
        </p>
      </div>

      {/* Search Bar & Primary Controls */}
      <div className="campus-card p-4 sm:p-5 bg-white space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by item name, topic, or department..."
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-campus-primary hover:bg-campus-primaryDark text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Search
          </button>

          {(search || category !== 'All' || condition !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Secondary Filter Row: Condition & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs sm:text-sm">
          {/* Condition selector pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-campus-textMuted text-xs uppercase tracking-wider">
              Condition:
            </span>
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => {
                  setCondition(cond);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  condition === cond
                    ? 'bg-campus-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-campus-textMuted text-xs uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-campus-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-campus-primary text-white shadow-md shadow-campus-primary/20'
                  : 'bg-white border border-campus-border text-campus-text hover:bg-campus-secondary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Counter Bar */}
      <div className="flex items-center justify-between text-xs text-campus-textMuted font-medium px-1">
        <span>
          Showing <span className="font-bold text-campus-text">{items.length}</span> of{' '}
          <span className="font-bold text-campus-text">{totalItems}</span> available items
        </span>
        {category !== 'All' && (
          <span className="bg-campus-secondary text-campus-primaryDark font-bold px-2.5 py-0.5 rounded-full text-xs">
            Category: {category}
          </span>
        )}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="campus-card h-96 animate-pulse bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No items found"
          description="We couldn't find any items matching your selected criteria. Try adjusting your search keywords or resetting filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onUpdate={fetchItems} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-xs font-bold text-campus-text">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseItemsPage;
