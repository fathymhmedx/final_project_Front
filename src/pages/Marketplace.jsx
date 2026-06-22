import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import img1 from '../assets/img1.png';

const API_IMG = 'http://localhost:8000';

/* ──── tiny heart icon ──── */
const HeartIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 transition-all duration-300 ${filled ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function Marketplace() {
  const { user } = useAuth();

  /* ── products state ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  /* ── wishlist ── */
  const [wishlistIds, setWishlistIds] = useState([]);

  /* ── filters from sidebar ── */
  const [filters, setFilters] = useState({
    categories: [],
    condition: '',
    priceMin: '',
    priceMax: '',
  });
  const [keyword, setKeyword] = useState('');

  /* ──────── Fetch Products ──────── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/products?page=${page}&limit=6`;
      if (keyword) url += `&keyword=${keyword}`;
      if (filters.categories.length) url += `&category=${filters.categories.join(',')}`;
      if (filters.condition) url += `&condition=${filters.condition}`;
      if (filters.priceMin) url += `&price[gte]=${filters.priceMin}`;
      if (filters.priceMax) url += `&price[lte]=${filters.priceMax}`;

      const { data } = await axiosInstance.get(url);
      setProducts(data?.data?.products || []);
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, filters]);

  /* ──────── Fetch Wishlist ──────── */
  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/wishlist');
      const ids = (data?.data?.wishlist || []).map((w) => w._id || w);
      setWishlistIds(ids);
    } catch {
      // silently fail — user might not be logged in
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /* ──────── Wishlist Toggle ──────── */
  const toggleWishlist = async (productId) => {
    const isWished = wishlistIds.includes(productId);
    try {
      if (isWished) {
        await axiosInstance.delete(`/wishlist/${productId}`);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await axiosInstance.post('/wishlist', { productId });
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  /* ──────── Filter Change ──────── */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (term) => {
    setKeyword(term);
    setPage(1);
  };

  /* ── helpers ── */
  const getImg = (item) => {
    const url = item?.images?.[0]?.url || item?.imageCover;
    if (!url) return img1;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${API_IMG}${url}`;
    return `${API_IMG}/uploads/products/${url}`;
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* ── Sidebar ── */}
      <Sidebar filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-20 pb-10 lg:py-10">

          {/* ── Header ── */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Velora Marketplace</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              High-performance machinery, precision-engineered parts, and professional-grade rider equipment.
            </p>

            {/* ── Search Bar ── */}
            <form
              onSubmit={(e) => { e.preventDefault(); }}
              className="mt-5 relative max-w-lg"
            >
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                placeholder="Search models, brands, or categories..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 transition-all"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => { setKeyword(''); setPage(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </form>
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm">Loading inventory...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-2xl border border-white/5">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-white mb-2">No Machines Found</h3>
              <p className="text-gray-400 text-sm max-w-md text-center">Try adjusting your search criteria or changing the category filter.</p>
            </div>
          ) : (
            <>
              {/* ══════════ Products Grid Layout ══════════ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-[240px] overflow-hidden bg-[#05080f]">
                      <img
                        src={getImg(product)}
                        alt={product.title}
                        onError={(e) => { e.target.src = img1; }}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-[#0f1629]/20 to-transparent opacity-90"></div>

                      {/* Condition badge */}
                      {product.condition && (
                        <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          {product.condition}
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all group/btn"
                      >
                        <HeartIcon filled={wishlistIds.includes(product._id)} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{product.title}</h3>
                        <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 whitespace-nowrap">
                          ${product.price?.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 font-medium">
                        {product.location && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            <span className="truncate max-w-[100px]">{product.location}</span>
                          </span>
                        )}
                        <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                        <span className="capitalize">{product.category}</span>
                      </div>

                      <div className="mt-auto">
                        <Link to={`/products/${product._id}`} className="flex items-center justify-between w-full p-3 rounded-xl bg-white/[0.02] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 text-sm font-semibold text-gray-300 hover:text-white transition-all group/link">
                          <span>View Machine</span>
                          <svg className="w-5 h-5 text-blue-500 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {(pagination?.numberOfPages >= 1) && (
                <div className="flex flex-wrap justify-center gap-2 mb-16">
                  {/* Previous Button */}
                  <button
                    disabled={!pagination.prev}
                    onClick={() => setPage(pagination.prev)}
                    className="w-10 h-10 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.numberOfPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        page === num
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 border-none'
                          : 'bg-[#0f1629] border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 hover:bg-white/5'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    disabled={!pagination.next}
                    onClick={() => setPage(pagination.next)}
                    className="w-10 h-10 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
