#!/usr/bin/env python3
import re
import glob
import os

def audit():
    referenced = set()

    # 1. Scan HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
        for m in re.finditer(r'(?:src|href|srcset|data-img|data-preview)=["\']([^"\']+)["\']', html):
            val = m.group(1)
            for part in val.split(','):
                p = part.strip().split(' ')[0]
                if not p.startswith(('http', '#', 'mailto:', 'tel:', 'data:')):
                    referenced.add(p)

    # 2. Scan CSS
    for css_file in glob.glob('css/*.css'):
        with open(css_file, 'r', encoding='utf-8') as f:
            css = f.read()
            for m in re.finditer(r'url\(["\']?([^"\'\)]+)["\']?\)', css):
                p = m.group(1).split('?')[0].split('#')[0]
                if not p.startswith(('data:', 'http')):
                    norm = os.path.normpath(os.path.join('css', p)).replace('\\', '/')
                    referenced.add(norm)

    # 3. Scan JS
    for js_file in glob.glob('js/*.js'):
        with open(js_file, 'r', encoding='utf-8') as f:
            js = f.read()
            for m in re.finditer(r'["\'](assets/[^"\']+)["\']', js):
                referenced.add(m.group(1))

    print(f"Total uniquely referenced local assets: {len(referenced)}")
    missing = []
    found = []
    for r in sorted(referenced):
        # clean query params if any
        clean_r = r.split('?')[0].split('#')[0]
        if os.path.exists(clean_r):
            found.append(clean_r)
        else:
            missing.append(clean_r)

    print(f"Found: {len(found)}")
    print(f"Missing ({len(missing)}):")
    for m in missing:
        print(f"  [MISSING] {m}")

if __name__ == '__main__':
    audit()
