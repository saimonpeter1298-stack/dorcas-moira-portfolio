import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(
    r'\.hero-layer-subject\s*\{[^}]*\}',
    '''.hero-layer-subject {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 82svh;
  max-height: 84svh;
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

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated hero-layer-subject to 82svh')
