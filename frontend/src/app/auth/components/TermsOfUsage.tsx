'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function InfoModal({ isOpen, onClose, onAccept }: ModalProps) {
  const [agreed, setAgreed] = useState(false);

  // Reset checkbox state whenever modal opens
  useEffect(() => {
    if (isOpen) setAgreed(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header with Close Icon */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl md:text-2xl font-bold">
                Terms of Use & Privacy Policy
              </h2>
              <button
                onClick={onClose}
                className="hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-600 leading-relaxed">
              <div className="overflow-y-auto pr-4 text-sm text-gray-700 leading-relaxed custom-scrollbar">
                <div className="space-y-4">
                  <p>
                    <strong>1. Acceptance of Terms:</strong> By creating an
                    account, you agree to follow our guidelines regarding the
                    use of our cheat sheets and practice problems.
                  </p>
                  <p>
                    <strong>2. Intellectual Property:</strong> All content,
                    including the 70+ technical problems and solutions, are the
                    property of this platform. You may use them for personal
                    study but may not redistribute them for commercial gain.
                  </p>
                  <p>
                    <strong>3. User Conduct:</strong> You agree not to attempt
                    to scrape data or reverse-engineer the platform&apos;s API.
                  </p>
                  <p>
                    <strong>4. Disclaimer:</strong> Materials are provided
                    &quot;as-is.&quot; While we strive for accuracy in our solutions, we
                    are not liable for errors in technical content.
                  </p>
                </div>
                ) : (
                <div className="space-y-4">
                  <p>
                    <strong>1. Data Collection:</strong> We collect your name
                    and email to personalize your learning experience and track
                    your progress through the problem sets.
                  </p>
                  <p>
                    <strong>2. Usage Tracking:</strong> We may track which
                    problems you complete to improve our cheat sheet
                    recommendations.
                  </p>
                  <p>
                    <strong>3. Security:</strong> Your password is encrypted. We
                    do not sell your personal data to third parties.
                  </p>
                  <p>
                    <strong>4. Cookies:</strong> We use essential cookies to
                    keep you signed in and maintain your session.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Checkbox and Action */}
            <div className="p-6 border-t bg-gray-50">
              <label className="flex items-center space-x-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">
                  I have read and agree to the Terms of Use & Privacy Policy
                </span>
              </label>

              <button
                onClick={onAccept}
                disabled={!agreed}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  agreed
                    ? 'bg-[#141718] text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Accept and Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
