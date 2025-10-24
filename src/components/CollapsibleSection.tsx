"use client";

import { useState, useCallback, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen();
    }
  }, [toggleOpen]);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      <div
        id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
