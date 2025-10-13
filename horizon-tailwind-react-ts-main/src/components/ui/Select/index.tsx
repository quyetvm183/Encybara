import React, { useState, useRef, useEffect } from 'react';
import IconProvider from 'components/icons/IconProvider';
import { animations } from 'utils/animations';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  fullWidth = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile] = useState(window.innerWidth < 640);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      // On mobile, prevent body scroll when dropdown is open
      if (isMobile) {
        document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
      }
    }
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    if (isMobile) {
      document.body.style.overflow = 'unset';
    }
  };

  const containerClasses = `
    relative
    ${fullWidth ? 'w-full' : 'w-auto'}
  `;

  const triggerClasses = `
    px-4 py-2.5
    bg-white dark:bg-gray-800
    border rounded-md
    text-left
    transition-colors duration-200
    flex items-center justify-between
    ${disabled
      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
      : 'hover:border-blue-500 cursor-pointer'
    }
    ${error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-600'
    }
  `;

  const dropdownClasses = `
    ${isMobile
      ? 'fixed inset-x-0 bottom-0 max-h-[70vh] rounded-t-xl'
      : 'absolute z-50 w-full mt-1 max-h-60 rounded-md'
    }
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    shadow-lg
    overflow-auto
    ${animations.fade.enter}
  `;

  const renderMobileHeader = () => {
    if (!isMobile) return null;
    return (
      <div className="sticky top-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-base font-medium text-gray-900 dark:text-white">
              {label}
            </span>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <IconProvider name="close" size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses} ref={selectRef}>
      {label && !isMobile && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={triggerClasses}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IconProvider
          name={isOpen ? 'chevronUp' : 'chevronDown'}
          size={20}
          className={`transition-transform ${disabled ? 'text-gray-400' : ''}`}
        />
      </div>

      {isOpen && (
        <div className={dropdownClasses}>
          {renderMobileHeader()}
          <ul
            className="py-1"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer
                  ${option.value === value
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                    : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;