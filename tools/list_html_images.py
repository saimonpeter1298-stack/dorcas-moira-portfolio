import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

images_in_html = re.findall(r'assets/images/[^"\'\s,>]+', html)
unique = sorted(set(images_in_html))
print(f"Total unique images referenced in index.html: {len(unique)}")
for u in unique:
    print(" ", u)
