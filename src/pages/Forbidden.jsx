import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated 403 */}
        <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-x_3s_ease-in-out_infinite] select-none">
          403
        </h1>

        {/* Shield Icon */}
        <div className="flex justify-center mb-6 -mt-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Access Denied
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          You don&apos;t have permission to access this page. Please contact
          an administrator if you believe this is a mistake.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            Back to Login
          </Link>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* CSS Keyframes for gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
