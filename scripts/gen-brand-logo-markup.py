from pathlib import Path

svg = Path("public/brand/awa-logo.svg").read_text(encoding="utf-8")
wordmark_marker = '<g transform="matrix(1, 0, 0, 1, 134'
split_index = svg.find(wordmark_marker)
if split_index == -1:
    raise SystemExit("wordmark group marker not found in awa-logo.svg")

mascot_block = svg[:split_index]
wordmark_block = svg[split_index:].replace('fill="#000000"', 'fill="currentColor"')
processed = mascot_block + wordmark_block

start = processed.find("<svg")
end = processed.rfind("</svg>") + 6
inner = processed[start:end]

out = Path("src/components/brand/awa-brand-logo-markup.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "// Auto-derived from public/brand/awa-logo.svg — wordmark black paths use currentColor.\n"
    f"export const AWA_BRAND_LOGO_SVG = {inner!r} as const;\n",
    encoding="utf-8",
)
print(f"wrote {out} ({len(inner)} chars)")
