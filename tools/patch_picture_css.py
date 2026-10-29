import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add picture styling and adjust desktop subject height
old_rule = """.hero-cutout-img {
  height: 100%;
  width: auto;
  max-width: 96vw;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.65));
  will-change: transform, opacity;
}"""

new_rule = """.hero-layer-subject picture {
  display: block;
  height: 100%;
  width: auto;
}

.hero-cutout-img {
  display: block;
  height: 100%;
  width: auto;
  max-height: 100%;
  max-width: 96vw;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.65));
  will-change: transform, opacity;
}"""

# Desktop subject height: on desktop 1024px+, keep height around 75vh so her head is around 25vh, with plenty of room above her afro
desktop_pattern = re.compile(r'(\.hero-layer-subject\s*\{\s*height:\s*)82vh;\s*max-height:\s*86vh;', re.DOTALL)

if old_rule in css:
    css = css.replace(old_rule, new_rule, 1)
    print("Replaced cutout img rule")

css = desktop_pattern.sub(r'\1 75vh;\n    max-height: 78vh;', css, count=1)
print("Updated desktop hero-layer-subject height")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Saved css/style.css successfully!")
