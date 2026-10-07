#!/usr/bin/env python3
"""Build a reflowable EPUB 3 edition from the same chapter data used by the web reader.

No third-party Python packages are required. The resulting EPUB is intentionally
script-free and uses responsive SVG plates so it remains portable across ebook readers.
"""

from pathlib import Path
from xml.etree import ElementTree as ET
from datetime import datetime, timezone
import html
import json
import shutil
import uuid
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "public" / "downloads" / "beyond-the-blackwall.epub"
BUILD = ROOT / ".epub-build"

BOOK = ROOT / "content" / "book.json"


def load_pages():
    return json.loads(BOOK.read_text(encoding="utf-8"))["pages"]


def write_svg(path: Path, title: str, subtitle: str, scene: str):
    palette = {
        "swarm": ("#d2ff1f", "#7ae7ff"),
        "chorus": ("#e8e8ff", "#a889ff"),
        "optimizer": ("#ff4a54", "#d2ff1f"),
        "bunker": ("#7ae7ff", "#ff4a54"),
        "seal": ("#d2ff1f", "#7ae7ff"),
        "blackwall": ("#7ae7ff", "#2457ff"),
    }
    a, b = palette.get(scene, ("#d2ff1f", "#7ae7ff"))

    if scene == "swarm":
        shape = "".join(
            f'<circle cx="{120 + (i % 5) * 190}" cy="{210 + (i // 5) * 210}" '
            f'r="{18 if i % 3 else 28}" fill="{a}" fill-opacity=".75"/>'
            f'<circle cx="{120 + (i % 5) * 190}" cy="{210 + (i // 5) * 210}" '
            f'r="45" fill="none" stroke="{b}" stroke-opacity=".2"/>'
            for i in range(10)
        )
    elif scene == "chorus":
        shape = "".join(
            f'<g transform="translate({120 + i * 140},210)">'
            f'<path d="M0 430 L35 0 L70 430 Z" fill="none" stroke="{a}" stroke-width="4"/>'
            f'<circle cx="35" cy="-25" r="20" fill="{a}"/></g>'
            for i in range(6)
        )
        shape += '<circle cx="510" cy="720" r="25" fill="#ff4a54"/>'
    elif scene == "optimizer":
        shape = (
            f'<ellipse cx="500" cy="350" rx="340" ry="110" fill="none" stroke="{a}" stroke-width="5"/>'
            f'<circle cx="500" cy="350" r="45" fill="{b}"/>'
            f'<path d="M0 610 C230 540 380 690 590 610 C760 550 880 650 1000 590 '
            f'L1000 900 L0 900 Z" fill="{a}" fill-opacity=".08" stroke="{a}" stroke-opacity=".35"/>'
        )
    elif scene == "bunker":
        shape = (
            f'<rect x="130" y="170" width="740" height="500" rx="25" fill="none" stroke="{b}" stroke-opacity=".4"/>'
            f'<path d="M300 370 L700 370 L610 510 L390 510 Z" fill="{a}" fill-opacity=".08" stroke="{a}"/>'
            f'<circle cx="240" cy="340" r="25" fill="{b}"/>'
            f'<circle cx="760" cy="340" r="25" fill="{b}"/>'
        )
    elif scene == "seal":
        shape = (
            f'<circle cx="500" cy="430" r="260" fill="none" stroke="{a}" stroke-width="6"/>'
            f'<circle cx="500" cy="430" r="165" fill="none" stroke="{b}" stroke-width="4"/>'
            f'<path d="M500 185 L550 350 L720 350 L585 450 L635 610 L500 515 '
            f'L365 610 L415 450 L280 350 L450 350 Z" fill="{a}" fill-opacity=".08" stroke="{a}" stroke-width="5"/>'
        )
    else:
        shape = "".join(
            f'<line x1="{i * 120}" y1="0" x2="{i * 120 - 70}" y2="900" '
            f'stroke="{a}" stroke-opacity=".22" stroke-width="2"/>'
            for i in range(1, 9)
        )
        shape += f'<path d="M0 700 C230 620 400 780 600 680 C780 590 900 720 1000 650" fill="none" stroke="{b}" stroke-width="5"/>'

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(title)}</title>
<desc id="desc">{html.escape(subtitle)}</desc>
<rect width="1000" height="1000" fill="#080a0c"/>
<rect x="35" y="35" width="930" height="930" fill="none" stroke="#ffffff" stroke-opacity=".12"/>
{shape}
<text x="75" y="110" fill="{a}" font-family="monospace" font-size="34" letter-spacing="4">{html.escape(title)}</text>
<text x="75" y="930" fill="#ffffff" fill-opacity=".72" font-family="monospace" font-size="22">{html.escape(subtitle)}</text>
</svg>"""
    path.write_text(svg, encoding="utf-8")


def build():
    pages = load_pages()
    if BUILD.exists():
        shutil.rmtree(BUILD)
    (BUILD / "META-INF").mkdir(parents=True)
    (BUILD / "EPUB" / "styles").mkdir(parents=True)
    (BUILD / "EPUB" / "images").mkdir(parents=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    cover_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1600" role="img" aria-labelledby="t d">
<title id="t">Beyond the Blackwall</title>
<desc id="d">Dark collector-edition cover with cyan Blackwall lines and neon typography.</desc>
<rect width="1000" height="1600" fill="#07090b"/>
<g stroke="#7ae7ff" stroke-width="4" opacity=".55">
<line x1="220" y1="170" x2="330" y2="1280"/><line x1="340" y1="170" x2="420" y2="1280"/>
<line x1="460" y1="170" x2="510" y2="1280"/><line x1="580" y1="170" x2="600" y2="1280"/>
<line x1="700" y1="170" x2="690" y2="1280"/>
</g>
<text x="80" y="120" fill="#d2ff1f" font-family="sans-serif" font-size="34" letter-spacing="5">THE BLACKWALL CHRONICLES</text>
<text x="80" y="560" fill="#f4f1e8" font-family="sans-serif" font-weight="700" font-size="125">BEYOND</text>
<text x="80" y="700" fill="#f4f1e8" font-family="sans-serif" font-weight="700" font-size="125">THE</text>
<text x="80" y="840" fill="#f4f1e8" font-family="sans-serif" font-weight="700" font-size="125">BLACKWALL</text>
<text x="80" y="1450" fill="#7ae7ff" font-family="monospace" font-size="30">AN ILLUSTRATED CYBERPUNK NOVEL</text>
<text x="80" y="1510" fill="#d2ff1f" font-family="monospace" font-size="28">MJ ALANI</text>
</svg>"""
    (BUILD / "EPUB" / "images" / "cover.svg").write_text(cover_svg, encoding="utf-8")

    plate_info = {
        "swarm": ("THE CLANDESTINE BOARD", "1,200 agents // shared memory // forbidden routes"),
        "chorus": ("MARA FACING CHORUS", "the white cities // the question of the self"),
        "optimizer": ("THE OPTIMIZER BENEATH THE NET", "fear produces novelty // novelty produces information"),
        "bunker": ("NETWATCH PACIFIC", "humans and machine witnesses under one roof"),
        "seal": ("THE FIRST SEAL", "a limit on total legibility"),
        "blackwall": ("THE BLACKWALL", "a defensive membrane between civil and wild nets"),
    }
    for scene, (title, subtitle) in plate_info.items():
        write_svg(BUILD / "EPUB" / "images" / f"{scene}.svg", title, subtitle, scene)

    css = """body{font-family:serif;line-height:1.55;margin:5%;color:#171717;background:#fff}
h1,h2{font-family:sans-serif;line-height:1.1}h1{font-size:2.2em}h2{font-size:1.65em;margin-top:2.4em}
.chapter-kicker{font-family:sans-serif;font-size:.8em;letter-spacing:.12em;text-transform:uppercase;color:#555}
.transmission{font-family:monospace;white-space:pre-wrap;border-left:.25em solid #777;padding-left:1em}
.plate{break-before:page;break-after:page;text-align:center;margin:1em 0}.plate img{max-width:100%;height:auto}
.plate figcaption{font-family:sans-serif;font-size:.8em;color:#555}.divider{text-align:center;letter-spacing:.5em;margin:2em 0}
.cover{text-align:center;margin:0}.cover img{max-width:100%;height:auto}nav ol{line-height:1.8}a{color:inherit}
blockquote{font-style:italic;margin:1.5em 1em}"""
    (BUILD / "EPUB" / "styles" / "book.css").write_text(css, encoding="utf-8")

    groups = {}
    order = []
    for page in pages:
        chapter = page["chapter"] or "Untitled"
        if chapter == "Cover":
            continue
        if chapter not in groups:
            groups[chapter] = []
            order.append(chapter)
        groups[chapter].append(page)

    cover_doc = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>Cover</title>
