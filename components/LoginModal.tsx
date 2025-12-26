import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
  error?: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  error,
}) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setIsLoading(true);
      onLogin(password);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
        <div
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Server Login</h2>
                <p className="text-xs text-slate-500">
                  Enter password to use server API
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter server password..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs p-3 bg-red-900/20 border border-red-900/30 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isLoading || !password.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Alternative */}
          <p className="text-center text-xs text-slate-500">
            Use your own API key in the sidebar instead
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
