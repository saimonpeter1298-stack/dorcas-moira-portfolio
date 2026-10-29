#!/usr/bin/env python3
"""
tools/fix_data_js.py
Fixes line 219 and adds 06-visual-01 real photo support in js/data.js
"""

def fix():
    with open("js/data.js", "r", encoding="utf-8") as f:
        c = f.read()

    # 1. Fix 01-signature-03
    bad_part = """          placeholder: idx === 0 ? false : true,
          credit: null,
          focus: idx === 0 ? "50% 20%" : "50% 35%\""""
    good_part = "          placeholder: true"
    if bad_part in c:
        c = c.replace(bad_part, good_part)
        print("Fixed 01-signature-03 LF")
    elif bad_part.replace("\n", "\r\n") in c:
        c = c.replace(bad_part.replace("\n", "\r\n"), good_part)
        print("Fixed 01-signature-03 CRLF")
    else:
        print("[WARN] bad_part not found")

    # 2. Update 06-visual-01
    old_visual = """        return {
          src: `assets/images/06-visual-${pad}.jpg`,
          alt: `Dorcas Moïra Look ${pad} - ${cat.toUpperCase()}`,
          category: cat,
          ratio: isTall ? "9/16" : "4/5",
          isTall: isTall,
          focus: isTall ? "50% 35%" : "50% 30%",
          placeholder: true,
          credit: null,
          captionFr: `Look ${pad} · ${cat.toUpperCase()}`,
          captionEn: `Look ${pad} · ${cat.toUpperCase()}`
        };"""

    new_visual = """        const isFirst = (i === 0);
        return {
          src: `assets/images/06-visual-${pad}.jpg`,
          alt: isFirst ? "Dorcas Moïra trench marron en pied lunettes et sculpture orange" : `Dorcas Moïra Look ${pad} - ${cat.toUpperCase()}`,
          category: cat,
          ratio: isTall ? "9/16" : "4/5",
          isTall: isTall,
          focus: isFirst ? "50% 20%" : (isTall ? "50% 35%" : "50% 30%"),
          placeholder: isFirst ? false : true,
          credit: null,
          captionFr: isFirst ? "Trench Marron & Sculpture Orange" : `Look ${pad} · ${cat.toUpperCase()}`,
          captionEn: isFirst ? "Brown Trench & Orange Sculpture" : `Look ${pad} · ${cat.toUpperCase()}`
        };"""

    if old_visual in c:
        c = c.replace(old_visual, new_visual)
        print("Updated 06-visual-01 LF")
    elif old_visual.replace("\n", "\r\n") in c:
        c = c.replace(old_visual.replace("\n", "\r\n"), new_visual.replace("\n", "\r\n"))
        print("Updated 06-visual-01 CRLF")
    else:
        print("[WARN] old_visual not found")

    with open("js/data.js", "w", encoding="utf-8") as f:
        f.write(c)
    print("Saved js/data.js")

if __name__ == "__main__":
    fix()
