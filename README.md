# 🎨 Badges Generator - Arenia

Générateur automatique de **42 badges** avec icônes SVG professionnelles pour la plateforme Arenia.

## 🚀 Usage

```bash
# Générer les 42 badges avec icônes game-icons.net
node generate-badges-local.cjs

# Prévisualiser dans le navigateur
xdg-open preview.html
```

**Résultat**: 42 fichiers SVG haute qualité dans `output/`

## 📦 Structure

```
badges-generator/
├── generate-badges-local.cjs   # Script principal (icônes SVG)
├── preview.html                # Prévisualisation interactive
├── output/                     # 42 badges SVG générés
│   ├── badge_champion.svg
│   ├── badge_runner_up.svg
│   └── ... (40 autres)
├── game-icons.net.svg/         # Bibliothèque d'icônes locale
│   └── icons/
└── README.md
```

## 🎨 Badges Générés (42 total)

### Performance (8)

- **Champion** 🏆 (Legendary) - trophy
- **Runner-up** 🥈 (Rare) - sport-medal
- **Podium Finisher** 🥉 (Rare) - medal
- **Top Tier** 🔝 (Epic) - rank-3
- **Elite Player** 💎 (Epic) - cut-diamond
- **Rising Star** ⭐ (Rare) - falling-star
- **Grand Champion** 👑 (Legendary) - laurel-crown
- **Arenia Legend** 👑 (Legendary) - crown

### Participation (5)

- **First Blood** 🎮 (Common) - joystick
- **Regular Player** 🔥 (Common) - fire
- **Tournament Veteran** ⚔️ (Rare) - crossed-swords
- **Century Club** ⭐ (Epic) - star-formation
- **Dedicated Competitor** 🎯 (Rare) - target-arrows

### Streak (5)

- **Hot Streak** 🔥 (Rare) - fire
- **Unstoppable** ⚡ (Epic) - lightning-flame
- **Comeback King** 💪 (Rare) - biceps
- **Perfect Run** ✅ (Epic) - checked-shield
- **Night Owl** 🦉 (Common) - owl

### Jeux Spécifiques (11)

#### PUBG (3)

- Headhunter (Rare) - winchester-rifle
- Chicken Dinner (Epic) - chicken
- Squad Commander (Rare) - team-idea

#### eFootball (3)

- Goal Machine (Rare) - soccer-ball
- Clean Sheet (Rare) - goal-keeper
- Hat-trick Hero (Epic) - top-hat

#### COD Mobile (3)

- Sharpshooter (Rare) - rifle
- MVP (Epic) - star-medal
- Killstreak Master (Epic) - machine-gun

#### Free Fire (2)

- Booyah King (Epic) - jeweled-chalice
- Hot Drop (Rare) - parachute

#### Mobile Legends (3)

- Lord Slayer (Epic) - dragon-head
- Maniac (Epic) - lightning-slashes
- Savage (Legendary) - crowned-skull

### Organisateur (8)

- Event Creator (Common) - camping-tent
- Tournament Host (Rare) - theater
- Trusted Organizer (Epic) - checked-shield
- Elite Host (Epic) - diamond-trophy
- Master Organizer (Legendary) - imperial-crown
- Fast Launch (Rare) - lightning-frequency
- Fair Play (Rare) - scales
- Prize Distributor (Epic) - money-stack

### Premium (2)

- Premium Player (Epic) - star-shuriken
- VIP (Legendary) - queen-crown

## 🎨 Charte Couleurs Arenia

Les badges utilisent la charte officielle Arenia (Electric Gaming Design):

| Rareté | Gradient | Glow | Hex |
|--------|----------|------|-----|
| **Common** | Gris neutre | #A0AEC0 | `#A0AEC0 → #718096` |
| **Rare** | Bleu électrique | #4299E1 | `#63B3ED → #3182CE` |
| **Epic** | Violet gaming | #9F7AEA | `#B794F4 → #805AD5` |
| **Legendary** | Or premium | #FFD700 | `#FFD700 → #FFA500` |

**Background Arenia**: `#0C0D12` (Dark electric)

## 🔄 Convertir SVG → PNG

### Option 1: Inkscape (Recommandé - Meilleure qualité)

```bash
# Installer Inkscape
sudo apt install inkscape

# Convertir en PNG 256x256
cd output
for f in *.svg; do 
  inkscape "$f" --export-type=png --export-width=256
done
```

### Option 2: ImageMagick

```bash
# Installer ImageMagick
sudo apt install imagemagick

# Convertir tous les SVG
cd output
for f in *.svg; do
  convert -background none -resize 256x256 "$f" "${f%.svg}.png"
done
```

### Option 3: En ligne (Sans installation)

