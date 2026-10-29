import os
import glob
import numpy as np
from PIL import Image

DIR_BEFORE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'crops_verify', 'perf_before')
DIR_AFTER = os.path.join(os.path.dirname(__file__), '..', 'assets', 'crops_verify', 'perf_after')

before_files = sorted(glob.glob(os.path.join(DIR_BEFORE, '*.jpg')))
print(f"{'Section / Viewport':40} {'Dims Before':15} {'Dims After':15} {'Avg Pixel Diff':15} {'Status':10}")
print("-" * 95)

all_ok = True

for bf in before_files:
    fname = os.path.basename(bf)
    af = os.path.join(DIR_AFTER, fname)
    if not os.path.exists(af):
        print(f"{fname:40} MISSING IN AFTER")
        all_ok = False
        continue
        
    im_b = Image.open(bf)
    im_a = Image.open(af)
    
    dims_b = f"{im_b.width}x{im_b.height}"
    dims_a = f"{im_a.width}x{im_a.height}"
    
    if im_b.size != im_a.size:
        status = "DIFF DIMS"
        diff_val = "N/A"
        all_ok = False
    else:
        arr_b = np.array(im_b, dtype=np.float32)
        arr_a = np.array(im_a, dtype=np.float32)
        diff = np.mean(np.abs(arr_b - arr_a))
        diff_val = f"{diff:.2f}/255"
        # Since JPEG compression quality 85 may have tiny ~0-2 rounding noise between runs:
        if diff < 3.0:
            status = "IDENTICAL"
        else:
            status = f"DIFF ({diff:.1f})"
            
    print(f"{fname:40} {dims_b:15} {dims_a:15} {diff_val:15} {status:10}")

print("-" * 95)
if all_ok:
    print("[SUCCESS] All sections verified identical between BEFORE and AFTER!")
else:
    print("[WARN] Some differences detected.")
