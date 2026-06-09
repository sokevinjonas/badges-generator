# 🎨 Badges Generator - Arenia

Générateur automatique de **42 badges** pour la plateforme Arenia.

## 🚀 Usage Simple

```bash
# Générer les 42 badges SVG
node generate-badges.js
```

**Résultat**: 42 fichiers SVG dans `output/`

## 📦 Structure

```
badges-generator/
├── generate-badges.js    # Script principal (zéro dépendance!)
├── output/               # 42 badges SVG générés
│   ├── badge_champion.svg
│   ├── badge_runner_up.svg
│   └── ... (40 autres)
└── README.md
```

## 🎨 Badges Générés (42 total)

### Performance (8)
- Champion 🏆 (Legendary)
- Runner-up 🥈 (Rare)
- Podium Finisher 🥉 (Rare)
- Top Tier 🔝 (Epic)
- Elite Player 💎 (Epic)
- Rising Star ⭐ (Rare)
- Grand Champion 🏆 (Legendary)
- Arenia Legend 👑 (Legendary)

### Participation (5)
- First Blood 🎮 (Common)
- Regular Player 🔥 (Common)
- Tournament Veteran ⚡ (Rare)
- Century Club 🌟 (Epic)
- Dedicated Competitor 🎯 (Rare)

### Streak (5)
- Hot Streak 🔥 (Rare)
- Unstoppable ⚡ (Epic)
- Comeback King 💪 (Rare)
- Perfect Run ✅ (Epic)
- Night Owl 🌙 (Common)

### Jeux Spécifiques (11)
**PUBG**: Headhunter, Chicken Dinner, Squad Commander  
**eFootball**: Goal Machine, Clean Sheet, Hat-trick Hero  
**COD Mobile**: Sharpshooter, MVP, Killstreak Master  
**Free Fire**: Booyah King, Hot Drop  
**Mobile Legends**: Lord Slayer, Maniac, Savage

### Organisateur (8)
- Event Creator, Tournament Host, Trusted Organizer
- Elite Host, Master Organizer, Fast Launch
- Fair Play, Prize Distributor

### Premium (2)
- Premium Player, VIP

## 🎨 Couleurs par Rareté

| Rareté | Gradient | Glow |
|--------|----------|------|
| Common | Gris (#A0AEC0 → #718096) | #A0AEC0 |
| Rare | Bleu (#63B3ED → #3182CE) | #4299E1 |
| Epic | Violet (#B794F4 → #805AD5) | #9F7AEA |
| Legendary | Or (#FFD700 → #FFA500) | #FFD700 |

## 🔄 Convertir SVG → PNG

### Option 1: En ligne (Gratuit)

Ouvrir: https://cloudconvert.com/svg-to-png

1. Upload tous les SVG
2. Convertir en PNG 256×256
3. Télécharger le ZIP

### Option 2: ImageMagick (Local)

```bash
# Installer ImageMagick
sudo apt-get install imagemagick

# Convertir tous les SVG en PNG
cd output
for f in *.svg; do
  convert -background none -resize 256x256 "$f" "${f%.svg}.png"
done
```

### Option 3: Inkscape (Meilleure qualité)

```bash
# Installer Inkscape
sudo apt-get install inkscape

# Convertir en PNG
cd output
for f in *.svg; do
  inkscape "$f" --export-type=png --export-width=256 --export-height=256
done
```

## 📤 Upload vers Cloudflare R2

Après conversion en PNG:

```bash
# Via wrangler CLI
wrangler r2 object put arenia-bucket/badges/badge_champion.png --file output/badge_champion.png

# Ou via dashboard Cloudflare R2
# → Upload tous les PNG
```

## 🔧 Personnalisation

### Modifier les couleurs

Éditer `generate-badges.js` ligne 15-30:

```javascript
const RARITIES = {
  legendary: {
    gradient: ['#FFD700', '#FFA500'], // Changer ici
    glow: '#FFD700',
  },
  // ...
};
```

### Ajouter un badge

Éditer `generate-badges.js` ligne 33+:

```javascript
BADGES.push({
  id: 'nouveau_badge',
  name: 'Nouveau Badge',
  emoji: '🚀',
  rarity: 'epic'
});
```

## ⏱️ Performance

- **Génération**: < 1 seconde
- **Taille SVG**: ~1-2KB par badge
- **Total**: ~50KB pour 42 badges

## 💡 Avantages SVG

✅ Pas de dépendances natives  
✅ Génération instantanée  
✅ Fichiers légers  
✅ Scalable à l'infini  
✅ Éditable (Figma, Illustrator)

## 🎯 Intégration dans l'API

```typescript
// badges.config.ts
export const BADGES = {
  champion: {
    id: 'champion',
    name: 'Champion',
    icon: 'https://r2.arenia.gg/badges/badge_champion.png',
    rarity: 'legendary',
  },
  // ... 41 autres
};
```

## 📞 Support

Questions? → Discord #tech-help
