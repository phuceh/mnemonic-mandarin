import os
import time
from gtts import gTTS
from supabase import create_client

env = {}
with open('.env.local') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

supabase = create_client(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])

result = supabase.table('vocabulary').select('id, chinese').execute()
words = result.data
print(f"Found {len(words)} words")

os.makedirs('audio_files', exist_ok=True)

for i, word in enumerate(words):
    chinese = word['chinese']
    word_id = word['id']
    filename = f"audio_files/{word_id}.mp3"

    try:
        tts = gTTS(text=chinese, lang='zh-CN', slow=False)
        tts.save(filename)

        with open(filename, 'rb') as f:
            supabase.storage.from_('audio').upload(
                f"{word_id}.mp3",
                f,
                {"content-type": "audio/mpeg", "upsert": "true"}
            )

        print(f"✓ {i+1}/{len(words)} — {chinese}")
        time.sleep(0.5)

    except Exception as e:
        print(f"✗ {chinese} — {e}")

print("Done!")