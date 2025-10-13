import React, { useEffect } from 'react';
import IconProvider from 'components/icons/IconProvider';
import { animations } from 'utils/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
}

const sizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4 md:mx-8'
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  loading = false
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-40
          ${animations.fade.enter}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container with flex layout */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
          {/* Modal content with slide-up animation on mobile, scale on desktop */}
          <div
            className={`
              relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800
              w-full shadow-xl transition-all
              sm:my-8
              ${sizeClasses[size]}
              ${animations.scale.enter}
              sm:${animations.scale.enter}
            `}
          >
            {/* Header */}
            <div className="px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate pr-4">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <IconProvider name="close" size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className={`h-8 w-8 border-b-2 border-blue-500 ${animations.loading.spin}`} />
                </div>
              ) : (
                children
              )}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                  {footer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;