from pathlib import Path

svg = Path("public/brand/awa-logo.svg").read_text(encoding="utf-8")
wordmark_marker = '<g transform="matrix(1, 0, 0, 1, 134'
split_index = svg.find(wordmark_marker)
if split_index == -1:
    raise SystemExit("wordmark group marker not found in awa-logo.svg")

mascot_block = svg[:split_index]
wordmark_block = svg[split_index:].replace('fill="#000000"', 'fill="#ffffff"')
dark_svg = mascot_block + wordmark_block

Path("public/brand/awa-logo-dark.svg").write_text(dark_svg, encoding="utf-8")
print("wrote public/brand/awa-logo-dark.svg")
