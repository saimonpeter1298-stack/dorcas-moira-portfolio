import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Normalize CRLF for matching if needed
crlf = '\r\n' in html

# 1. Update ld+json to remove facebook
html = re.sub(
    r'"https://facebook\.com/dorcasmoira",?\r?\n?',
    '',
    html
)
# Clean trailing comma if any in array
html = re.sub(
    r'("https://pinterest\.com/dorcassmoira"),(\s*\])',
    r'\1\2',
    html
)

# 2. Add Favicons and Google Fonts before Stylesheet
head_needle = '  <!-- Stylesheet -->'
favicon_block = """  <!-- Luxury Favicons (DM Copper on Night) -->
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">

  <!-- Preconnect & Load Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Allison&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Mrs+Saint+Delafield&family=Outfit:wght@300;400;500;600;700;800&display=swap">

  <!-- Stylesheet -->"""

if 'favicon.svg' not in html and head_needle in html:
    html = html.replace(head_needle, favicon_block, 1)
    print("Added favicons and font links to <head>")

# 3. Replace Loader SVG with handwritten cursive script
old_svg_pattern = re.compile(
    r'<svg class="loader-signature-svg".*?</svg>',
    re.DOTALL
)

new_loader_svg = """<svg class="loader-signature-svg" viewBox="0 0 460 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="copper-grad-loader" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E3B48C" />
            <stop offset="50%" stop-color="#B87A52" />
            <stop offset="100%" stop-color="#E3B48C" />
          </linearGradient>
        </defs>
        <text x="50%" y="74" class="signature-script-text" text-anchor="middle">Dorcas Moïra</text>
      </svg>"""

if old_svg_pattern.search(html):
    html = old_svg_pattern.sub(new_loader_svg, html, count=1)
    print("Replaced loader SVG with Dorcas Moïra script text")
else:
    print("Loader SVG pattern not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html updated successfully!")
