
INSERT INTO users (id, email, display_name, is_active, created_at)
SELECT 1, 'demo@homechart.example', 'Demo Homeowner', TRUE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);


SELECT setval(
               pg_get_serial_sequence('users', 'id'),
               GREATEST((SELECT MAX(id) FROM users), (SELECT last_value FROM users_id_seq))
       );