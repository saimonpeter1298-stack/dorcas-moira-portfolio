import os
import shutil
from PIL import Image

uploaded_dir = r"C:\Users\Admin\.gemini\antigravity\brain\0c4483e2-546d-4b83-a051-bd950a4a6f53\.user_uploaded"
images_dir = "assets/images"
os.makedirs(images_dir, exist_ok=True)

# 1. Kimono wax rouille -> hero-portrait.jpg
kimono_src = os.path.join(uploaded_dir, "media_1793149498199_9a4d04a8.jpg")
shutil.copy2(kimono_src, os.path.join(images_dir, "hero-portrait.jpg"))
print("Copied hero-portrait.jpg")

# 2. Profil au chapeau à cauris -> 01-signature-01.jpg (convert to RGB JPEG high quality)
cauris_src = os.path.join(uploaded_dir, "media_1793149499086_95edfd94.png")
with Image.open(cauris_src) as img:
    rgb_img = img.convert("RGB")
    rgb_img.save(os.path.join(images_dir, "01-signature-01.jpg"), "JPEG", quality=95)
print("Saved 01-signature-01.jpg")

# 3. Boubou lilas -> about-portrait.jpg
lilas_src = os.path.join(uploaded_dir, "media_1793149498156_7e7f7a8d.jpg")
shutil.copy2(lilas_src, os.path.join(images_dir, "about-portrait.jpg"))
# Also set to 02-many-moods-01.jpg or keep about-portrait
print("Copied about-portrait.jpg")

# 4. Couloir d'hôtel -> 03-afro-chic-01.jpg
couloir_src = os.path.join(uploaded_dir, "media_1793149498156_16b7491f.jpg")
shutil.copy2(couloir_src, os.path.join(images_dir, "03-afro-chic-01.jpg"))
print("Copied 03-afro-chic-01.jpg")

# 5. Plage de nuit -> comp-card-full.jpg ET 05-sun-kissed-01.jpg
plage_src = os.path.join(uploaded_dir, "media_1793149498156_520aac3a.jpg")
shutil.copy2(plage_src, os.path.join(images_dir, "comp-card-full.jpg"))
shutil.copy2(plage_src, os.path.join(images_dir, "05-sun-kissed-01.jpg"))
print("Copied comp-card-full.jpg and 05-sun-kissed-01.jpg")
