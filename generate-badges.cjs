#!/usr/bin/env node

/**
 * 🎨 Générateur automatique de 42 badges Arenia (SVG)
 *
 * Pas de dépendances natives requises!
 * Génère des SVG que tu peux convertir en PNG avec ImageMagick ou en ligne
 *
 * Usage: node generate-badges.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');

// Couleurs par rareté
const RARITIES = {
  common: {
    gradient: ['#A0AEC0', '#718096'],
    glow: '#A0AEC0',
  },
  rare: {
    gradient: ['#63B3ED', '#3182CE'],
    glow: '#4299E1',
  },
  epic: {
    gradient: ['#B794F4', '#805AD5'],
    glow: '#9F7AEA',
  },
  legendary: {
    gradient: ['#FFD700', '#FFA500'],
    glow: '#FFD700',
  },
};

// Liste complète des 42 badges
const BADGES = [
  // Performance (8)
  { id: 'champion', name: 'Champion', emoji: '🏆', rarity: 'legendary' },
  { id: 'runner_up', name: 'Runner-up', emoji: '🥈', rarity: 'rare' },
  { id: 'podium_finisher', name: 'Podium Finisher', emoji: '🥉', rarity: 'rare' },
  { id: 'top_tier', name: 'Top Tier', emoji: '🔝', rarity: 'epic' },
  { id: 'elite_player', name: 'Elite Player', emoji: '💎', rarity: 'epic' },
  { id: 'rising_star', name: 'Rising Star', emoji: '⭐', rarity: 'rare' },
  { id: 'grand_champion', name: 'Grand Champion', emoji: '🏆', rarity: 'legendary' },
  { id: 'arenia_legend', name: 'Arenia Legend', emoji: '👑', rarity: 'legendary' },

  // Participation (5)
  { id: 'first_blood', name: 'First Blood', emoji: '🎮', rarity: 'common' },
  { id: 'regular_player', name: 'Regular Player', emoji: '🔥', rarity: 'common' },
  { id: 'tournament_veteran', name: 'Tournament Veteran', emoji: '⚡', rarity: 'rare' },
  { id: 'century_club', name: 'Century Club', emoji: '🌟', rarity: 'epic' },
  { id: 'dedicated_competitor', name: 'Dedicated Competitor', emoji: '🎯', rarity: 'rare' },

  // Streak (5)
  { id: 'hot_streak', name: 'Hot Streak', emoji: '🔥', rarity: 'rare' },
  { id: 'unstoppable', name: 'Unstoppable', emoji: '⚡', rarity: 'epic' },
  { id: 'comeback_king', name: 'Comeback King', emoji: '💪', rarity: 'rare' },
  { id: 'perfect_run', name: 'Perfect Run', emoji: '✅', rarity: 'epic' },
  { id: 'night_owl', name: 'Night Owl', emoji: '🌙', rarity: 'common' },

  // PUBG (3)
  { id: 'headhunter_pubg', name: 'Headhunter', emoji: '🎯', rarity: 'rare' },
  { id: 'chicken_dinner', name: 'Chicken Dinner', emoji: '🍗', rarity: 'epic' },
  { id: 'squad_commander', name: 'Squad Commander', emoji: '💣', rarity: 'rare' },

  // eFootball (3)
  { id: 'goal_machine', name: 'Goal Machine', emoji: '⚽', rarity: 'rare' },
  { id: 'clean_sheet', name: 'Clean Sheet', emoji: '🧤', rarity: 'rare' },
  { id: 'hat_trick_hero', name: 'Hat-trick Hero', emoji: '🎩', rarity: 'epic' },

  // COD Mobile (3)
  { id: 'sharpshooter', name: 'Sharpshooter', emoji: '🎯', rarity: 'rare' },
  { id: 'mvp', name: 'MVP', emoji: '💥', rarity: 'epic' },
  { id: 'killstreak_master', name: 'Killstreak Master', emoji: '🔫', rarity: 'epic' },

  // Free Fire (2)
  { id: 'booyah_king', name: 'Booyah King', emoji: '💎', rarity: 'epic' },
  { id: 'hot_drop', name: 'Hot Drop', emoji: '🪂', rarity: 'rare' },

  // Mobile Legends (3)
  { id: 'lord_slayer', name: 'Lord Slayer', emoji: '🐉', rarity: 'epic' },
  { id: 'maniac', name: 'Maniac', emoji: '🦸', rarity: 'epic' },
  { id: 'savage', name: 'Savage', emoji: '👑', rarity: 'legendary' },

  // Organisateur (8)
  { id: 'event_creator', name: 'Event Creator', emoji: '🎪', rarity: 'common' },
  { id: 'tournament_host', name: 'Tournament Host', emoji: '🎭', rarity: 'rare' },
  { id: 'trusted_organizer', name: 'Trusted Organizer', emoji: '🌟', rarity: 'epic' },
  { id: 'elite_host', name: 'Elite Host', emoji: '💎', rarity: 'epic' },
  { id: 'master_organizer', name: 'Master Organizer', emoji: '👑', rarity: 'legendary' },
  { id: 'fast_launch', name: 'Fast Launch', emoji: '⚡', rarity: 'rare' },
  { id: 'fair_play', name: 'Fair Play', emoji: '⚖️', rarity: 'rare' },
  { id: 'prize_distributor', name: 'Prize Distributor', emoji: '💰', rarity: 'epic' },

  // Premium (2)
  { id: 'premium_player', name: 'Premium Player', emoji: '⭐', rarity: 'epic' },
  { id: 'vip', name: 'VIP', emoji: '👑', rarity: 'legendary' },
];

/**
 * Générer SVG d'un badge
 */
