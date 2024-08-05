import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FailureModal: React.FC<FailureModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const currentModal = modalRef.current;
      if (currentModal) {
        currentModal.focus();
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Return focus to the previous element
    document.activeElement?.blur();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      aria-live="assertive"
      aria-modal="true"
      role="dialog"
      aria-labelledby="failure-modal-title"
      aria-describedby="failure-modal-description"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 p-6 rounded-lg max-w-lg w-full relative border-2 border-gray-600"
        role="document"
        tabIndex={-1} // Allow focusing
      >
        <motion.button
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </motion.button>
        <h2 id="failure-modal-title" className="text-2xl font-bold mb-4 text-white">
          Transaction Failed
        </h2>
        <p id="failure-modal-description" className="text-white">
          Your transaction could not be completed. Please try again.
        </p>
      </div>
    </div>
  );
};

export default FailureModal;
