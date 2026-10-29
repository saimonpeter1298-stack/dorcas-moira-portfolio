import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update hero-layer-subject and hero-cutout-img
css = re.sub(
    r'\.hero-layer-subject\s*\{[^}]*\}',
    '''.hero-layer-subject {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 75svh;
  max-height: 78svh;
  width: auto;
  z-index: 5;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}''',
    css,
    count=1
)

css = re.sub(
    r'\.hero-cutout-img\s*\{[^}]*\}',
    '''.hero-cutout-img {
  display: block;
  height: 100%;
  width: auto;
  max-height: 100%;
  max-width: none;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 18px 42px rgba(0, 0, 0, 0.78));
  /* Dissolution invisible du bas du kimono dans #0B0807 (zéro découpe nette qui flotte) */
  -webkit-mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
  will-change: transform, opacity;
}''',
    css,
    count=1
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated hero subject to allow true 75svh height on mobile')
