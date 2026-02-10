"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Player } from "@/types";

interface DraggablePlayerProps {
  player: Player;
}

// Map country name to ISO country code for flag API
const countryToCode: Record<string, string> = {
  England: "gb-eng",
  Scotland: "gb-sct",
  Wales: "gb-wls",
  "Northern Ireland": "gb-nir",
  Ireland: "ie",
  France: "fr",
  Germany: "de",
  Spain: "es",
  Italy: "it",
  Portugal: "pt",
  Netherlands: "nl",
  Belgium: "be",
  Brazil: "br",
  Argentina: "ar",
  Uruguay: "uy",
  Colombia: "co",
  Chile: "cl",
  Mexico: "mx",
  "United States": "us",
  USA: "us",
  Canada: "ca",
  Japan: "jp",
  "South Korea": "kr",
  "Korea Republic": "kr",
  Australia: "au",
  Nigeria: "ng",
  Senegal: "sn",
  Morocco: "ma",
  Egypt: "eg",
  Ghana: "gh",
  "Ivory Coast": "ci",
  Cameroon: "cm",
  "South Africa": "za",
  Croatia: "hr",
  Serbia: "rs",
  Poland: "pl",
  "Czech Republic": "cz",
  Austria: "at",
  Switzerland: "ch",
  Sweden: "se",
  Norway: "no",
  Denmark: "dk",
  Finland: "fi",
  Iceland: "is",
  Greece: "gr",
  Turkey: "tr",
  Russia: "ru",
  Ukraine: "ua",
  Romania: "ro",
  Hungary: "hu",
  Slovakia: "sk",
  Slovenia: "si",
  Albania: "al",
  "Bosnia and Herzegovina": "ba",
  Montenegro: "me",
  "North Macedonia": "mk",
  Jamaica: "jm",
  "DR Congo": "cd",
  Mali: "ml",
  Tunisia: "tn",
  Algeria: "dz",
  Zimbabwe: "zw",
  Paraguay: "py",
  Ecuador: "ec",
  Venezuela: "ve",
  Peru: "pe",
  "Costa Rica": "cr",
  Honduras: "hn",
  Panama: "pa",
  China: "cn",
  Thailand: "th",
  Vietnam: "vn",
  Indonesia: "id",
  Malaysia: "my",
  Singapore: "sg",
  India: "in",
  Iran: "ir",
  "Saudi Arabia": "sa",
  Qatar: "qa",
  UAE: "ae",
  Israel: "il",
  Georgia: "ge",
  Bulgaria: "bg",
  Cyprus: "cy",
  "New Zealand": "nz",
  Kosovo: "xk",
  Gabon: "ga",
  Guinea: "gn",
  Gambia: "gm",
  "Burkina Faso": "bf",
  Angola: "ao",
  Zambia: "zm",
  Congo: "cg",
  "Cape Verde": "cv",
  Curacao: "cw",
  Curaçao: "cw",
  Haiti: "ht",
  Cuba: "cu",
};

const getCountryCode = (nationality: string | undefined): string => {
  if (!nationality) return "un";
  if (countryToCode[nationality]) return countryToCode[nationality];
  const found = Object.keys(countryToCode).find(
    (key) =>
      nationality.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(nationality.toLowerCase()),
  );
  return found ? countryToCode[found] : "un";
};

// Shorten position name
const shortenPosition = (position: string | undefined): string => {
  if (!position) return "?";
  const pos = position.toUpperCase();
  if (pos.length <= 3) return pos;

  const posMap: Record<string, string> = {
    GOALKEEPER: "GK",
    "CENTRE-BACK": "CB",
    "LEFT-BACK": "LB",
    "RIGHT-BACK": "RB",
    "LEFT MIDFIELD": "LM",
    "RIGHT MIDFIELD": "RM",
    "CENTRAL MIDFIELD": "CM",
    "DEFENSIVE MIDFIELD": "CDM",
    "ATTACKING MIDFIELD": "CAM",
    "LEFT WINGER": "LW",
    "RIGHT WINGER": "RW",
    "CENTRE-FORWARD": "CF",
    "SECOND STRIKER": "SS",
  };

  if (posMap[pos]) return posMap[pos];
  for (const [key, val] of Object.entries(posMap)) {
    if (pos.includes(key)) return val;
  }
  return pos.slice(0, 3);
};

export const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: player,
  });

  const displayName =
    player.name
      ?.replace(/\s*\(\d+\)$/, "")
      .split(" ")
      .slice(-1)[0] || "Unknown";
  const countryCode = getCountryCode(player.nationality);
  const shortPos = shortenPosition(player.position);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        relative
        flex items-center p-2 gap-3 rounded-2xl cursor-grab active:cursor-grabbing
        bg-gradient-to-br from-slate-800 to-slate-900
        border border-slate-600/50 hover:border-emerald-400/50
        transition-all shadow-lg hover:shadow-emerald-500/20
        ${isDragging ? "opacity-50 scale-95 z-0" : "hover:scale-[1.02] hover:z-50"}
      `}
    >
      {/* Avatar - same style as pitch slot */}
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-700 ring-2 ring-emerald-500/50 flex-shrink-0">
        {player.image && !player.image.includes("default.jpg") ? (
          <img
            src={player.image}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
            {displayName.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{displayName}</p>
      </div>

      {/* Position + Flag */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
          {shortPos}
        </span>
        <div
          className="w-6 h-4 rounded-sm overflow-hidden shadow"
          title={player.nationality || "Unknown"}
        >
          <img
            src={`https://flagcdn.com/w40/${countryCode}.png`}
            alt={player.nationality || ""}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://flagcdn.com/w40/un.png";
            }}
          />
        </div>
      </div>
    </div>
  );
};
