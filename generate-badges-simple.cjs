#!/usr/bin/env node

/**
 * 🎨 Générateur de badges Arenia avec icônes SVG intégrées
 *
 * Génère des badges avec des formes géométriques simples mais élégantes
 *
 * Usage: node generate-badges-simple.cjs
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

// Icônes SVG path simples et élégantes
const ICONS = {
  trophy: 'M12 2C12 2 9 5 9 8V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V8C15 5 12 2 12 2M8 17C8 17 8 16 12 16C16 16 16 17 16 17V18H8V17M9 19H15V21H9V19M7 8H4V9C4 10.66 5.34 12 7 12V8M17 8V12C18.66 12 20 10.66 20 9V8H17Z',
  medal: 'M14.94 19.5L12 17.77L9.06 19.5L9.84 16.16L7.19 13.67L10.58 13.31L12 10.2L13.42 13.31L16.81 13.67L14.16 16.16L14.94 19.5M20 2H4V11C4 11.91 4.34 12.75 4.89 13.41L12 22L19.11 13.41C19.66 12.75 20 11.91 20 11V2Z',
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  crown: 'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z',
  diamond: 'M12,2L1,9L12,22L23,9L12,2M12,4.3L18.85,9L12,17.14L5.15,9L12,4.3Z',
  fire: 'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z',
  sword: 'M6.92,5H5L14,14L15,13.06M19.96,19.12L19.12,19.96C18.73,20.35 18.1,20.35 17.71,19.96L14.59,16.84L11.91,19.5L10.5,18.09L11.92,16.67L3,7.75V3H7.75L16.67,11.92L18.09,10.5L19.5,11.91L16.83,14.58L19.95,17.7C20.35,18.1 20.35,18.73 19.96,19.12Z',
  target: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z',
  lightning: 'M7,2V13H10V22L17,10H13L17,2H7Z',
  shield: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z',
  gamepad: 'M6,9H8V11H10V13H8V15H6V13H4V11H6V9M18.5,9A1.5,1.5 0 0,1 20,10.5A1.5,1.5 0 0,1 18.5,12A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 18.5,9M15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12M17,5A7,7 0 0,1 24,12A7,7 0 0,1 17,19C15.04,19 13.27,18.09 12,16.67C10.73,18.09 8.96,19 7,19A7,7 0 0,1 0,12A7,7 0 0,1 7,5H17Z',
  rocket: 'M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z',
  football: 'M12,2C10.22,2 8.63,2.39 7.38,3.16C5.87,4.05 5,5.37 5,7C5,8.21 5.6,9.2 6.5,10.04C8.24,11.67 10.84,12.5 12,12.5C13.16,12.5 15.76,11.67 17.5,10.04C18.4,9.2 19,8.21 19,7C19,5.37 18.13,4.05 16.62,3.16C15.37,2.39 13.78,2 12,2M15.5,7C15.5,8.21 14.88,9.2 13.98,10.04C13.08,10.88 12,11.5 12,11.5C12,11.5 10.92,10.88 10.02,10.04C9.12,9.2 8.5,8.21 8.5,7C8.5,5.79 9.12,4.8 10.02,3.96C10.92,3.12 12,2.5 12,2.5C12,2.5 13.08,3.12 13.98,3.96C14.88,4.8 15.5,5.79 15.5,7M16.22,12C15.97,12.21 15.71,12.41 15.45,12.59C16.23,13.26 16.96,14.02 17.61,14.86C18.89,16.55 19.64,18.43 19.64,20.18C19.64,20.5 19.62,20.82 19.57,21.13C21.38,20.24 22.5,18.92 22.5,17.45C22.5,14.32 17.89,11.77 12,11.77C11.39,11.77 10.78,11.81 10.19,11.88C10.78,12.05 11.39,12.23 12,12.5C13.83,12.5 15.18,12.24 16.22,12Z',
  chicken: 'M12,2C10.5,2 9,2.5 8,3.5C7,4.5 7,6 7,6H5C4.45,6 4,6.45 4,7V9C4,9.55 4.45,10 5,10H6C6,11.88 6.39,13.46 7.04,14.67C7.69,15.88 8.59,16.71 9.67,17.17L10,17.29L10,22H14V17.29L14.33,17.17C15.41,16.71 16.31,15.88 16.96,14.67C17.61,13.46 18,11.88 18,10H19C19.55,10 20,9.55 20,9V7C20,6.45 19.55,6 19,6H17C17,6 17,4.5 16,3.5C15,2.5 13.5,2 12,2M10,6C10,5.45 10.45,5 11,5C11.55,5 12,5.45 12,6C12,6.55 11.55,7 11,7C10.45,7 10,6.55 10,6M14,6C14,5.45 14.45,5 15,5C15.55,5 16,5.45 16,6C16,6.55 15.55,7 15,7C14.45,7 14,6.55 14,6Z',
  dragon: 'M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M12,15L10,17H14L12,15Z',
  tent: 'M12,3L2,21H22L12,3M12,7L17.88,19H6.12L12,7Z',
  theater: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5C9.58,16.5 9.17,16.33 8.88,16C8.28,15.39 8.28,14.44 8.88,13.83L13.88,8.83C14.48,8.23 15.44,8.23 16.04,8.83C16.64,9.44 16.64,10.39 16.04,11L11.04,16C10.75,16.33 10.34,16.5 9.92,16.5H10Z',
  chalice: 'M6,3A1,1 0 0,0 5,4V5A1,1 0 0,0 6,6H7V10A5,5 0 0,0 11,14.9V19H8V21H16V19H13V14.9A5,5 0 0,0 17,10V6H18A1,1 0 0,0 19,5V4A1,1 0 0,0 18,3H6M9,6H15V10A3,3 0 0,1 12,13A3,3 0 0,1 9,10V6Z',
  parachute: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C13.5,4 15,4.5 16,5.5V10H8V5.5C9,4.5 10.5,4 12,4M7,11H11V20.9C8.26,20.44 6,18.42 6,16V11H7M13,20.9V11H17H18V16C18,18.42 15.74,20.44 13,20.9Z',
  owl: 'M12,2C10.75,2 9.71,2.57 9.11,3.44C8.5,4.31 8.5,5.5 8.5,6.5V8C8.5,9 8.5,10 9.11,10.87C9.71,11.73 10.75,12.3 12,12.3C13.25,12.3 14.29,11.73 14.89,10.87C15.5,10 15.5,9 15.5,8V6.5C15.5,5.5 15.5,4.31 14.89,3.44C14.29,2.57 13.25,2 12,2M9.5,7A1,1 0 0,1 10.5,8A1,1 0 0,1 9.5,9A1,1 0 0,1 8.5,8A1,1 0 0,1 9.5,7M14.5,7A1,1 0 0,1 15.5,8A1,1 0 0,1 14.5,9A1,1 0 0,1 13.5,8A1,1 0 0,1 14.5,7M6,10L4,14H8L6,10M18,10L16,14H20L18,10M12,13C10.5,13 9,13.84 9,15V16H15V15C15,13.84 13.5,13 12,13Z',
  gun: 'M3,6V8H14V6H3M16.5,6A1.5,1.5 0 0,0 15,7.5A1.5,1.5 0 0,0 16.5,9A1.5,1.5 0 0,0 18,7.5A1.5,1.5 0 0,0 16.5,6M16.5,9A1.5,1.5 0 0,0 15,10.5V13L13,14V18H15V15L17,14V10.5A1.5,1.5 0 0,0 16.5,9M3,9V11H11V9H3M3,12V14H9V12H3Z',
  scales: 'M12,3L2,8L3,9L5,8V19H19V8L21,9L22,8L12,3M7,10H17V17H7V10M9,12V15H15V12H9Z',
  money: 'M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z',
  hat: 'M12,2L2,7L12,12L22,7L12,2M16,10V15L12,17L8,15V10L2,7V8.18C2,8.97 2.37,9.71 3,10.18L12,16L21,10.18C21.63,9.71 22,8.97 22,8.18V7L16,10Z',
};

// Association badge -> icône
const BADGE_ICONS = {
  // Performance (8)
  champion: 'trophy',
  runner_up: 'medal',
  podium_finisher: 'medal',
  top_tier: 'star',
  elite_player: 'diamond',
  rising_star: 'star',
  grand_champion: 'crown',
  arenia_legend: 'crown',

  // Participation (5)
  first_blood: 'gamepad',
  regular_player: 'fire',
  tournament_veteran: 'sword',
  century_club: 'star',
  dedicated_competitor: 'target',

  // Streak (5)
  hot_streak: 'fire',
  unstoppable: 'lightning',
  comeback_king: 'shield',
  perfect_run: 'shield',
  night_owl: 'owl',

  // PUBG (3)
  headhunter_pubg: 'gun',
  chicken_dinner: 'chicken',
  squad_commander: 'shield',

  // eFootball (3)
  goal_machine: 'football',
  clean_sheet: 'shield',
  hat_trick_hero: 'hat',

  // COD Mobile (3)
  sharpshooter: 'gun',
  mvp: 'star',
  killstreak_master: 'gun',

  // Free Fire (2)
  booyah_king: 'chalice',
  hot_drop: 'parachute',

  // Mobile Legends (3)
  lord_slayer: 'dragon',
  maniac: 'lightning',
  savage: 'dragon',

  // Organisateur (8)
  event_creator: 'tent',
  tournament_host: 'theater',
  trusted_organizer: 'star',
  elite_host: 'trophy',
  master_organizer: 'crown',
  fast_launch: 'rocket',
  fair_play: 'scales',
  prize_distributor: 'money',

  // Premium (2)
  premium_player: 'star',
  vip: 'crown',
};

// Liste des 42 badges
const BADGES = [
  // Performance (8)
  { id: 'champion', name: 'Champion', rarity: 'legendary' },
  { id: 'runner_up', name: 'Runner-up', rarity: 'rare' },
  { id: 'podium_finisher', name: 'Podium Finisher', rarity: 'rare' },
  { id: 'top_tier', name: 'Top Tier', rarity: 'epic' },
  { id: 'elite_player', name: 'Elite Player', rarity: 'epic' },
  { id: 'rising_star', name: 'Rising Star', rarity: 'rare' },
  { id: 'grand_champion', name: 'Grand Champion', rarity: 'legendary' },
  { id: 'arenia_legend', name: 'Arenia Legend', rarity: 'legendary' },

  // Participation (5)
  { id: 'first_blood', name: 'First Blood', rarity: 'common' },
  { id: 'regular_player', name: 'Regular Player', rarity: 'common' },
  { id: 'tournament_veteran', name: 'Tournament Veteran', rarity: 'rare' },
  { id: 'century_club', name: 'Century Club', rarity: 'epic' },
  { id: 'dedicated_competitor', name: 'Dedicated Competitor', rarity: 'rare' },

  // Streak (5)
  { id: 'hot_streak', name: 'Hot Streak', rarity: 'rare' },
  { id: 'unstoppable', name: 'Unstoppable', rarity: 'epic' },
  { id: 'comeback_king', name: 'Comeback King', rarity: 'rare' },
  { id: 'perfect_run', name: 'Perfect Run', rarity: 'epic' },
  { id: 'night_owl', name: 'Night Owl', rarity: 'common' },

  // PUBG (3)
  { id: 'headhunter_pubg', name: 'Headhunter', rarity: 'rare' },
  { id: 'chicken_dinner', name: 'Chicken Dinner', rarity: 'epic' },
  { id: 'squad_commander', name: 'Squad Commander', rarity: 'rare' },

  // eFootball (3)
  { id: 'goal_machine', name: 'Goal Machine', rarity: 'rare' },
  { id: 'clean_sheet', name: 'Clean Sheet', rarity: 'rare' },
  { id: 'hat_trick_hero', name: 'Hat-trick Hero', rarity: 'epic' },

  // COD Mobile (3)
  { id: 'sharpshooter', name: 'Sharpshooter', rarity: 'rare' },
  { id: 'mvp', name: 'MVP', rarity: 'epic' },
  { id: 'killstreak_master', name: 'Killstreak Master', rarity: 'epic' },

  // Free Fire (2)
  { id: 'booyah_king', name: 'Booyah King', rarity: 'epic' },
  { id: 'hot_drop', name: 'Hot Drop', rarity: 'rare' },

  // Mobile Legends (3)
  { id: 'lord_slayer', name: 'Lord Slayer', rarity: 'epic' },
  { id: 'maniac', name: 'Maniac', rarity: 'epic' },
  { id: 'savage', name: 'Savage', rarity: 'legendary' },

  // Organisateur (8)
  { id: 'event_creator', name: 'Event Creator', rarity: 'common' },
  { id: 'tournament_host', name: 'Tournament Host', rarity: 'rare' },
  { id: 'trusted_organizer', name: 'Trusted Organizer', rarity: 'epic' },
  { id: 'elite_host', name: 'Elite Host', rarity: 'epic' },
  { id: 'master_organizer', name: 'Master Organizer', rarity: 'legendary' },
  { id: 'fast_launch', name: 'Fast Launch', rarity: 'rare' },
  { id: 'fair_play', name: 'Fair Play', rarity: 'rare' },
  { id: 'prize_distributor', name: 'Prize Distributor', rarity: 'epic' },

  // Premium (2)
  { id: 'premium_player', name: 'Premium Player', rarity: 'epic' },
  { id: 'vip', name: 'VIP', rarity: 'legendary' },
];

/**
 * Générer badge avec icône intégrée
 */
