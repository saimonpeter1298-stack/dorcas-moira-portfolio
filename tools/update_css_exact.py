#!/usr/bin/env python3
with open("css/style.css", "r", encoding="utf-8") as f:
    c = f.read()

old_block = """/* --- SECTION POURQUOI MOI RECADRAGE MOBILE --- */
.why-portrait-wrap img {
  object-position: 35% 30% !important;
}

@media (max-width: 768px) {
  .why-portrait-wrap {
    max-height: 480px;
  }
  .why-portrait-wrap img {
    object-position: 35% 25% !important;
  }
}"""

new_block = """/* --- SECTION POURQUOI MOI RECADRAGE MOBILE --- */
.why-portrait-wrap picture,
.polaroid-frame picture,
.carousel-card-media picture {
  display: block;
  width: 100%;
  height: 100%;
}

.carousel-card-media picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.85s var(--ease-waw);
}

.carousel-card:hover .carousel-card-media picture img {
  transform: scale(1.05);
}

.why-portrait-wrap img {
  object-position: 35% 30% !important;
}

@media (max-width: 768px) {
  .why-portrait-wrap {
    max-height: 480px;
  }
  .why-portrait-wrap img {
    object-position: 35% 25% !important;
  }
}"""

if old_block in c:
    c = c.replace(old_block, new_block)
    print("Replaced LF")
elif old_block.replace("\n", "\r\n") in c:
    c = c.replace(old_block.replace("\n", "\r\n"), new_block.replace("\n", "\r\n"))
    print("Replaced CRLF")
else:
    print("[ERROR] not found")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(c)
print("Updated css/style.css")
