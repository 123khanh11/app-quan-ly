-- FIX RLS POLICIES - Allow INSERT & SELECT

-- Drop old policies
DROP POLICY IF EXISTS "Allow read provinces" ON ghn_provinces;
DROP POLICY IF EXISTS "Allow read districts" ON ghn_districts;
DROP POLICY IF EXISTS "Allow read wards" ON ghn_wards;

-- Create new policies - Allow SELECT & INSERT for everyone
CREATE POLICY "Allow all on provinces" ON ghn_provinces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on districts" ON ghn_districts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on wards" ON ghn_wards FOR ALL USING (true) WITH CHECK (true);
