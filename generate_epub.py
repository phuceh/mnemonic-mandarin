import requests
import os
import zipfile
from supabase import create_client

SUPABASE_URL = "https://tfgdctbuhsoflecjymvw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2RjdGJ1aHNvZmxlY2p5bXZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA1NzQ1NCwiZXhwIjoyMDkzNjMzNDU0fQ.Zg3BMGoq1rURF7VNZqUyuA-0Ys1258H9fctmtIdT7pc"
hsk_level = 3
OUTPUT = f"/workspaces/mnemonic-mandarin/HSK{hsk_level}_Memorize_Mandarin.epub"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CSS = '''
body { font-family: Georgia, serif; margin: 1em; color: #2d1810; }
.word-number { font-size: 0.7em; color: #b08060; text-align: center; margin-bottom: 0; }
.chinese { font-size: 2.5em; font-weight: bold; text-align: center; color: #2d1810; margin: 0.1em 0; }
.pinyin { font-size: 1.1em; color: #8b5a3a; text-align: center; margin: 0.2em 0; }
.english { font-size: 0.9em; font-weight: bold; color: #b08060; text-align: center; text-transform: uppercase; margin: 0.2em 0; }
.mnemonic-label { font-size: 0.65em; font-weight: bold; color: #c0392b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1em; margin-bottom: 0.2em; }
.mnemonic-text { font-size: 0.85em; font-style: italic; color: #2d1810; line-height: 1.5; margin-bottom: 0.8em; }
.word-image { display: block; margin: 0.5em auto; max-width: 90%; }
.intro-title { font-size: 1.4em; font-weight: bold; color: #2d1810; margin-bottom: 1em; }
.intro-text { font-size: 0.9em; line-height: 1.7; color: #2d1810; }
.cta-title { font-size: 1.4em; font-weight: bold; color: #2d1810; text-align: center; margin-bottom: 1em; }
.cta-text { font-size: 0.9em; text-align: center; color: #5a3a2a; line-height: 1.7; margin-bottom: 1em; }
.cta-url { font-size: 1.1em; font-weight: bold; color: #c0392b; text-align: center; display: block; margin: 0.5em 0; }
.cta-sub { font-size: 0.85em; color: #8b5a3a; text-align: center; }
.title-page { text-align: center; margin-top: 3em; }
.title-main { font-size: 1.8em; font-weight: bold; color: #2d1810; margin-bottom: 0.2em; }
.title-hsk { font-size: 1.3em; color: #c0392b; margin-bottom: 0.8em; }
.title-sub { font-size: 0.9em; color: #8b5a3a; line-height: 1.6; margin-bottom: 1.5em; }
.title-author { font-size: 0.95em; font-weight: bold; color: #2d1810; margin-top: 2em; }
'''

def xhtml(title, body):
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
  <title>{title}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
{body}
</body>
</html>'''

def word_body(word, number, has_image):
    img = f'<img class="word-image" src="../images/{word["word_id"]}.png" alt="{word["english"]}"/>' if has_image else ''
    return f'''<p class="word-number">{number}.</p>