1. Ouvrir [CloudConvert](https://cloudconvert.com/svg-to-png)
2. Upload tous les SVG du dossier `output/`
3. Configurer: 256×256, fond transparent
4. Télécharger le ZIP

## 📤 Déploiement

### Upload vers Cloudflare R2

```bash
# Via wrangler CLI
cd output

# Upload d'un badge
wrangler r2 object put arenia-bucket/badges/badge_champion.png \
  --file badge_champion.png

# Upload batch (tous les badges)
for f in *.png; do
  wrangler r2 object put arenia-bucket/badges/$f --file $f
done
```

### URLs publiques

Format: `https://cdn.arenia.gg/badges/badge_{id}.png`

Exemple:
```
https://cdn.arenia.gg/badges/badge_champion.png
https://cdn.arenia.gg/badges/badge_mvp.png
```

## 🔧 Personnalisation

### Modifier les couleurs (charte Arenia)

Éditer `generate-badges-local.cjs` lignes 20-37:

```javascript
const RARITIES = {
  legendary: {
    gradient: ['#FFD700', '#FFA500'], // Or Arenia
    glow: '#FFD700',
  },
  epic: {
    gradient: ['#B794F4', '#805AD5'], // Violet gaming Arenia
    glow: '#9F7AEA',
  },
  // ...
};
```

### Ajouter un nouveau badge

1. **Trouver une icône** dans `game-icons.net.svg/icons/`:
```bash
find game-icons.net.svg/icons -name "*votre-mot-clé*.svg"
```

2. **Ajouter le badge** dans `generate-badges-local.cjs`:
```javascript
BADGES.push({
  id: 'nouveau_badge',
  name: 'Nouveau Badge',
  icon: 'nom-icone-trouvee', // sans .svg
  rarity: 'epic'
});
```

3. **Regénérer**:
```bash
node generate-badges-local.cjs
```

### Changer une icône existante

Éditer le tableau `BADGES` dans `generate-badges-local.cjs`:

```javascript
{ 
  id: 'champion', 
  name: 'Champion', 
  icon: 'trophy', // ← Changer ici
  rarity: 'legendary' 
}
```

## 🎯 Intégration API

### TypeScript (Backend)

```typescript
// src/config/badges.config.ts
export const BADGES_CONFIG = {
  champion: {
    id: 'champion',
    name: 'Champion',
    icon: 'https://cdn.arenia.gg/badges/badge_champion.png',
    rarity: 'legendary',
    category: 'performance',
  },
  mvp: {
    id: 'mvp',
    name: 'MVP',
    icon: 'https://cdn.arenia.gg/badges/badge_mvp.png',
    rarity: 'epic',
    category: 'cod_mobile',
  },
  // ... 40 autres
} as const;

export type BadgeId = keyof typeof BADGES_CONFIG;
```

### React Native (Frontend)

```tsx
// components/Badge.tsx
import { Image } from 'tamagui'

export const Badge = ({ badgeId }: { badgeId: BadgeId }) => {
  const badge = BADGES_CONFIG[badgeId]
  
  return (
    <Image
      source={{ uri: badge.icon }}
      width={64}
      height={64}
      alt={badge.name}
    />
  )
}
```

## ⏱️ Performance

- **Génération**: ~2 secondes pour 42 badges
- **Taille SVG**: 2-4 KB par badge
- **Total**: ~120 KB pour 42 badges SVG
- **PNG 256×256**: ~8-15 KB par badge

## 💡 Avantages

✅ **Icônes professionnelles** (game-icons.net)  
✅ **Qualité vectorielle** (SVG scalable)  
✅ **Cohérence visuelle** (même style partout)  
✅ **Charte Arenia respectée** (couleurs officielles)  
✅ **Pas de dépendance en ligne** (tout en local)  
✅ **Prévisualisation interactive** (preview.html)  
✅ **42 badges uniques** (performance, jeux, organisateurs)

## 🎨 Design System

Les badges suivent le **Arenia Electric Gaming Design**:

- **Font**: Audiowide (titres) + Inter (body)
- **Backgrounds**: `#0C0D12` → `#161822` (dark electric)
- **Primary**: `#0A84FF` (bleu électrique)
- **Accent**: `#B8A9FF` (violet gaming)
- **Border radius**: 12-16px (moderne)
- **Glow effects**: Filtres SVG avec blur

## 📊 Catégories

| Catégorie | Nombre | Utilisation |
|-----------|--------|-------------|
| Performance | 8 | Classements, podiums |
| Participation | 5 | Engagement, assiduité |
| Streak | 5 | Séries de victoires |
| Jeux (PUBG, eFootball, COD, FF, ML) | 11 | Exploits spécifiques |
| Organisateur | 8 | Créateurs de tournois |
| Premium | 2 | Abonnés VIP |

## 🔍 Recherche d'icônes

Pour trouver de nouvelles icônes game-icons.net:

```bash
# Chercher par mot-clé
find game-icons.net.svg/icons -name "*sword*.svg"

# Lister les auteurs (delapouite a le plus d'icônes)
ls game-icons.net.svg/icons/ffffff/transparent/1x1/

# Voir toutes les icônes d'un auteur
ls game-icons.net.svg/icons/ffffff/transparent/1x1/delapouite/ | head -50
```

**Collection complète**: <https://game-icons.net>

## 📞 Support

Questions ou bugs? → Discord Arenia #dev-tech

---

Made with ⚡ for **Arenia** - La plateforme esport mobile africaine
