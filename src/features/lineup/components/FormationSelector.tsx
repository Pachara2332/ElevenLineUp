"use client";

import React, { useState } from "react";
import { FORMATION_CATEGORIES } from "../stores/useLineupStore";
import clsx from "clsx";

interface FormationSelectorProps {
  currentFormation: string;
  onSelect: (formation: string) => void;
  onClose: () => void;
}

const categoryColors = {
  "3 กองหลัง": "from-amber-500 to-orange-600",
  "4 กองหลัง": "from-emerald-500 to-teal-600",
  "5 กองหลัง": "from-blue-500 to-indigo-600",
};

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  currentFormation,
  onSelect,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("4 กองหลัง");

  const handleSelect = (formation: string) => {
    onSelect(formation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">เลือกแผนการเล่น</h2>
              <p className="text-emerald-100 text-sm mt-1">
                แผนปัจจุบัน:{" "}
                <span className="font-bold">{currentFormation}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-200">
          {Object.keys(FORMATION_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                "flex-1 py-4 px-4 font-bold text-sm transition-all relative",
                selectedCategory === category
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              {category}
              {selectedCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Formation Grid */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {FORMATION_CATEGORIES[
              selectedCategory as keyof typeof FORMATION_CATEGORIES
            ].map((formation) => (
              <button
                key={formation}
                onClick={() => handleSelect(formation)}
                className={clsx(
                  "relative p-4 rounded-2xl border-2 font-bold text-center transition-all hover:scale-105",
                  currentFormation === formation
                    ? `bg-gradient-to-br ${categoryColors[selectedCategory as keyof typeof categoryColors]} text-white border-transparent shadow-lg`
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50",
                )}
              >
                <span className="text-lg">{formation}</span>
                {currentFormation === formation && (
                  <span className="absolute top-1 right-1 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500">
          คลิกที่แผนเพื่อเลือก • ตำแหน่งจะเปลี่ยนแบบ smooth
        </div>
      </div>
    </div>
  );
};