function generateBadgeWithIcon(badge) {
  const size = 256;
  const center = size / 2;
  const radius = size / 2 - 20;
  const colors = RARITIES[badge.rarity];
  const iconPath = ICONS[BADGE_ICONS[badge.id]];

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
  <g transform="translate(${center}, ${center}) scale(3.5) translate(-12, -12)">
    <path d="${iconPath}" fill="white" opacity="0.95"/>
  </g>
</svg>`;

  return svg;
}

/**
 * Main
 */
function main() {
  console.log('🎨 Générateur de badges Arenia\n');

  // Créer dossier de sortie
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let successCount = 0;

  // Générer chaque badge
  for (const badge of BADGES) {
    try {
      const badgeSvg = generateBadgeWithIcon(badge);
      const badgePath = path.join(OUTPUT_DIR, `badge_${badge.id}.svg`);
      fs.writeFileSync(badgePath, badgeSvg);

      console.log(`✅ ${badge.name.padEnd(25)} → badge_${badge.id}.svg`);
      successCount++;
    } catch (error) {
      console.log(`❌ ${badge.name.padEnd(25)} → Erreur: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Succès: ${successCount}/${BADGES.length} badges`);
  console.log(`📁 Dossier: ${OUTPUT_DIR}`);
  console.log('\n💡 Convertir en PNG:');
  console.log('   sudo apt install inkscape');
  console.log('   cd output && for f in *.svg; do inkscape "$f" --export-type=png --export-width=256; done');
  console.log('='.repeat(70));
}

main();
