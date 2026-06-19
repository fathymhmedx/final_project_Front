import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Sidebar from '../components/Sidebar';
import img1 from '../assets/img1.png';

const API_IMG = 'http://localhost:8000';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data?.data?.product || data?.product || data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-cyan-400 font-semibold">
            ← Go Back
          </button>
        </main>
      </div>
    );
  }

  const getImgUrl = (url) => {
    if (!url) return img1;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${API_IMG}${url}`;
    return `${API_IMG}/uploads/products/${url}`;
  };

  const getUserImg = (usr) => {
    if (!usr?.profileImage) return null;
    let imgPath = usr.profileImage;
    if (!imgPath.includes('.')) {
      imgPath += '.jpg';
    }
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_IMG}/uploads/users/${imgPath}`;
  };

  const images = product.images && product.images.length > 0
    ? product.images.map(img => getImgUrl(img.url))
    : [img1];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-10">
          
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Images Section */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-[#0f1629] border border-white/5">
                <img 
                  src={images[activeImage]} 
                  alt={product.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">{product.category}</span>
                {product.condition && (
                  <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-white/10">
                    {product.condition}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{product.title}</h1>
              
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8">
                ${product.price?.toLocaleString()}
              </div>

              <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Description</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description || 'No description available for this item.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Listed On</p>
                  <p className="text-sm font-semibold text-white">{formatDate(product.createdAt)}</p>
                </div>
                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-white">{product.location || 'Unknown'}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="mt-auto">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Seller Information</h3>
                <div className="flex items-center gap-4 bg-[#0f1629] border border-white/5 p-4 rounded-2xl">
                  <Link to={`/users/${product.seller?._id}`} className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden border-2 border-white/10 flex-shrink-0 hover:ring-2 hover:ring-blue-500 transition-all">
                    {product.seller?.profileImage ? (
                      <img 
                        src={getUserImg(product.seller)} 
                        alt={product.seller.name} 
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        className="w-full h-full object-cover" 
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: product.seller?.profileImage ? 'none' : 'flex' }}>
                      {(product.seller?.name?.charAt(0) || 'U').toUpperCase()}
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/users/${product.seller?._id}`} className="text-base font-semibold text-white truncate block hover:text-blue-400 transition-colors">{product.seller?.name || 'Unknown Seller'}</Link>
                    <p className="text-xs text-gray-500 truncate">{product.seller?.email || 'No email provided'}</p>
                  </div>
                  <Link to={`/users/${product.seller?._id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
