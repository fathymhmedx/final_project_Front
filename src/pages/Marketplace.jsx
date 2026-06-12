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

  /* ── related (accessories / parts) ── */
  const [relatedEquipment, setRelatedEquipment] = useState([]);

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
      let url = `/products?page=${page}&limit=5`;
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

  /* ──────── Fetch Related Equipment ──────── */
  const fetchRelated = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/products?category=parts,accessories&limit=6');
      setRelatedEquipment(data?.data?.products || []);
    } catch (err) {
      console.error('Error fetching related:', err);
    }
  }, []);

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
    fetchRelated();
    fetchWishlist();
  }, [fetchRelated, fetchWishlist]);

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

  /* ── split products: first is featured, rest go in grid ── */
  const featured = products[0] || null;
  const gridProducts = products.slice(1);

  /* ── helpers ── */
  const getImg = (item) => item?.images?.[0]?.url ? `${API_IMG}/uploads/products/${item.images[0].url}` : img1;

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* ── Sidebar ── */}
      <Sidebar filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-20 pb-10 lg:py-10">

          {/* ── Header ── */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Velora Marketplace</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              High-performance machinery, precision-engineered parts, and professional-grade rider equipment.
            </p>
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
              {/* ══════════ Featured + Grid Layout ══════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-12">
                {/* ── Featured Card (large) ── */}
                {featured && (
                  <div className="lg:col-span-3 bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden group hover:border-blue-500/20 transition-all duration-500 relative flex flex-col">
                    {/* Image */}
                    <div className="relative h-[340px] overflow-hidden bg-black/40">
                      <img
                        src={getImg(featured)}
                        alt={featured.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-transparent to-transparent"></div>

                      {/* Condition badge */}
                      {featured.condition && (
                        <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                          {featured.condition}
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(featured._id)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all"
                      >
                        <HeartIcon filled={wishlistIds.includes(featured._id)} />
                      </button>

                      {/* Bottom info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{featured.title}</h2>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3">
                          ${featured.price?.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-300 mb-6">
                          {featured.location && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                              {featured.location}
                            </span>
                          )}
                          <span className="capitalize">{featured.category}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {featured.viewsCount || 0}
                          </span>
                        </div>
                        <Link to={`/products/${featured._id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-cyan-400 transition-colors">
                          View Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Small Cards Grid (2×2) ── */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  {gridProducts.slice(0, 4).map((product) => (
                    <div
                      key={product._id}
                      className="bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden group hover:border-blue-500/20 transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-[120px] overflow-hidden bg-black/30">
                        <img
                          src={getImg(product)}
                          alt={product.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Wishlist */}
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <HeartIcon filled={wishlistIds.includes(product._id)} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-3.5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{product.title}</h3>
                        <p className="text-sm font-bold text-cyan-400 mb-2.5">${product.price?.toLocaleString()}</p>
                        <Link to={`/products/${product._id}`} className="mt-auto text-[11px] font-semibold text-blue-400 hover:text-cyan-400 transition-colors text-left inline-block">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Pagination ── */}
              {(pagination?.numberOfPages > 1 || products.length >= 5) && (
                <div className="flex justify-center gap-2 mb-16">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-9 h-9 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {pagination?.numberOfPages &&
                    Array.from({ length: pagination.numberOfPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                          page === num
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-[#0f1629] border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40'
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                  <button
                    disabled={!pagination?.next}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-9 h-9 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ══════════ Related Equipment ══════════ */}
          {relatedEquipment.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Related Equipment</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedEquipment.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden group hover:border-blue-500/20 transition-all duration-300"
                  >
                    <div className="relative h-[140px] overflow-hidden bg-black/30">
                      <img
                        src={getImg(item)}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm font-bold text-cyan-400">${item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
