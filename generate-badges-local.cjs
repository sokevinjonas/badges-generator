#!/usr/bin/env node

/**
 * 🎨 Générateur de badges Arenia avec icônes locales
 *
 * Utilise les icônes du dossier game-icons.net.svg téléchargé
 *
 * Usage: node generate-badges-local.cjs
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
const ICONS_BASE_DIR = path.join(__dirname, 'game-icons.net.svg/icons/ffffff/transparent/1x1');

// Couleurs par rareté (Charte Arenia - Electric Gaming)
const RARITIES = {
  common: {
    gradient: ['#B0B3C0', '#6B6F80'], // Gris texte secondaire/tertiaire
    glow: '#B0B3C0',
  },
  rare: {
    gradient: ['#3D9EFF', '#0066E0'], // Bleu électrique Arenia (primary hover → active)
    glow: '#0A84FF', // Primary Arenia
  },
  epic: {
    gradient: ['#C9BDFF', '#B8A9FF'], // Violet gaming Arenia (accent hover → accent)
    glow: '#B8A9FF', // Accent Arenia
  },
  legendary: {
    gradient: ['#FFB800', '#FFA500'], // Or premium Arenia
    glow: '#FFB800', // Gold Arenia
  },
};

// Liste des 42 badges avec noms d'icônes game-icons.net
const BADGES = [
  // Performance (8)
  { id: 'champion', name: 'Champion', icon: 'trophy', rarity: 'legendary' },
  { id: 'runner_up', name: 'Runner-up', icon: 'sport-medal', rarity: 'rare' },
  { id: 'podium_finisher', name: 'Podium Finisher', icon: 'medal', rarity: 'rare' },
  { id: 'top_tier', name: 'Top Tier', icon: 'rank-3', rarity: 'epic' },
  { id: 'elite_player', name: 'Elite Player', icon: 'cut-diamond', rarity: 'epic' },
  { id: 'rising_star', name: 'Rising Star', icon: 'falling-star', rarity: 'rare' },
  { id: 'grand_champion', name: 'Grand Champion', icon: 'laurel-crown', rarity: 'legendary' },
  { id: 'arenia_legend', name: 'Arenia Legend', icon: 'crown', rarity: 'legendary' },

  // Participation (5)
  { id: 'first_blood', name: 'First Blood', icon: 'joystick', rarity: 'common' },
  { id: 'regular_player', name: 'Regular Player', icon: 'fire', rarity: 'common' },
  { id: 'tournament_veteran', name: 'Tournament Veteran', icon: 'crossed-swords', rarity: 'rare' },
  { id: 'century_club', name: 'Century Club', icon: 'star-formation', rarity: 'epic' },
  { id: 'dedicated_competitor', name: 'Dedicated Competitor', icon: 'target-arrows', rarity: 'rare' },

  // Streak (5)
  { id: 'hot_streak', name: 'Hot Streak', icon: 'fire', rarity: 'rare' },
  { id: 'unstoppable', name: 'Unstoppable', icon: 'lightning-flame', rarity: 'epic' },
  { id: 'comeback_king', name: 'Comeback King', icon: 'biceps', rarity: 'rare' },
  { id: 'perfect_run', name: 'Perfect Run', icon: 'checked-shield', rarity: 'epic' },
  { id: 'night_owl', name: 'Night Owl', icon: 'owl', rarity: 'common' },

  // PUBG (3)
  { id: 'headhunter_pubg', name: 'Headhunter', icon: 'winchester-rifle', rarity: 'rare' },
  { id: 'chicken_dinner', name: 'Chicken Dinner', icon: 'chicken', rarity: 'epic' },
  { id: 'squad_commander', name: 'Squad Commander', icon: 'team-idea', rarity: 'rare' },

  // eFootball (3)
  { id: 'goal_machine', name: 'Goal Machine', icon: 'soccer-ball', rarity: 'rare' },
  { id: 'clean_sheet', name: 'Clean Sheet', icon: 'goal-keeper', rarity: 'rare' },
  { id: 'hat_trick_hero', name: 'Hat-trick Hero', icon: 'top-hat', rarity: 'epic' },

  // COD Mobile (3)
  { id: 'sharpshooter', name: 'Sharpshooter', icon: 'rifle', rarity: 'rare' },
  { id: 'mvp', name: 'MVP', icon: 'star-medal', rarity: 'epic' },
  { id: 'killstreak_master', name: 'Killstreak Master', icon: 'machine-gun', rarity: 'epic' },

  // Free Fire (2)
  { id: 'booyah_king', name: 'Booyah King', icon: 'jeweled-chalice', rarity: 'epic' },
  { id: 'hot_drop', name: 'Hot Drop', icon: 'parachute', rarity: 'rare' },

  // Mobile Legends (3)
  { id: 'lord_slayer', name: 'Lord Slayer', icon: 'dragon-head', rarity: 'epic' },
  { id: 'maniac', name: 'Maniac', icon: 'lightning-slashes', rarity: 'epic' },
  { id: 'savage', name: 'Savage', icon: 'crowned-skull', rarity: 'legendary' },

  // Organisateur (8)
  { id: 'event_creator', name: 'Event Creator', icon: 'camping-tent', rarity: 'common' },
  { id: 'tournament_host', name: 'Tournament Host', icon: 'theater', rarity: 'rare' },
  { id: 'trusted_organizer', name: 'Trusted Organizer', icon: 'checked-shield', rarity: 'epic' },
  { id: 'elite_host', name: 'Elite Host', icon: 'diamond-trophy', rarity: 'epic' },
  { id: 'master_organizer', name: 'Master Organizer', icon: 'imperial-crown', rarity: 'legendary' },
  { id: 'fast_launch', name: 'Fast Launch', icon: 'lightning-frequency', rarity: 'rare' },
  { id: 'fair_play', name: 'Fair Play', icon: 'scales', rarity: 'rare' },
  { id: 'prize_distributor', name: 'Prize Distributor', icon: 'money-stack', rarity: 'epic' },

  // Premium (2)
  { id: 'premium_player', name: 'Premium Player', icon: 'star-shuriken', rarity: 'epic' },
  { id: 'vip', name: 'VIP', icon: 'queen-crown', rarity: 'legendary' },
];

/**
 * Chercher une icône dans tous les dossiers d'auteurs
 */
