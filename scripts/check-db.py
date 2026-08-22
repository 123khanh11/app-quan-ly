import requests

SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
SUPABASE_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json',
}

# Check provinces
print("=== PROVINCES ===")
url = f'{SUPABASE_URL}/rest/v1/ghn_provinces?select=province_id,province_name'
resp = requests.get(url, headers=HEADERS)
rows = resp.json()
print(f'Total: {len(rows)}')
for row in rows:
    print(f'  - {row["province_id"]}: {row["province_name"]}')

# Check districts
print("\n=== DISTRICTS ===")
url = f'{SUPABASE_URL}/rest/v1/ghn_districts?select=district_id,district_name'
resp = requests.get(url, headers=HEADERS)
rows = resp.json()
print(f'Total: {len(rows)}')
for row in rows:
    print(f'  - {row["district_id"]}: {row["district_name"]}')

# Check wards
print("\n=== WARDS ===")
url = f'{SUPABASE_URL}/rest/v1/ghn_wards?select=ward_code,ward_name'
resp = requests.get(url, headers=HEADERS)
rows = resp.json()
print(f'Total: {len(rows)}')
for row in rows[:5]:
    print(f'  - {row["ward_code"]}: {row["ward_name"]}')
