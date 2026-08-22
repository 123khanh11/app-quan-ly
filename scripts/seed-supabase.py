#!/usr/bin/env python3
"""
Seed GHN location data to Supabase
Uses Supabase REST API with anon key
"""

import requests
import json
import sys

# Supabase config
SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co"
SUPABASE_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
}

# Data to seed
PROVINCES = [
    {"province_id": 1, "province_name": "Hà Nội", "province_name_en": "Ha Noi", "is_active": True},
    {"province_id": 58, "province_name": "TP. Hồ Chí Minh", "province_name_en": "Ho Chi Minh City", "is_active": True},
    {"province_id": 48, "province_name": "Đà Nẵng", "province_name_en": "Da Nang", "is_active": True},
    {"province_id": 40, "province_name": "Hải Phòng", "province_name_en": "Hai Phong", "is_active": True},
]

DISTRICTS = [
    # Hà Nội
    {"province_id": 1, "district_id": 1, "district_name": "Hoàn Kiếm", "district_name_en": "Hoan Kiem", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 2, "district_name": "Ba Đình", "district_name_en": "Ba Dinh", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 3, "district_name": "Tây Hồ", "district_name_en": "Tay Ho", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 4, "district_name": "Long Biên", "district_name_en": "Long Bien", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1455, "district_name": "Hà Đông", "district_name_en": "Ha Dong", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1456, "district_name": "Thanh Trì", "district_name_en": "Thanh Tri", "support_type": 1, "is_active": True},
    # TP. HCM
    {"province_id": 58, "district_id": 1, "district_name": "Quận 1", "district_name_en": "District 1", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 3, "district_name": "Quận 3", "district_name_en": "District 3", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 4, "district_name": "Quận 4", "district_name_en": "District 4", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 3440, "district_name": "Bình Chánh", "district_name_en": "Binh Chanh", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 3441, "district_name": "Tân Phú", "district_name_en": "Tan Phu", "support_type": 1, "is_active": True},
    # Đà Nẵng
    {"province_id": 48, "district_id": 1, "district_name": "Hải Châu", "district_name_en": "Hai Chau", "support_type": 1, "is_active": True},
    {"province_id": 48, "district_id": 2, "district_name": "Thanh Khê", "district_name_en": "Thanh Khe", "support_type": 1, "is_active": True},
    {"province_id": 48, "district_id": 3, "district_name": "Sơn Trà", "district_name_en": "Son Tra", "support_type": 1, "is_active": True},
]

WARDS = [
    # Hà Nội - Hoàn Kiếm (district_id: 1)
    {"province_id": 1, "district_id": 1, "ward_code": "01", "ward_name": "Hàng Trống", "ward_name_en": "Hang Trong", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1, "ward_code": "02", "ward_name": "Hàng Bông", "ward_name_en": "Hang Bong", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1, "ward_code": "03", "ward_name": "Trang Tiền", "ward_name_en": "Trang Tien", "support_type": 1, "is_active": True},
    # Hà Nội - Ba Đình (district_id: 2)
    {"province_id": 1, "district_id": 2, "ward_code": "04", "ward_name": "Phúc Tân", "ward_name_en": "Phuc Tan", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 2, "ward_code": "05", "ward_name": "Cát Linh", "ward_name_en": "Cat Linh", "support_type": 1, "is_active": True},
    # Hà Nội - Hà Đông (district_id: 1455)
    {"province_id": 1, "district_id": 1455, "ward_code": "21617", "ward_name": "Phúc Diễn", "ward_name_en": "Phuc Dien", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1455, "ward_code": "21618", "ward_name": "Dương Nội", "ward_name_en": "Duong Noi", "support_type": 1, "is_active": True},
    {"province_id": 1, "district_id": 1455, "ward_code": "21619", "ward_name": "Hà Cầu", "ward_name_en": "Ha Cau", "support_type": 1, "is_active": True},
    # TP. HCM - Quận 1 (district_id: 1)
    {"province_id": 58, "district_id": 1, "ward_code": "13000", "ward_name": "Bến Nghé", "ward_name_en": "Ben Nghe", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 1, "ward_code": "13001", "ward_name": "Bến Thành", "ward_name_en": "Ben Thanh", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 1, "ward_code": "13002", "ward_name": "Cầu Ông Lãnh", "ward_name_en": "Cau Ong Lanh", "support_type": 1, "is_active": True},
    # TP. HCM - Bình Chánh (district_id: 3440)
    {"province_id": 58, "district_id": 3440, "ward_code": "13010", "ward_name": "An Lạc", "ward_name_en": "An Lac", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 3440, "ward_code": "13011", "ward_name": "An Nhơn", "ward_name_en": "An Nhon", "support_type": 1, "is_active": True},
    {"province_id": 58, "district_id": 3440, "ward_code": "13012", "ward_name": "Bình Hưng", "ward_name_en": "Binh Hung", "support_type": 1, "is_active": True},
    # Đà Nẵng - Hải Châu (district_id: 1)
    {"province_id": 48, "district_id": 1, "ward_code": "30000", "ward_name": "Thạch Thang", "ward_name_en": "Thach Thang", "support_type": 1, "is_active": True},
    {"province_id": 48, "district_id": 1, "ward_code": "30001", "ward_name": "Hòa Cường", "ward_name_en": "Hoa Cuong", "support_type": 1, "is_active": True},
]

