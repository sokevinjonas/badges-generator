#!/usr/bin/env node

/**
 * 🎨 Générateur de badges Arenia avec vraies icônes
 *
 * 1. Télécharge les icônes SVG depuis game-icons.net
 * 2. Génère les badges avec icônes intégrées
 *
 * Usage: node generate-badges-icons.cjs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, 'output');
const ICONS_DIR = path.join(__dirname, 'icons');

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

// Liste des 42 badges avec icônes valides de game-icons.net
const BADGES = [
  // Performance (8)
  { id: 'champion', name: 'Champion', icon: 'podium-winner', rarity: 'legendary' },
  { id: 'runner_up', name: 'Runner-up', icon: 'podium-second', rarity: 'rare' },
  { id: 'podium_finisher', name: 'Podium Finisher', icon: 'podium-third', rarity: 'rare' },
  { id: 'top_tier', name: 'Top Tier', icon: 'rank-3', rarity: 'epic' },
  { id: 'elite_player', name: 'Elite Player', icon: 'cut-diamond', rarity: 'epic' },
  { id: 'rising_star', name: 'Rising Star', icon: 'shooting-star', rarity: 'rare' },
  { id: 'grand_champion', name: 'Grand Champion', icon: 'laurels', rarity: 'legendary' },
  { id: 'arenia_legend', name: 'Arenia Legend', icon: 'crown', rarity: 'legendary' },

  // Participation (5)
  { id: 'first_blood', name: 'First Blood', icon: 'joystick', rarity: 'common' },
  { id: 'regular_player', name: 'Regular Player', icon: 'fire', rarity: 'common' },
  { id: 'tournament_veteran', name: 'Tournament Veteran', icon: 'crossed-swords', rarity: 'rare' },
  { id: 'century_club', name: 'Century Club', icon: 'star-formation', rarity: 'epic' },
  { id: 'dedicated_competitor', name: 'Dedicated Competitor', icon: 'bullseye', rarity: 'rare' },

  // Streak (5)
  { id: 'hot_streak', name: 'Hot Streak', icon: 'flame', rarity: 'rare' },
  { id: 'unstoppable', name: 'Unstoppable', icon: 'lightning-bolt', rarity: 'epic' },
  { id: 'comeback_king', name: 'Comeback King', icon: 'biceps', rarity: 'rare' },
  { id: 'perfect_run', name: 'Perfect Run', icon: 'checked-shield', rarity: 'epic' },
  { id: 'night_owl', name: 'Night Owl', icon: 'owl', rarity: 'common' },

  // PUBG (3)
  { id: 'headhunter_pubg', name: 'Headhunter', icon: 'sniper-rifle', rarity: 'rare' },
  { id: 'chicken_dinner', name: 'Chicken Dinner', icon: 'chicken', rarity: 'epic' },
  { id: 'squad_commander', name: 'Squad Commander', icon: 'team-idea', rarity: 'rare' },

  // eFootball (3)
  { id: 'goal_machine', name: 'Goal Machine', icon: 'soccer-ball', rarity: 'rare' },
  { id: 'clean_sheet', name: 'Clean Sheet', icon: 'goal', rarity: 'rare' },
  { id: 'hat_trick_hero', name: 'Hat-trick Hero', icon: 'top-hat', rarity: 'epic' },

  // COD Mobile (3)
  { id: 'sharpshooter', name: 'Sharpshooter', icon: 'sniper-rifle', rarity: 'rare' },
  { id: 'mvp', name: 'MVP', icon: 'star-medal', rarity: 'epic' },
  { id: 'killstreak_master', name: 'Killstreak Master', icon: 'machine-gun', rarity: 'epic' },

  // Free Fire (2)
  { id: 'booyah_king', name: 'Booyah King', icon: 'jeweled-chalice', rarity: 'epic' },
  { id: 'hot_drop', name: 'Hot Drop', icon: 'parachute', rarity: 'rare' },

  // Mobile Legends (3)
  { id: 'lord_slayer', name: 'Lord Slayer', icon: 'dragon-head', rarity: 'epic' },
  { id: 'maniac', name: 'Maniac', icon: 'super-mushroom', rarity: 'epic' },
  { id: 'savage', name: 'Savage', icon: 'crowned-skull', rarity: 'legendary' },

  // Organisateur (8)
  { id: 'event_creator', name: 'Event Creator', icon: 'circus-tent', rarity: 'common' },
  { id: 'tournament_host', name: 'Tournament Host', icon: 'theater', rarity: 'rare' },
  { id: 'trusted_organizer', name: 'Trusted Organizer', icon: 'star-shield', rarity: 'epic' },
  { id: 'elite_host', name: 'Elite Host', icon: 'diamond-trophy', rarity: 'epic' },
  { id: 'master_organizer', name: 'Master Organizer', icon: 'crown', rarity: 'legendary' },
  { id: 'fast_launch', name: 'Fast Launch', icon: 'lightning-frequency', rarity: 'rare' },
  { id: 'fair_play', name: 'Fair Play', icon: 'scales', rarity: 'rare' },
  { id: 'prize_distributor', name: 'Prize Distributor', icon: 'money-stack', rarity: 'epic' },

  // Premium (2)
  { id: 'premium_player', name: 'Premium Player', icon: 'star-shuriken', rarity: 'epic' },
  { id: 'vip', name: 'VIP', icon: 'crown', rarity: 'legendary' },
];

/**
 * Télécharger une icône depuis game-icons.net
 */
