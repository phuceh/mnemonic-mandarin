from supabase import create_client

SUPABASE_URL = "https://tfgdctbuhsoflecjymvw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2RjdGJ1aHNvZmxlY2p5bXZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA1NzQ1NCwiZXhwIjoyMDkzNjMzNDU0fQ.Zg3BMGoq1rURF7VNZqUyuA-0Ys1258H9fctmtIdT7pc"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
result = supabase.table("vocabulary").select("word_id").limit(1).execute()
print(f"Ping successful - {len(result.data)} row returned")
