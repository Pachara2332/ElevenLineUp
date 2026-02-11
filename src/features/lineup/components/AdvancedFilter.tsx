"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface FilterState {
  search: string;
  season: string;
  birthYearFrom: string;
  birthYearTo: string;
  heightFrom: string;
  heightTo: string;
  preferredFoot: string;
}

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterState) => void;
  seasons: string[];
}

const initialFilters: FilterState = {
  search: "",
  season: "",
  birthYearFrom: "",
  birthYearTo: "",
  heightFrom: "",
  heightTo: "",
  preferredFoot: "",
};

// Searchable Dropdown Component
const SearchableDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (opt: string) => {
    onChange(opt);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="text-xs text-emerald-600 font-medium mb-1 block">
        {label}
      </label>
      <div
        className="w-full px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-emerald-900" : "text-emerald-400"}>
          {value || placeholder}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-emerald-200 shadow-lg z-50 max-h-48 overflow-hidden">
          <div className="p-2 border-b border-emerald-100">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-32 overflow-y-auto">
            <div
              className="px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 cursor-pointer"
              onClick={() => handleSelect("")}
            >
              {placeholder}
            </div>
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  value === opt
                    ? "bg-emerald-500 text-white"
                    : "text-emerald-900 hover:bg-emerald-50"
                }`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-emerald-400 italic">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdvancedFilter({
  onFilterChange,
  seasons = [],
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== false,
  );

  return (
    <div className="relative">
      {/* Search + Filter Toggle Button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          <input
            type="text"
            placeholder="Search player..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg transition-all relative ${
            isOpen || hasActiveFilters
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          }`}
          title="Advanced Filters"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          {hasActiveFilters && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* Advanced Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-emerald-200 shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-900 font-bold text-sm">
              Advanced Filters
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-400 hover:text-emerald-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Season - Searchable Dropdown */}
            <SearchableDropdown
              value={filters.season}
              onChange={(val) => handleChange("season", val)}
              options={seasons}
              placeholder="All Seasons"
              label="Season"
            />

            {/* Birth Year Range */}
            <div>
              <label className="text-xs text-emerald-600 font-medium mb-1 block">
                Birth Year
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.birthYearFrom}
                  onChange={(e) =>
                    handleChange("birthYearFrom", e.target.value)
                  }
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="1960"
                  max="2010"
                />
                <span className="text-emerald-400">-</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.birthYearTo}
                  onChange={(e) => handleChange("birthYearTo", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="1960"
                  max="2010"
                />
              </div>
              <p className="text-[10px] text-emerald-500 mt-1 italic">
                Leave empty to show all years
              </p>
            </div>

            {/* Height Range */}
            <div>
              <label className="text-xs text-emerald-600 font-medium mb-1 block">
                Height (cm)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.heightFrom}
                  onChange={(e) => handleChange("heightFrom", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="150"
                  max="220"
                />
                <span className="text-emerald-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.heightTo}
                  onChange={(e) => handleChange("heightTo", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="150"
                  max="220"
                />
              </div>
              <p className="text-[10px] text-emerald-500 mt-1 italic">
                Leave empty to show all heights
              </p>
            </div>

            {/* Preferred Foot */}
            <div>
              <label className="text-xs text-emerald-600 font-medium mb-1 block">
                Preferred Foot
              </label>
              <div className="flex gap-2">
                {["", "Left", "Right", "Both"].map((foot) => (
                  <button
                    key={foot}
                    onClick={() => handleChange("preferredFoot", foot)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.preferredFoot === foot
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {foot || "All"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium text-sm hover:bg-red-100 transition"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
