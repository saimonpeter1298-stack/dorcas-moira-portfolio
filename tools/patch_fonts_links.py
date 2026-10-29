import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Replace any fonts.googleapis.com link with local google-fonts.css
h = re.sub(
    r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^"]*">',
    '<link rel="stylesheet" href="css/google-fonts.css">',
    h
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h)

# 2. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(
    r"@import url\('https://fonts\.googleapis\.com[^']*'\);",
    "@import url('google-fonts.css');",
    c
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated index.html and css/style.css to local fonts successfully!')
