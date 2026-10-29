with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = """.loader-signature-svg {
  width: min(340px, 80vw);
  height: 90px;
  overflow: visible;
}

.signature-stroke {
  fill: none;
  stroke: url(#copper-grad-loader);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: drawSignature 1.25s var(--ease-waw) forwards;
}

@keyframes drawSignature {
  to { stroke-dashoffset: 0; }
}"""

replacement = """.loader-signature-svg {
  width: min(380px, 88vw);
  height: 95px;
  overflow: visible;
}

.signature-script-text {
  font-family: var(--font-script-formal), var(--font-script), 'Mrs Saint Delafield', cursive;
  font-size: 70px;
  font-weight: 400;
  fill: transparent;
  stroke: url(#copper-grad-loader);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawScriptSignature 1.8s var(--ease-waw) forwards;
}

@keyframes drawScriptSignature {
  0% {
    stroke-dashoffset: 600;
    fill: transparent;
  }
  75% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  100% {
    stroke-dashoffset: 0;
    fill: url(#copper-grad-loader);
  }
}

.signature-stroke {
  fill: none;
  stroke: url(#copper-grad-loader);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: drawSignature 1.25s var(--ease-waw) forwards;
}

@keyframes drawSignature {
  to { stroke-dashoffset: 0; }
}"""

# Normalize \r\n for matching
target_crlf = target.replace('\n', '\r\n')
replacement_crlf = replacement.replace('\n', '\r\n')

if target_crlf in css:
    css = css.replace(target_crlf, replacement_crlf, 1)
    print("Replaced with CRLF")
elif target in css:
    css = css.replace(target, replacement, 1)
    print("Replaced with LF")
else:
    print("Target not found in css/style.css")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated css/style.css successfully!")
