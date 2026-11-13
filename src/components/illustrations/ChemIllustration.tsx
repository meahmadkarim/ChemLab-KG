import React from "react";
import type { IllustrationVariant } from "@/features/experiments/types";

interface ChemIllustrationProps {
  variant: IllustrationVariant;
  slug?: string;
  className?: string;
}

/**
 * Brilliant.org-inspired scientific vector illustrations using the calm
 * ChemLab KG color system:
 * Deep Navy (#142D40), Teal (#087F8C), Warm Amber (#F2B544), Muted Coral (#E89A87),
 * Soft Peach (#F7DED0), Soft Lavender (#EAE3F5), Soft Sage (#DCE9DF), Soft Blue (#DCECF6).
 */
export function ChemIllustration({
  variant,
  slug,
  className = "w-full h-full",
}: ChemIllustrationProps) {
  if (slug === "daniel-galvanic-cell-copper-zinc-lemon") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCECF6" />
        <circle cx="140" cy="82" r="68" fill="#FFFFFF" fillOpacity="0.45" />
        {/* Wire & Voltmeter Bridge */}
        <path d="M86 48V24H194V48" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="140" cy="24" r="14" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <text x="140" y="28" textAnchor="middle" fill="#142D40" fontSize="10" fontWeight="800">1.1V</text>
        {/* Salt Bridge */}
        <path d="M114 76V52C114 46 120 42 126 42H154C160 42 166 46 166 52V76" stroke="#142D40" strokeWidth="8" strokeLinecap="round" />
        <path d="M114 76V52C114 46 120 42 126 42H154C160 42 166 46 166 52V76" stroke="#EAE3F5" strokeWidth="4" strokeLinecap="round" />
        {/* Left Half-Cell (Zn) */}
        <rect x="56" y="58" width="68" height="80" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="59" y="80" width="62" height="55" rx="7" fill="#DCE9DF" />
        <rect x="78" y="46" width="16" height="72" rx="4" fill="#536574" stroke="#142D40" strokeWidth="2" />
        <text x="86" y="130" textAnchor="middle" fill="#142D40" fontSize="10" fontWeight="700">Zn</text>
        {/* Right Half-Cell (Cu) */}
        <rect x="156" y="58" width="68" height="80" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="159" y="80" width="62" height="55" rx="7" fill="#087F8C" fillOpacity="0.3" />
        <rect x="186" y="46" width="16" height="72" rx="4" fill="#E89A87" stroke="#142D40" strokeWidth="2" />
        <text x="194" y="130" textAnchor="middle" fill="#142D40" fontSize="10" fontWeight="700">Cu</text>
      </svg>
    );
  }

  if (slug === "electrolysis-copper-chloride-ki-starch") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#EAE3F5" />
        <circle cx="140" cy="82" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* U-Tube Body */}
        <path
          d="M88 32V98C88 122 108 138 140 138C172 138 192 122 192 98V32"
          stroke="#142D40"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path
          d="M88 32V98C88 122 108 138 140 138C172 138 192 122 192 98V32"
          stroke="#FFFFFF"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Left Anode Arm (Amber/Brown I2) */}
        <path d="M88 54V96C88 112 98 124 116 130" stroke="#F2B544" strokeWidth="20" strokeLinecap="round" />
        {/* Right Cathode Arm (Coral/Pink OH-) */}
        <path d="M192 54V96C192 112 182 124 164 130" stroke="#E89A87" strokeWidth="20" strokeLinecap="round" />
        {/* Electrodes */}
        <rect x="83" y="16" width="10" height="46" rx="3" fill="#142D40" />
        <rect x="187" y="16" width="10" height="46" rx="3" fill="#142D40" />
        <text x="88" y="84" textAnchor="middle" fill="#142D40" fontSize="10" fontWeight="800">I₂</text>
        <text x="192" y="84" textAnchor="middle" fill="#142D40" fontSize="10" fontWeight="800">H₂</text>
      </svg>
    );
  }

  if (slug === "acid-base-titration-phenolphthalein") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#F7DED0" />
        <circle cx="140" cy="84" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* Burette Tip at Top */}
        <rect x="133" y="8" width="14" height="36" rx="3" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.3" />
        <line x1="126" y1="30" x2="154" y2="30" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="140" cy="54" r="4.5" fill="#E89A87" />
        {/* Conical Flask Below */}
        <path d="M124 68H156L182 132C184 138 179 144 172 144H108C101 144 96 138 98 132L124 68Z" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <path d="M106 108H174L180 131C181 136 177 141 171 141H109C103 141 99 136 100 131L106 108Z" fill="#E89A87" fillOpacity="0.65" />
      </svg>
    );
  }

  if (slug === "universal-indicator-ph-column") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#EAE3F5" />
        <circle cx="140" cy="80" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* Tall Graduated Cylinder */}
        <rect x="114" y="16" width="52" height="126" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="118" y="28" width="44" height="26" fill="#E89A87" />
        <rect x="118" y="54" width="44" height="26" fill="#F2B544" />
        <rect x="118" y="80" width="44" height="26" fill="#087F8C" fillOpacity="0.75" />
        <rect x="118" y="106" width="44" height="32" rx="6" fill="#142D40" fillOpacity="0.85" />
        <rect x="102" y="140" width="76" height="6" rx="3" fill="#142D40" />
      </svg>
    );
  }

  if (slug === "iodine-clock-reaction-kinetics") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCECF6" />
        <circle cx="140" cy="80" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* Clear Beaker Left -> Dark Blue Beaker Right */}
        <rect x="58" y="42" width="64" height="86" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="62" y="68" width="56" height="56" rx="7" fill="#DCECF6" />
        <path d="M132 84H148M144 79L150 84L144 89" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="158" y="42" width="64" height="86" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="162" y="68" width="56" height="56" rx="7" fill="#142D40" />
        <circle cx="190" cy="30" r="11" fill="#F2B544" stroke="#142D40" strokeWidth="2" />
      </svg>
    );
  }

  if (slug === "golden-rain-lead-iodide-precipitation") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#F7DED0" />
        <circle cx="140" cy="82" r="64" fill="#FFFFFF" fillOpacity="0.55" />
        <rect x="92" y="22" width="96" height="118" rx="14" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="96" y="46" width="88" height="90" rx="10" fill="#142D40" fillOpacity="0.08" />
        {/* Shimmering Golden Hexagonal Flakes */}
        <circle cx="122" cy="64" r="6" fill="#F2B544" stroke="#142D40" strokeWidth="1.8" />
        <circle cx="156" cy="74" r="7" fill="#F2B544" stroke="#142D40" strokeWidth="1.8" />
        <circle cx="134" cy="96" r="6.5" fill="#F2B544" stroke="#142D40" strokeWidth="1.8" />
        <circle cx="160" cy="112" r="5.5" fill="#F2B544" stroke="#142D40" strokeWidth="1.8" />
        <circle cx="118" cy="116" r="6" fill="#F2B544" stroke="#142D40" strokeWidth="1.8" />
      </svg>
    );
  }

  if (slug === "silver-tree-copper-silver-nitrate") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCE9DF" />
        <circle cx="140" cy="82" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        <rect x="94" y="20" width="92" height="120" rx="14" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="98" y="48" width="84" height="88" rx="10" fill="#087F8C" fillOpacity="0.22" />
        {/* Branching Silver Crystal Tree */}
        <line x1="140" y1="36" x2="140" y2="124" stroke="#142D40" strokeWidth="3" strokeLinecap="round" />
        <line x1="140" y1="64" x2="118" y2="50" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="140" y1="64" x2="162" y2="50" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="140" y1="88" x2="112" y2="74" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="140" y1="88" x2="168" y2="74" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="140" y1="110" x2="116" y2="96" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="140" y1="110" x2="164" y2="96" stroke="#142D40" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug === "supersaturated-sodium-acetate-hot-ice") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCECF6" />
        <circle cx="140" cy="82" r="64" fill="#FFFFFF" fillOpacity="0.55" />
        {/* Radiating Crystal Spire */}
        <polygon points="140,22 172,126 108,126" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <polygon points="116,56 144,126 92,126" fill="#DCE9DF" stroke="#142D40" strokeWidth="2.2" />
        <polygon points="164,52 188,126 136,126" fill="#EAE3F5" stroke="#142D40" strokeWidth="2.2" />
        <rect x="76" y="126" width="128" height="10" rx="5" fill="#142D40" />
      </svg>
    );
  }

  if (slug === "filtration-evaporation-sand-salt-mixture") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCE9DF" />
        <circle cx="140" cy="80" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* Filter Funnel */}
        <polygon points="104,26 176,26 146,72 134,72" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <path d="M116 44H164L146 70H134L116 44Z" fill="#F2B544" fillOpacity="0.65" />
        <rect x="135" y="72" width="10" height="22" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.2" />
        {/* Collecting Beaker */}
        <rect x="104" y="86" width="72" height="54" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="108" y="110" width="64" height="26" rx="6" fill="#087F8C" fillOpacity="0.35" />
      </svg>
    );
  }

  if (slug === "simple-distillation-colored-salt-water") {
    return (
      <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
        <rect width="280" height="160" fill="#DCECF6" />
        <circle cx="140" cy="80" r="64" fill="#FFFFFF" fillOpacity="0.5" />
        {/* Boiling Flask Left */}
        <circle cx="92" cy="104" r="30" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <path d="M66 108H118C116 122 105 131 92 131C79 131 68 122 66 108Z" fill="#E89A87" />
        <rect x="84" y="48" width="16" height="30" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        {/* Condenser Tube */}
        <line x1="100" y1="56" x2="184" y2="92" stroke="#142D40" strokeWidth="10" strokeLinecap="round" />
        <line x1="100" y1="56" x2="184" y2="92" stroke="#DCE9DF" strokeWidth="5" strokeLinecap="round" />
        {/* Receiving Beaker Right */}
        <rect x="172" y="92" width="46" height="44" rx="8" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
        <rect x="176" y="114" width="38" height="18" rx="4" fill="#087F8C" fillOpacity="0.45" />
      </svg>
    );
  }

  switch (variant) {
    case "indicator-flask":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#EAE3F5" />
          <circle cx="140" cy="80" r="68" fill="#FFFFFF" fillOpacity="0.45" />
          <line x1="36" y1="138" x2="244" y2="138" stroke="#142D40" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
          {/* Acidic Tube (Coral) */}
          <g transform="translate(56, 24)">
            <rect x="0" y="8" width="34" height="96" rx="17" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
            <path d="M3 52H31V87C31 95 25 101 17 101C9 101 3 95 3 87V52Z" fill="#E89A87" />
            <rect x="-4" y="4" width="42" height="6" rx="3" fill="#142D40" />
          </g>
          {/* Neutral Tube (Amber) */}
          <g transform="translate(123, 16)">
            <rect x="0" y="8" width="34" height="104" rx="17" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
            <path d="M3 46H31V95C31 103 25 109 17 109C9 109 3 103 3 95V46Z" fill="#F2B544" />
            <rect x="-4" y="4" width="42" height="6" rx="3" fill="#142D40" />
          </g>
          {/* Alkaline Tube (Teal) */}
          <g transform="translate(190, 24)">
            <rect x="0" y="8" width="34" height="96" rx="17" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
            <path d="M3 52H31V87C31 95 25 101 17 101C9 101 3 95 3 87V52Z" fill="#087F8C" />
            <rect x="-4" y="4" width="42" height="6" rx="3" fill="#142D40" />
          </g>
        </svg>
      );

    case "peroxide-foam":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#F7DED0" />
          <circle cx="140" cy="82" r="66" fill="#FFFFFF" fillOpacity="0.45" />
          <circle cx="140" cy="30" r="22" fill="#F2B544" stroke="#142D40" strokeWidth="2.4" />
          <circle cx="115" cy="42" r="16" fill="#E89A87" stroke="#142D40" strokeWidth="2.2" />
          <circle cx="165" cy="42" r="16" fill="#F2B544" stroke="#142D40" strokeWidth="2.2" />
          <path d="M122 52H158L186 130C188 136 183 142 175 142H105C97 142 92 136 94 130L122 52Z" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <path d="M103 104H177L184 129C185 134 181 139 175 139H105C99 139 95 134 96 129L103 104Z" fill="#087F8C" />
        </svg>
      );

    case "electrolysis-tubes":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#DCECF6" />
          <circle cx="140" cy="84" r="68" fill="#FFFFFF" fillOpacity="0.45" />
          <rect x="64" y="50" width="152" height="92" rx="12" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <rect x="67" y="74" width="146" height="65" rx="9" fill="#DCE9DF" />
          <rect x="92" y="18" width="38" height="102" rx="19" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <rect x="95" y="64" width="32" height="53" rx="6" fill="#087F8C" fillOpacity="0.8" />
          <text x="111" y="45" textAnchor="middle" fill="#142D40" fontSize="11" fontWeight="800">2 H₂</text>
          <rect x="150" y="18" width="38" height="102" rx="19" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <rect x="153" y="44" width="32" height="73" rx="6" fill="#F2B544" fillOpacity="0.85" />
          <text x="169" y="36" textAnchor="middle" fill="#142D40" fontSize="11" fontWeight="800">1 O₂</text>
        </svg>
      );

    case "copper-displacement":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#DCE9DF" />
          <circle cx="140" cy="82" r="64" fill="#FFFFFF" fillOpacity="0.45" />
          <rect x="88" y="20" width="104" height="120" rx="14" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <rect x="91" y="56" width="98" height="81" rx="11" fill="#087F8C" fillOpacity="0.4" />
          <line x1="115" y1="32" x2="162" y2="124" stroke="#536574" strokeWidth="8.5" strokeLinecap="round" />
          <line x1="131" y1="64" x2="162" y2="124" stroke="#E89A87" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );

    case "crystal-lattice":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#DCE9DF" />
          <circle cx="140" cy="80" r="64" fill="#FFFFFF" fillOpacity="0.45" />
          <polygon points="140,20 200,56 178,132 102,132 80,56" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <polygon points="140,36 180,64 166,118 114,118 100,64" fill="#087F8C" fillOpacity="0.75" stroke="#142D40" strokeWidth="2" />
        </svg>
      );

    case "chromatography-strip":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#EAE3F5" />
          <circle cx="140" cy="80" r="62" fill="#FFFFFF" fillOpacity="0.45" />
          <rect x="94" y="16" width="92" height="128" rx="10" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <line x1="104" y1="118" x2="176" y2="118" stroke="#142D40" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="140" cy="96" r="11" fill="#E89A87" />
          <circle cx="140" cy="68" r="12" fill="#F2B544" />
          <circle cx="140" cy="40" r="10" fill="#087F8C" />
        </svg>
      );

    case "flame-spectrum":
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#F7DED0" />
          <circle cx="140" cy="82" r="66" fill="#FFFFFF" fillOpacity="0.45" />
          <path d="M74 114C74 86 90 62 90 34C90 62 106 86 106 114C106 124 99 132 90 132C81 132 74 124 74 114Z" fill="#E89A87" stroke="#142D40" strokeWidth="2.2" />
          <path d="M124 114C124 82 140 52 140 24C140 52 156 82 156 114C156 124 149 132 140 132C131 132 124 124 124 114Z" fill="#F2B544" stroke="#142D40" strokeWidth="2.2" />
          <path d="M174 114C174 86 190 62 190 34C190 62 206 86 206 114C206 124 199 132 190 132C181 132 174 124 174 114Z" fill="#087F8C" stroke="#142D40" strokeWidth="2.2" />
          <text x="90" y="148" textAnchor="middle" fill="#142D40" fontSize="11" fontWeight="800">Li⁺</text>
          <text x="140" y="148" textAnchor="middle" fill="#142D40" fontSize="11" fontWeight="800">Na⁺</text>
          <text x="190" y="148" textAnchor="middle" fill="#142D40" fontSize="11" fontWeight="800">Cu²⁺</text>
        </svg>
      );

    case "gas-splint":
    default:
      return (
        <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
          <rect width="280" height="160" fill="#DCECF6" />
          <circle cx="140" cy="84" r="60" fill="#FFFFFF" fillOpacity="0.45" />
          <rect x="112" y="26" width="56" height="112" rx="28" fill="#FFFFFF" stroke="#142D40" strokeWidth="2.5" />
          <path d="M115 82H165V110C165 125 154 135 140 135C126 135 115 125 115 110V82Z" fill="#087F8C" fillOpacity="0.75" />
          <circle cx="140" cy="56" r="7.5" fill="#F2B544" stroke="#142D40" strokeWidth="2" />
        </svg>
      );
  }
}
