import os, shutil, hashlib
from PIL import Image, features

SRC = 'assets/_incoming/hero-cutout.png.png'
IMG = 'assets/images'
BK = 'assets/_backup'
os.makedirs(BK, exist_ok=True)

# 1. Backup old hero cutout files (never overwrite an existing backup)
for f in ('hero-cutout.png', 'hero-cutout.webp', 'hero-cutout.avif'):
    src = os.path.join(IMG, f)
    dst = os.path.join(BK, f.replace('hero-cutout', 'hero-cutout-old-356x421'))
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copy2(src, dst)
    print('backup', dst, os.path.getsize(dst))

# 2. Place master PNG byte-for-byte (no re-encode, no crop)
shutil.copyfile(SRC, os.path.join(IMG, 'hero-cutout.png'))
md5 = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()
assert md5(SRC) == md5(os.path.join(IMG, 'hero-cutout.png'))
print('master copied, md5 identical')

print('AVIF support:', features.check('avif'))
im = Image.open(SRC)
im.load()
assert im.mode == 'RGBA'
W, H = im.size

targets = [800, 1200, 1800, 2400, W]  # W = full-size (2686w) top candidate
for tw in targets:
    if tw > W:
        continue  # never upscale
    if tw == W:
        r, suffix = im, ''
    else:
        th = round(H * tw / W)
        r, suffix = im.resize((tw, th), Image.Resampling.LANCZOS), f'-{tw}w'
    wp = os.path.join(IMG, f'hero-cutout{suffix}.webp')
    r.save(wp, 'WEBP', quality=92, method=6, exact=True)
    ap = os.path.join(IMG, f'hero-cutout{suffix}.avif')
    r.save(ap, 'AVIF', quality=90, speed=4)
    for p in (wp, ap):
        chk = Image.open(p)
        print(p, chk.size, chk.mode, os.path.getsize(p))