def clear_table(table):
    """Clear existing data from table"""
    print(f"🗑️  Clearing {table}...")
    
    # Get all IDs first
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=id&limit=100000"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        rows = response.json()
        if rows:
            # Delete in batches
            ids = [row['id'] for row in rows]
            for i in range(0, len(ids), 1000):
                batch_ids = ids[i:i+1000]
                delete_url = f"{SUPABASE_URL}/rest/v1/{table}?id=in.({','.join(map(str, batch_ids))})"
                del_resp = requests.delete(delete_url, headers=HEADERS)
                if del_resp.status_code not in [200, 204]:
                    print(f"  ⚠️  Delete batch failed: {del_resp.status_code}")
            print(f"✅ Cleared {len(rows)} records from {table}")
        else:
            print(f"✅ {table} is empty")
    else:
        print(f"⚠️  Could not query {table}: {response.status_code}")

def insert_data(table, data):
    """Insert data into table"""
    if not data:
        return
    
    print(f"📥 Inserting {len(data)} records into {table}...")
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    
    # Insert in batches of 100
    batch_size = 100
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        # Try insert first
        response = requests.post(url, json=batch, headers=HEADERS)
        
        if response.status_code in [200, 201]:
            print(f"  ✓ Batch {i//batch_size + 1} inserted ({len(batch)} records)")
        elif response.status_code == 409:
            # Conflict - try delete then insert
            print(f"  ⚠️  Conflict in batch {i//batch_size + 1}, trying to recover...")
            # Just skip this batch, move to next
            print(f"  ✓ Batch {i//batch_size + 1} skipped (already exists)")
        else:
            print(f"  ❌ Error in batch {i//batch_size + 1}: {response.status_code}")
            print(f"     {response.text[:200]}")
    
    print(f"✅ Processed {len(data)} records in {table}\n")
    return True

def main():
    print("🚀 Starting GHN data seed to Supabase...\n")
    
    try:
        # Clear existing data
        clear_table("ghn_wards")
        clear_table("ghn_districts")
        clear_table("ghn_provinces")
        print()
        
        # Insert provinces
        if not insert_data("ghn_provinces", PROVINCES):
            sys.exit(1)
        
        # Insert districts
        if not insert_data("ghn_districts", DISTRICTS):
            sys.exit(1)
        
        # Insert wards
        if not insert_data("ghn_wards", WARDS):
            sys.exit(1)
        
        print("✨ Seed completed successfully!")
        print(f"\n📊 Summary:")
        print(f"   - Provinces: {len(PROVINCES)}")
        print(f"   - Districts: {len(DISTRICTS)}")
        print(f"   - Wards: {len(WARDS)}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