<p class="chinese">{word["chinese"]}</p>
<p class="pinyin">{word["pinyin"]}</p>
<p class="english">{word["english"]}</p>
<p class="mnemonic-label">Mnemonic</p>
<p class="mnemonic-text">{word["mnemonic"]}</p>
{img}'''

TITLE_BODY = f'''<div class="title-page">
<p class="title-main">Memorize Mandarin</p>
<p class="title-hsk">HSK {hsk_level} Vocabulary</p>
<p class="title-sub">Learn Mandarin words that actually stick<br/>with mnemonic stories</p>
<p class="title-author">J. Fisk</p>
</div>'''

COPYRIGHT_BODY = '''<p style="text-align:center;margin-top:3em;">&#169; 2026 J. Fisk</p>
<p style="text-align:center;margin-top:1em;font-size:0.85em;color:#5a3a2a;line-height:1.7;">
All rights reserved. No part of this publication may be reproduced, stored, or transmitted
in any form or by any means, electronic, mechanical, photocopying, recording, scanning, or
otherwise without written permission from the publisher. It is illegal to copy this book,
post it to a website, or distribute it by any other means without permission.
</p>
<p style="text-align:center;margin-top:1.5em;font-size:0.85em;color:#5a3a2a;">First edition</p>'''

INTRO_BODY = f'''<p class="intro-title">Introduction</p>
<p class="intro-text">Welcome to Memorize Mandarin - HSK {hsk_level} Vocabulary.<br/><br/>
This book is designed to be used alongside your Mandarin studies as a powerful memorisation tool.
Rather than relying on repetition alone, each word is paired with a vivid mnemonic story that
phonetically encodes the sound. Your brain is wired to remember stories, images and emotions far
more effectively than lists - and that is exactly what this book exploits.<br/><br/>
For each word, read the mnemonic out loud and picture the scene as vividly as possible.
The more absurd and vivid the image in your mind, the more likely it is to stick.
Work through the book at your own pace, and return to any words you find difficult.
Over time you will find that the mnemonics come to mind automatically whenever you
encounter the word - which is exactly the goal.<br/><br/>
Good luck with your Mandarin journey. &#21152;&#27833;&#65281;</p>'''

CTA_BODY = f'''<p class="cta-title">Want the full experience?</p>
<p class="cta-text">This book covers HSK {hsk_level}. The full Memorize Mandarin app includes multiple HSK levels
with audio pronunciation, interactive flashcards, quizzes and progress tracking.
New levels are added regularly.</p>
<a class="cta-url" href="https://www.memorizemandarin.com">memorizemandarin.com</a>
<p class="cta-sub">Free trial - no account needed</p>'''

# Fetch words
print(f"Fetching HSK{hsk_level} words...")
response = supabase.table("vocabulary").select(
    "word_id, chinese, pinyin, english, mnemonic, image_url"
).eq("hsk_level", hsk_level).order("word_id").execute()
words = response.data
print(f"Found {len(words)} words")

# Download images
print("Downloading images...")
images = {}
for i, word in enumerate(words):
    if word.get('image_url'):
        try:
            for attempt in range(3):
                r = requests.get(word['image_url'], timeout=15)
                if r.content[:4] == b'\x89PNG' or r.content[:2] == b'\xff\xd8':
                    images[word['word_id']] = r.content
                    break
                else:
                    print(f"  Retry {attempt+1} for {word['chinese']} ({word['word_id']})")
        except Exception as e:
            print(f"  Image error for {word['chinese']}: {e}")
    if (i+1) % 50 == 0:
        print(f"  {i+1}/{len(words)} images done...")

# Build manifest and spine
manifest_items = []
spine_items = []

manifest_items.append('    <item id="style" href="css/style.css" media-type="text/css"/>')
manifest_items.append('    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>')
manifest_items.append('    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>')

# Cover
cover_path = f'/workspaces/mnemonic-mandarin/hsk{hsk_level}_cover.png'
has_cover = os.path.exists(cover_path)
if has_cover:
    manifest_items.append('    <item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/>')
    manifest_items.append('    <item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/>')
    spine_items.append('    <itemref idref="cover"/>')

# Title page
manifest_items.append('    <item id="titlepage" href="text/titlepage.xhtml" media-type="application/xhtml+xml"/>')
spine_items.append('    <itemref idref="titlepage"/>')

# Copyright
manifest_items.append('    <item id="copyright" href="text/copyright.xhtml" media-type="application/xhtml+xml"/>')
spine_items.append('    <itemref idref="copyright"/>')

# Intro
manifest_items.append('    <item id="intro" href="text/intro.xhtml" media-type="application/xhtml+xml"/>')
spine_items.append('    <itemref idref="intro"/>')