function downloadIcon(iconName) {
  return new Promise((resolve, reject) => {
    const url = `https://game-icons.net/icons/ffffff/000000/1x1/${iconName}.svg`;

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${iconName}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Extraire le contenu SVG (sans <svg> wrapper)
 */
function extractSVGContent(svgString) {
  // Enlever les balises <svg> et garder seulement le contenu
  const match = svgString.match(/<svg[^>]*>(.*?)<\/svg>/s);
  return match ? match[1].trim() : '';
}

/**
 * Générer badge avec icône intégrée
 */
function generateBadgeWithIcon(badge, iconContent) {
  const size = 256;
  const center = size / 2;
  const radius = size / 2 - 20;
  const colors = RARITIES[badge.rarity];

  // Nettoyer le contenu de l'icône (enlever fill="black" pour pouvoir appliquer white)
  const cleanIcon = iconContent
    .replace(/fill="[^"]*"/g, 'fill="white"')
    .replace(/stroke="[^"]*"/g, 'stroke="white"');

  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient radial -->
    <radialGradient id="grad_${badge.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${colors.gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.gradient[1]};stop-opacity:1" />
    </radialGradient>

    <!-- Glow filter -->
    <filter id="glow_${badge.id}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Shadow filter -->
    <filter id="shadow_${badge.id}">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer glow circle -->
  <circle cx="${center}" cy="${center}" r="${radius + 8}"
          fill="${colors.glow}" opacity="0.4" filter="url(#glow_${badge.id})"/>

  <!-- Main badge circle with gradient -->
  <circle cx="${center}" cy="${center}" r="${radius}"
          fill="url(#grad_${badge.id})"
          stroke="#FFFFFF" stroke-width="8"
          filter="url(#shadow_${badge.id})"/>

  <!-- Inner shine effect -->
  <circle cx="${center - 15}" cy="${center - 15}" r="${radius * 0.5}"
          fill="url(#shine_${badge.id})" opacity="0.25"/>
  <radialGradient id="shine_${badge.id}">
    <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </radialGradient>

  <!-- Icon au centre -->
  <g transform="translate(${center - 48}, ${center - 48}) scale(1.5)">
    ${cleanIcon}
  </g>
</svg>`;

  return svg;
}

/**
 * Main
 */
async function main() {
  console.log('🎨 Générateur de badges Arenia avec vraies icônes\n');
  console.log('📥 Téléchargement des icônes depuis game-icons.net...\n');

  // Créer dossiers
  [OUTPUT_DIR, ICONS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  let successCount = 0;
  let errorCount = 0;

  // Générer chaque badge
  for (const badge of BADGES) {
    try {
      // Télécharger l'icône
      process.stdout.write(`⏳ ${badge.name.padEnd(25)} → Téléchargement ${badge.icon}...`);

      const iconSvg = await downloadIcon(badge.icon);
      const iconContent = extractSVGContent(iconSvg);

      // Sauvegarder l'icône (pour référence)
      const iconPath = path.join(ICONS_DIR, `${badge.icon}.svg`);
      if (!fs.existsSync(iconPath)) {
        fs.writeFileSync(iconPath, iconSvg);
      }

      // Générer le badge
      const badgeSvg = generateBadgeWithIcon(badge, iconContent);
      const badgePath = path.join(OUTPUT_DIR, `badge_${badge.id}.svg`);
      fs.writeFileSync(badgePath, badgeSvg);

      console.log(`\r✅ ${badge.name.padEnd(25)} → badge_${badge.id}.svg`);
      successCount++;

      // Petit délai pour ne pas surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`\r❌ ${badge.name.padEnd(25)} → Erreur: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Succès: ${successCount} badges`);
  if (errorCount > 0) {
    console.log(`❌ Erreurs: ${errorCount} badges`);
  }
  console.log(`📁 Badges: ${OUTPUT_DIR}`);
  console.log(`📁 Icônes: ${ICONS_DIR}`);
  console.log('\n💡 Convertir en PNG:');
  console.log('   sudo apt install inkscape');
  console.log('   cd output && for f in *.svg; do inkscape "$f" --export-type=png --export-width=256; done');
  console.log('='.repeat(70));
}

main().catch(console.error);
