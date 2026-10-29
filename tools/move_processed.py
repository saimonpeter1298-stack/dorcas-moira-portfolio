#!/usr/bin/env python3
import os
import shutil

incoming_dir = "assets/_incoming"
originals_dir = "assets/_originals"
os.makedirs(originals_dir, exist_ok=True)

files_to_move = [
    "43aff146-95ba-42b1-892b-2d4ee6d3df27.jpeg",
    "e40a9ed0-895c-4b76-a804-33f8c353d294.jpeg",
    "ffee2085-0f67-4018-8d3c-86a767682a25.jpeg",
    "IMG_9048.jpeg",
    "IMG_9054.jpeg",
    "IMG_9057.jpeg",
    "IMG_9061.jpeg",
    "IMG_9062.jpeg",
    "IMG_9064.jpeg",
    "IMG_9068.png",
    "IMG_9080 (1).jpeg",
    "IMG_9082.jpeg",
    "IMG_9083 (1).jpeg",
]

moved = []
for fname in files_to_move:
    src = os.path.join(incoming_dir, fname)
    dst = os.path.join(originals_dir, fname)
    if os.path.exists(src):
        shutil.move(src, dst)
        moved.append(fname)
    else:
        print(f"Warning: {fname} not found in incoming")

print(f"Successfully moved {len(moved)} files to {originals_dir}")