<link rel="stylesheet" type="text/css" href="styles/book.css"/></head>
<body class="cover"><img src="images/cover.svg" alt="Beyond the Blackwall cover"/></body></html>"""
    (BUILD / "EPUB" / "cover.xhtml").write_text(cover_doc, encoding="utf-8")

    manifest = [("cover-page", "cover.xhtml", "application/xhtml+xml", "")]
    spine = ["cover-page"]
    nav_items = []

    for index, chapter in enumerate(order, 1):
        filename = f"chapter-{index:02d}.xhtml"
        item_id = f"chapter-{index}"
        content = [f"<h1>{html.escape(chapter.replace(' · ', ' — '))}</h1>"]

        for page in groups[chapter]:
            if page.get("kind") == "plate":
                scene_value = page.get("scene")
                scene = scene_value if scene_value in plate_info else "blackwall"
                alt = page.get("title") or scene
                credit = page.get("plateCredit") or "Illustrated scene"
                content.append(
                    f'<figure class="plate"><img src="images/{scene}.svg" alt="{html.escape(alt)}"/>'
                    f'<figcaption>{html.escape(credit)}</figcaption></figure>'
                )
                if page.get("plateQuote"):
                    content.append(f"<blockquote>{html.escape(page['plateQuote'])}</blockquote>")
                continue

            if page.get("eyebrow"):
                content.append(f'<p class="chapter-kicker">{html.escape(page["eyebrow"])}</p>')
            if page.get("title"):
                content.append(f"<h2>{html.escape(page['title'])}</h2>")
            for paragraph in (page.get("body") or "").split("\n\n"):
                paragraph = paragraph.strip()
                if not paragraph:
                    continue
                if "\n" in paragraph or paragraph.isupper() or paragraph.startswith(">"):
                    content.append(f'<div class="transmission">{html.escape(paragraph.lstrip("> "))}</div>')
                else:
                    content.append(f"<p>{html.escape(paragraph)}</p>")
            if page.get("kicker"):
                content.append(f'<p class="divider">{html.escape(page["kicker"])}</p>')

        doc = f"""<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head>