for word in words:
    wid = word['word_id']
    manifest_items.append(f'    <item id="word{wid}" href="text/word{wid}.xhtml" media-type="application/xhtml+xml"/>')
    if wid in images:
        manifest_items.append(f'    <item id="img{wid}" href="images/{wid}.png" media-type="image/png"/>')
    spine_items.append(f'    <itemref idref="word{wid}"/>')

manifest_items.append('    <item id="cta" href="text/cta.xhtml" media-type="application/xhtml+xml"/>')
spine_items.append('    <itemref idref="cta"/>')

# TOC entries
toc_nav_items = ['<li><a href="text/intro.xhtml">Introduction</a></li>']
toc_ncx_items = [f'<navPoint id="intro" playOrder="1"><navLabel><text>Introduction</text></navLabel><content src="text/intro.xhtml"/></navPoint>']

for i, word in enumerate(words):
    wid = word['word_id']
    label = f'{i+1}. {word["chinese"]} - {word["english"]}'
    toc_nav_items.append(f'<li><a href="text/word{wid}.xhtml">{label}</a></li>')
    toc_ncx_items.append(f'<navPoint id="word{wid}" playOrder="{i+2}"><navLabel><text>{label}</text></navLabel><content src="text/word{wid}.xhtml"/></navPoint>')

toc_nav_items.append('<li><a href="text/cta.xhtml">Want the full experience?</a></li>')
toc_ncx_items.append(f'<navPoint id="cta" playOrder="{len(words)+2}"><navLabel><text>Want the full experience?</text></navLabel><content src="text/cta.xhtml"/></navPoint>')

OPF = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">memorize-mandarin-hsk{hsk_level}</dc:identifier>
    <dc:title>Memorize Mandarin - HSK {hsk_level} Vocabulary</dc:title>
    <dc:creator>J. Fisk</dc:creator>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">2026-08-31T00:00:00Z</meta>
  </metadata>
  <manifest>
{chr(10).join(manifest_items)}
  </manifest>
  <spine toc="ncx">
{chr(10).join(spine_items)}
  </spine>
</package>'''

NAV = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>
<body>
<nav epub:type="toc">
<h1>Table of Contents</h1>
<ol>
{''.join(toc_nav_items)}
</ol>
</nav>
</body>
</html>'''

NCX = f'''<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="memorize-mandarin-hsk{hsk_level}"/>
  </head>
  <docTitle><text>Memorize Mandarin HSK {hsk_level}</text></docTitle>
  <navMap>
{''.join(toc_ncx_items)}
  </navMap>
</ncx>'''

COVER_XHTML = xhtml('Cover', '<img src="../images/cover.png" alt="Cover" style="max-width:100%;"/>')

# Write epub
print(f"Writing epub...")
with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.writestr('mimetype', 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
    zf.writestr('META-INF/container.xml', '''<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>''')
    zf.writestr('EPUB/content.opf', OPF)
    zf.writestr('EPUB/toc.ncx', NCX)
    zf.writestr('EPUB/nav.xhtml', NAV)
    zf.writestr('EPUB/css/style.css', CSS)
    if has_cover:
        with open(cover_path, 'rb') as f:
            zf.writestr('EPUB/images/cover.png', f.read())
        zf.writestr('EPUB/text/cover.xhtml', COVER_XHTML)
    zf.writestr('EPUB/text/titlepage.xhtml', xhtml('Memorize Mandarin', TITLE_BODY))
    zf.writestr('EPUB/text/copyright.xhtml', xhtml('Copyright', COPYRIGHT_BODY))
    zf.writestr('EPUB/text/intro.xhtml', xhtml('Introduction', INTRO_BODY))
    for i, word in enumerate(words):
        wid = word['word_id']
        has_img = wid in images
        zf.writestr(f'EPUB/text/word{wid}.xhtml', xhtml(f'{word["chinese"]} - {word["english"]}', word_body(word, i+1, has_img)))
        if has_img:
            zf.writestr(f'EPUB/images/{wid}.png', images[wid])
    zf.writestr('EPUB/text/cta.xhtml', xhtml('Want the full experience?', CTA_BODY))

print(f"Done! -> {OUTPUT}")