function generateBadgeSVG(badge) {
  const size = 256;
  const center = size / 2;
  const radius = size / 2 - 20;
  const colors = RARITIES[badge.rarity];

  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient radial -->
    <radialGradient id="grad_${badge.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${colors.gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.gradient[1]};stop-opacity:1" />
    </radialGradient>

    <!-- Glow filter -->
    <filter id="glow_${badge.id}">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Outer glow -->
  <circle cx="${center}" cy="${center}" r="${radius + 5}"
          fill="${colors.glow}" opacity="0.3" filter="url(#glow_${badge.id})"/>

  <!-- Main circle with gradient -->
  <circle cx="${center}" cy="${center}" r="${radius}"
          fill="url(#grad_${badge.id})"
          stroke="#FFFFFF" stroke-width="8"/>

  <!-- Inner shine -->
  <circle cx="${center - 10}" cy="${center - 10}" r="${radius * 0.6}"
          fill="rgba(255,255,255,0.2)"/>

  <!-- Emoji icon -->
  <text x="${center}" y="${center}"
        font-size="100"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif">
    ${badge.emoji}
  </text>
</svg>`.trim();

  return svg;
}

/**
 * Main
 */
function main() {
  console.log('🎨 Génération des badges Arenia (SVG)...\n');

  // Créer dossier output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Dossier créé: ${OUTPUT_DIR}\n`);
  }

  let successCount = 0;

  // Générer chaque badge
  for (const badge of BADGES) {
    const svg = generateBadgeSVG(badge);
    const filename = `badge_${badge.id}.svg`;
    const filepath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filepath, svg);
    console.log(`✅ ${badge.name.padEnd(25)} → ${filename}`);
    successCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${successCount} badges SVG générés!`);
  console.log(`📁 Dossier: ${OUTPUT_DIR}`);
  console.log('\n💡 Pour convertir en PNG:');
  console.log('   Option 1: https://cloudconvert.com/svg-to-png (en ligne)');
  console.log('   Option 2: for f in output/*.svg; do convert $f ${f%.svg}.png; done');
  console.log('='.repeat(60));
}

main();
