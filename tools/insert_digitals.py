#!/usr/bin/env python3
"""
tools/insert_digitals.py
Inserts the Digitals / Polaroids block cleanly into index.html
"""

def insert():
    with open("index.html", "r", encoding="utf-8") as f:
        c = f.read()

    target = "      </div>\n    </div>\n  </section>\n\n  <!-- ==========================================================================\n       11. CHAPITRES PHOTO"
    target_crlf = "      </div>\r\n    </div>\r\n  </section>\r\n\r\n  <!-- ==========================================================================\r\n       11. CHAPITRES PHOTO"

    block = """      </div>

      <!-- Sous-section officielle : Digitals / Polaroids -->
      <div class="digitals-showcase" id="digitals">
        <div class="editorial-header">
          <div class="editorial-header-left">
            <span class="chapter-number-pill">Polaroids d'Agence</span>
            <h3 class="chapter-title-script">Digitals / Polaroids</h3>
            <span class="chapter-mood-italic">Lumière naturelle & traits bruts · Prises de vue sans retouche</span>
          </div>
          <div class="editorial-header-right">
            <strong>Polaroid Officiel · 01</strong>
            <span>Close-Up / Face</span>
          </div>
        </div>

        <div class="digitals-grid">
          <div class="polaroid-card" data-lightbox="digital-01-face" data-placeholder="false" data-caption="Digital 01 · Portrait Face Naturel (Sans Fard)">
            <div class="polaroid-frame">
              <picture>
                <source type="image/avif" srcset="assets/images/digital-01-face-640w.avif 640w, assets/images/digital-01-face-1080w.avif 1080w, assets/images/digital-01-face-1600w.avif 1600w, assets/images/digital-01-face.avif 1717w" sizes="(max-width: 768px) 90vw, 360px">
                <source type="image/webp" srcset="assets/images/digital-01-face-640w.webp 640w, assets/images/digital-01-face-1080w.webp 1080w, assets/images/digital-01-face-1600w.webp 1600w, assets/images/digital-01-face.webp 1717w" sizes="(max-width: 768px) 90vw, 360px">
                <img src="assets/images/digital-01-face.jpg" alt="Dorcas Moïra polaroid digital t-shirt blanc visage au naturel" loading="lazy" style="object-position: 50% 30%;">
              </picture>
            </div>
            <div class="polaroid-meta">
              <span class="polaroid-tag">DIGITAL 01 — FACE</span>
              <span class="polaroid-spec">T-shirt blanc · Cheveux naturels · 0 Retouche</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       11. CHAPITRES PHOTO"""

    if target in c:
        c = c.replace(target, block, 1)
        print("Replaced LF target")
    elif target_crlf in c:
        block_crlf = block.replace("\n", "\r\n")
        c = c.replace(target_crlf, block_crlf, 1)
        print("Replaced CRLF target")
    else:
        print("[ERROR] target not found")
        return

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(c)
    print("[SUCCESS] Digitals inserted into index.html")

if __name__ == "__main__":
    insert()
