import os
from PIL import Image

INCOMING = "assets/_incoming"
THUMB_DIR = "assets/crops_verify/thumbnails"
os.makedirs(THUMB_DIR, exist_ok=True)

files_to_check = [
    ("IMG_9062.jpeg", "01-signature-02"),
    ("IMG_9061.jpeg", "02-many-moods-03"),
    ("IMG_9054.jpeg", "02-many-moods-04"),
    ("e40a9ed0-895c-4b76-a804-33f8c353d294.jpeg", "03-afro-chic-02"),
    ("IMG_9068.png", "03-afro-chic-03"),
    ("IMG_9048.jpeg", "04-studio-01"),
    ("IMG_9083 (1).jpeg", "05-sun-kissed-02"),
    ("IMG_9080 (1).jpeg", "05-sun-kissed-03"),
    ("IMG_9057.jpeg", "06-visual-01"),
    ("IMG_9064.jpeg", "beauty-portrait"),
    ("IMG_9082.jpeg", "digital-01-face"),
    ("43aff146-95ba-42b1-892b-2d4ee6d3df27.jpeg", "timeline-2024-kuba"),
    ("ffee2085-0f67-4018-8d3c-86a767682a25.jpeg", "timeline-2026-djino-backstage")
]

for src_name, label in files_to_check:
    src_path = os.path.join(INCOMING, src_name)
    im = Image.open(src_path)
    im = im.convert("RGB")
    im.thumbnail((360, 360))
    out_path = os.path.join(THUMB_DIR, f"{label}.jpg")
    im.save(out_path, "JPEG", quality=85)

print("All thumbnails generated.")