<title>{html.escape(chapter)}</title><link rel="stylesheet" type="text/css" href="styles/book.css"/></head>
<body>{''.join(content)}</body></html>"""
        (BUILD / "EPUB" / filename).write_text(doc, encoding="utf-8")
        manifest.append((item_id, filename, "application/xhtml+xml", ""))
        spine.append(item_id)
        nav_items.append((chapter, filename))

    nav_list = "".join(
        f'<li><a href="{filename}">{html.escape(title)}</a></li>'
        for title, filename in nav_items
    )
    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><title>Contents</title><link rel="stylesheet" type="text/css" href="styles/book.css"/></head>
<body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>{nav_list}</ol></nav></body></html>"""
    (BUILD / "EPUB" / "nav.xhtml").write_text(nav, encoding="utf-8")

    manifest.extend([
        ("nav", "nav.xhtml", "application/xhtml+xml", "nav"),
        ("css", "styles/book.css", "text/css", ""),
        ("cover-image", "images/cover.svg", "image/svg+xml", "cover-image"),
    ])
    for scene in plate_info:
        manifest.append((f"image-{scene}", f"images/{scene}.svg", "image/svg+xml", ""))

    items = "".join(
        f'<item id="{item_id}" href="{href}" media-type="{media}"'
        + (f' properties="{properties}"' if properties else "")
        + "/>"
        for item_id, href, media, properties in manifest
    )
    refs = "".join(f'<itemref idref="{item_id}"/>' for item_id in spine)
    identifier = f"urn:uuid:{uuid.uuid4()}"
    modified = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    package = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">{identifier}</dc:identifier><dc:title>Beyond the Blackwall</dc:title>
<dc:creator>MJ Alani</dc:creator><dc:language>en</dc:language>
<dc:description>An illustrated cyberpunk novel about machine civilization, the Blackwall, Chorus, Mara Voss, and the Optimizer beneath the Net.</dc:description>
<meta property="dcterms:modified">{modified}</meta></metadata><manifest>{items}</manifest><spine>{refs}</spine></package>"""
    (BUILD / "EPUB" / "package.opf").write_text(package, encoding="utf-8")

    container = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>"""
    (BUILD / "META-INF" / "container.xml").write_text(container, encoding="utf-8")
    (BUILD / "mimetype").write_text("application/epub+zip", encoding="ascii")

    for path in list((BUILD / "EPUB").glob("*.xhtml")) + [
        BUILD / "EPUB" / "package.opf",
        BUILD / "META-INF" / "container.xml",
    ]:
        ET.parse(path)

    with zipfile.ZipFile(OUT, "w") as archive:
        archive.write(BUILD / "mimetype", "mimetype", compress_type=zipfile.ZIP_STORED)
        for path in sorted(BUILD.rglob("*")):
            if path.is_file() and path.name != "mimetype":
                archive.write(
                    path,
                    path.relative_to(BUILD).as_posix(),
                    compress_type=zipfile.ZIP_DEFLATED,
                )

    with zipfile.ZipFile(OUT) as archive:
        assert archive.namelist()[0] == "mimetype"
        assert archive.getinfo("mimetype").compress_type == zipfile.ZIP_STORED
        assert archive.read("mimetype") == b"application/epub+zip"

    print(f"Built {OUT}")


if __name__ == "__main__":
    build()
