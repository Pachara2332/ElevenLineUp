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

// Shorten position name - รองรับทุกตำแหน่งในโลกฟุตบอล
const shortenPosition = (position: string | undefined): string => {
  if (!position) return "?";
  const pos = position.toUpperCase();
  if (pos.length <= 3) return pos;

  const posMap: Record<string, string> = {
    // Goalkeeper
    GOALKEEPER: "GK",
    
    // Defenders
    "CENTRE-BACK": "CB",
    "CENTER-BACK": "CB",
    "LEFT-BACK": "LB",
    "RIGHT-BACK": "RB",
    "LEFT CENTRE-BACK": "LCB",
    "RIGHT CENTRE-BACK": "RCB",
    "LEFT WING-BACK": "LWB",
    "RIGHT WING-BACK": "RWB",
    "WING-BACK": "WB",
    SWEEPER: "SW",
    LIBERO: "SW",
    
    // Midfielders
    "DEFENSIVE MIDFIELD": "CDM",
    "CENTRAL MIDFIELD": "CM",
    "ATTACKING MIDFIELD": "CAM",
    "LEFT MIDFIELD": "LM",
    "RIGHT MIDFIELD": "RM",
    "LEFT CENTRAL MIDFIELD": "LCM",
    "RIGHT CENTRAL MIDFIELD": "RCM",
    "LEFT ATTACKING MIDFIELD": "LAM",
    "RIGHT ATTACKING MIDFIELD": "RAM",
    "CENTRE MIDFIELD": "CM",
    "CENTER MIDFIELD": "CM",
    
    // Forwards
    "CENTRE-FORWARD": "CF",
    "CENTER-FORWARD": "CF",
    STRIKER: "ST",
    "LEFT WINGER": "LW",
    "RIGHT WINGER": "RW",
    "LEFT FORWARD": "LF",
    "RIGHT FORWARD": "RF",
    "LEFT STRIKER": "LS",
    "RIGHT STRIKER": "RS",
    "SECOND STRIKER": "SS",
    "INSIDE FORWARD": "IF",
    "INSIDE LEFT": "IL",
    "INSIDE RIGHT": "IR",
  };

  if (posMap[pos]) return posMap[pos];
  for (const [key, val] of Object.entries(posMap)) {
    if (pos.includes(key)) return val;
  }
  return pos.slice(0, 3);
};

// Get position color based on category - รองรับทุกตำแหน่งในโลกฟุตบอล
const getPositionColor = (position: string | undefined): string => {
  if (!position) return "#10b981"; // default green
  
  const pos = position.toUpperCase();
  
  // GK - Yellow (#cda20b)
  if (
    pos === "GK" || 
    pos.includes("GOAL") || 
    pos.includes("KEEPER")
  ) {
    return "#cda20b";
  }
  
  // Defenders - Blue (#1e4ca8)
  if (
    pos === "LB" || pos === "CB" || pos === "RB" || 
    pos === "LCB" || pos === "RCB" || 
    pos === "LWB" || pos === "RWB" || pos === "WB" ||
    pos === "SW" || // Sweeper/Libero
    pos.includes("BACK") || 
    pos.includes("DEFENCE") ||
    pos.includes("DEFENSE") ||
    pos.includes("SWEEPER") ||
    pos.includes("LIBERO")
  ) {
    return "#1e4ca8";
  }
  
  // Forwards - Red (#af1616)
  if (
    pos === "ST" || pos === "CF" || 
    pos === "LW" || pos === "RW" ||
    pos === "LF" || pos === "RF" || 
    pos === "LS" || pos === "RS" || 
    pos === "SS" || // Second Striker
    pos === "IF" || // Inside Forward
    pos === "IL" || pos === "IR" || // Inside Left/Right
    pos.includes("FORWARD") || 
    pos.includes("STRIKER") || 
    pos.includes("WINGER")
  ) {
    return "#af1616";
  }
  
  // Midfielders - Green (#10b981) - default
  // CDM, CM, CAM, LCM, RCM, LM, RM, LAM, RAM
  return "#10b981";
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
  const posColor = getPositionColor(player.position);

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
        <span 
          className="text-white text-[10px] font-bold px-2 py-1 rounded"
          style={{ backgroundColor: posColor }}
        >
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
