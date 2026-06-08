from gtts import gTTS
from supabase import create_client
import os
import tempfile

SUPABASE_URL = "https://tfgdctbuhsoflecjymvw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2RjdGJ1aHNvZmxlY2p5bXZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA1NzQ1NCwiZXhwIjoyMDkzNjMzNDU0fQ.Zg3BMGoq1rURF7VNZqUyuA-0Ys1258H9fctmtIdT7pc"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table("vocabulary").select("word_id, chinese").in_("word_id", [336, 347, 357]).execute()
words = response.data

print(f"Found {len(words)} words")

for word in words:
    word_id = word["word_id"]
    chinese = word["chinese"]
    filename = f"{word_id}.mp3"
    
    try:
        tts = gTTS(text=chinese, lang='zh-TW')
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp:
            tts.save(tmp.name)
            with open(tmp.name, 'rb') as f:
                supabase.storage.from_("audio").upload(filename, f, {"content-type": "audio/mpeg"})
        os.unlink(tmp.name)
        print(f"✓ {word_id}: {chinese}")
    except Exception as e:
        print(f"✗ {word_id}: {chinese} — {e}")

print("Done!")