function findIconPath(iconName) {
  const authors = fs.readdirSync(ICONS_BASE_DIR);

  for (const author of authors) {
    const iconPath = path.join(ICONS_BASE_DIR, author, `${iconName}.svg`);
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }

  return null;
}

/**
 * Extraire le viewBox et le contenu SVG
 */
function extractSVGContent(svgString) {
  // Extraire le viewBox
  const viewBoxMatch = svgString.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512';

  // Extraire le contenu
  const match = svgString.match(/<svg[^>]*>(.*?)<\/svg>/s);
  if (!match) return { viewBox, content: '' };

  let content = match[1].trim();

  // Forcer fill="white" pour toutes les icônes (elles sont en blanc sur fond transparent)
  // Les icônes de game-icons.net sont déjà en blanc (#fff)
  content = content.replace(/fill="#000[0-9a-fA-F]*"/gi, 'fill="white"');
  content = content.replace(/fill="black"/gi, 'fill="white"');

  return { viewBox, content };
}

/**
 * Générer badge avec icône intégrée
 */
function generateBadgeWithIcon(badge, iconData) {
  const size = 256;
  const center = size / 2;
  const radius = size / 2 - 20;
  const colors = RARITIES[badge.rarity];

  // Calculer le scale pour l'icône (512x512 -> ~100x100)
  const iconSize = 100;
  const viewBoxParts = iconData.viewBox.split(' ');
  const originalSize = parseFloat(viewBoxParts[2]) || 512;
  const scale = iconSize / originalSize;
  const iconOffset = (size - iconSize) / 2;

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

    <!-- Shine gradient -->
    <radialGradient id="shine_${badge.id}">
      <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
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

  <!-- Icon au centre -->
  <g transform="translate(${iconOffset}, ${iconOffset}) scale(${scale})">
    ${iconData.content}
  </g>
</svg>`;

  return svg;
}

/**
 * Main
 */
async function main() {
  console.log('🎨 Générateur de badges Arenia avec icônes locales\n');

  // Vérifier que le dossier d'icônes existe
  if (!fs.existsSync(ICONS_BASE_DIR)) {
    console.error(`❌ Dossier d'icônes introuvable: ${ICONS_BASE_DIR}`);
    console.error('💡 Assurez-vous d\'avoir téléchargé game-icons.net.svg');
    process.exit(1);
  }

  // Nettoyer et recréer le dossier de sortie (suppression complète)
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    console.log('🗑️  Ancien dossier output/ supprimé\n');
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('📁 Nouveau dossier output/ créé\n');

  let successCount = 0;
  let errorCount = 0;

  // Générer chaque badge
  for (const badge of BADGES) {
    try {
      process.stdout.write(`⏳ ${badge.name.padEnd(25)} → Recherche ${badge.icon}...`);

      // Chercher l'icône
      const iconPath = findIconPath(badge.icon);

      if (!iconPath) {
        console.log(`\r❌ ${badge.name.padEnd(25)} → Icône "${badge.icon}" introuvable`);
        errorCount++;
        continue;
      }

      // Lire l'icône
      const iconSvg = fs.readFileSync(iconPath, 'utf8');
      const iconData = extractSVGContent(iconSvg);

      // Générer le badge
      const badgeSvg = generateBadgeWithIcon(badge, iconData);
      const badgePath = path.join(OUTPUT_DIR, `badge_${badge.id}.svg`);
      fs.writeFileSync(badgePath, badgeSvg);

      console.log(`\r✅ ${badge.name.padEnd(25)} → badge_${badge.id}.svg`);
      successCount++;

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
  console.log('\n💡 Convertir en PNG:');
  console.log('   sudo apt install inkscape');
  console.log('   cd output && for f in *.svg; do inkscape "$f" --export-type=png --export-width=256; done');
  console.log('='.repeat(70));
}

main().catch(console.error);
