-- Delete all demo data while preserving the schema

DELETE FROM app_settings CASCADE;
DELETE FROM notifications CASCADE;
DELETE FROM treatments CASCADE;
DELETE FROM health_logs CASCADE;
DELETE FROM batch_costs CASCADE;
DELETE FROM expenses CASCADE;
DELETE FROM sale_items CASCADE;
DELETE FROM sales CASCADE;
DELETE FROM customers CASCADE;
DELETE FROM plant_feed_harvest CASCADE;
DELETE FROM feeding_logs CASCADE;
DELETE FROM feed_inventory CASCADE;
DELETE FROM stage_records CASCADE;
DELETE FROM batch_movements CASCADE;
DELETE FROM batches CASCADE;
DELETE FROM tank_stocking CASCADE;
DELETE FROM tanks CASCADE;
DELETE FROM spawn_updates CASCADE;
DELETE FROM spawns CASCADE;
DELETE FROM broodstock CASCADE;
DELETE FROM users CASCADE;

-- Verify cleanup
SELECT 'Broodstock rows:' as check_result, COUNT(*) FROM broodstock;
SELECT 'Tank rows:' as check_result, COUNT(*) FROM tanks;
SELECT 'Spawn rows:' as check_result, COUNT(*) FROM spawns;
SELECT 'User rows:' as check_result, COUNT(*) FROM users;
SELECT 'Sales rows:' as check_result, COUNT(*) FROM sales;
SELECT 'Batch rows:' as check_result, COUNT(*) FROM batches;
