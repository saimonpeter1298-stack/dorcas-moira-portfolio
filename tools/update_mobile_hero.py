import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update hero-word-wrap margin-top on mobile
css = re.sub(
    r'\.hero-word-wrap\s*\{[^}]*\}',
    '''.hero-word-wrap {
  position: relative;
  width: 100%;
  text-align: center;
  padding: 0 16px;
  margin-top: calc(var(--sat) + 120px);
}''',
    css,
    count=1
)

# Update annot-top-right mobile
old_annot_top_right = r'\.annot-top-right\s*\{[^}]*\}'
new_annot_top_right = '''.annot-top-right {
  top: calc(var(--sat) + 48px);
  right: 16px;
  text-align: right;
}'''
css = re.sub(old_annot_top_right, new_annot_top_right, css, count=1)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated hero mobile word wrap and top right annotation positioning')
