INSERT INTO properties (user_id, address, city, state, zip_code, year_built, property_type, is_active)
SELECT 1, p.address, p.city, p.state, p.zip_code, p.year_built, p.property_type, p.is_active
FROM (VALUES
          ('1200 Demo Oak Lane', 'Austin', 'TX', '78745', 2018, 'Single Family Home', TRUE),
          ('245 Sample Harbor Drive', 'Savannah', 'GA', '31419', 2006, 'Single Family Home', TRUE),
          ('78 Example Willow Court', 'Raleigh', 'NC', '27609', 1995, 'Townhouse', TRUE),
          ('430 Test Bay Avenue', 'Tampa', 'FL', '33611', 2011, 'Condo', FALSE)
     ) AS p(address, city, state, zip_code, year_built, property_type, is_active)
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (
    SELECT 1 FROM properties x
    WHERE x.user_id = 1 AND x.address = p.address AND x.city = p.city AND x.state = p.state
);

INSERT INTO contractors (user_id, category_id, name, phone, email, is_active)
SELECT 1, c.id, t.name, t.phone, t.email, TRUE
FROM (VALUES
          ('ClearFlow HVAC Demo', 'HVAC', '555-010-1001', 'hvac@example.com'),
          ('Harbor Pipe Services Demo', 'Plumbing', '555-010-1002', 'plumbing@example.com'),
          ('BrightWire Electric Demo', 'Electrical', '555-010-1003', 'electric@example.com'),
          ('RoofLine Repair Demo', 'Roofing', '555-010-1004', 'roofing@example.com'),
          ('GreenYard Care Demo', 'Landscaping', '555-010-1005', 'landscape@example.com'),
          ('HomeFix Appliance Demo', 'Appliances', '555-010-1006', 'appliances@example.com')
     ) AS t(name, category_name, phone, email)
         JOIN maintenance_categories c ON c.name = t.category_name
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM contractors x WHERE x.user_id = 1 AND x.name = t.name);

INSERT INTO maintenance_records
(property_id, category_id, contractor_id, title, description, completion_date, performed_by, is_active)
SELECT p.id, c.id, CASE WHEN r.performed_by = 'DIY' THEN NULL ELSE k.id END, r.title, r.description, r.completion_date, r.performed_by, r.is_active
FROM (VALUES
          ('1200 Demo Oak Lane', 'HVAC', 'ClearFlow HVAC Demo', 'Replaced HVAC air filter', 'Installed a new pleated air filter and checked airflow.', DATE '2026-10-18', 'DIY', TRUE),
          ('1200 Demo Oak Lane', 'HVAC', 'ClearFlow HVAC Demo', 'Annual HVAC inspection', 'Checked refrigerant levels and cleaned outdoor condenser coils.', DATE '2026-07-11', 'Contractor', TRUE),
          ('1200 Demo Oak Lane', 'Plumbing', 'Harbor Pipe Services Demo', 'Repaired kitchen faucet leak', 'Replaced cartridge and verified there were no further leaks.', DATE '2026-03-21', 'Contractor', TRUE),
          ('1200 Demo Oak Lane', 'Landscaping', 'GreenYard Care Demo', 'Replaced lawn sprinkler head', 'Replaced broken sprinkler head near the sidewalk.', DATE '2026-09-05', 'DIY', TRUE),

          ('245 Sample Harbor Drive', 'Roofing', 'RoofLine Repair Demo', 'Roof flashing repair', 'Sealed flashing around the chimney after a minor leak.', DATE '2026-08-14', 'Contractor', TRUE),
          ('245 Sample Harbor Drive', 'HVAC', 'ClearFlow HVAC Demo', 'Replaced HVAC capacitor', 'Replaced failed condenser capacitor and tested cooling.', DATE '2026-06-04', 'Contractor', TRUE),
          ('245 Sample Harbor Drive', 'Plumbing', 'Harbor Pipe Services Demo', 'Water heater inspection', 'Flushed tank and checked temperature pressure relief valve.', DATE '2026-02-18', 'Contractor', TRUE),
          ('245 Sample Harbor Drive', 'General Maintenance', NULL, 'Replaced smoke detector batteries', 'Installed fresh batteries and tested all alarms.', DATE '2026-10-03', 'DIY', TRUE),

          ('78 Example Willow Court', 'Electrical', 'BrightWire Electric Demo', 'Replaced GFCI outlet', 'Installed new GFCI outlet in the bathroom.', DATE '2026-01-23', 'Contractor', TRUE),
          ('78 Example Willow Court', 'Appliances', 'HomeFix Appliance Demo', 'Dishwasher drain repair', 'Cleared drain blockage and tested full wash cycle.', DATE '2026-05-30', 'Contractor', TRUE),
          ('78 Example Willow Court', 'General Maintenance', NULL, 'Recaulked bathtub', 'Removed old caulk and applied mildew-resistant silicone.', DATE '2026-09-28', 'DIY', TRUE),
          ('78 Example Willow Court', 'HVAC', 'ClearFlow HVAC Demo', 'Replaced thermostat', 'Installed programmable thermostat and verified heat and cooling.', DATE '2026-04-16', 'Contractor', FALSE),

          ('430 Test Bay Avenue', 'Appliances', 'HomeFix Appliance Demo', 'Refrigerator door seal replacement', 'Replaced worn gasket to improve temperature retention.', DATE '2025-11-12', 'Contractor', TRUE),
          ('430 Test Bay Avenue', 'Electrical', 'BrightWire Electric Demo', 'Ceiling fan installation', 'Replaced old ceiling fan with energy-efficient model.', DATE '2026-04-07', 'Contractor', TRUE),
          ('430 Test Bay Avenue', 'Landscaping', NULL, 'Patio pressure washing', 'Cleaned patio and walkway after rainy season.', DATE '2026-09-14', 'DIY', TRUE)
     ) AS r(address, category_name, contractor_name, title, description, completion_date, performed_by, is_active)
         JOIN properties p ON p.user_id = 1 AND p.address = r.address
         JOIN maintenance_categories c ON c.name = r.category_name
         LEFT JOIN contractors k ON k.user_id = 1 AND k.name = r.contractor_name
WHERE (r.performed_by = 'DIY' OR k.id IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1 FROM maintenance_records x WHERE x.property_id = p.id AND x.title = r.title
);

INSERT INTO maintenance_expenses (maintenance_record_id, description, amount, expense_date)
SELECT m.id, 'Total job cost', r.amount, m.completion_date
FROM (VALUES
          ('1200 Demo Oak Lane', 'Replaced HVAC air filter', 34.99),
          ('1200 Demo Oak Lane', 'Annual HVAC inspection', 189.00),
          ('1200 Demo Oak Lane', 'Repaired kitchen faucet leak', 245.50),
          ('1200 Demo Oak Lane', 'Replaced lawn sprinkler head', 18.75),
          ('245 Sample Harbor Drive', 'Roof flashing repair', 780.00),
          ('245 Sample Harbor Drive', 'Replaced HVAC capacitor', 325.00),
          ('245 Sample Harbor Drive', 'Water heater inspection', 165.00),
          ('245 Sample Harbor Drive', 'Replaced smoke detector batteries', 22.00),
          ('78 Example Willow Court', 'Replaced GFCI outlet', 195.00),
          ('78 Example Willow Court', 'Dishwasher drain repair', 310.00),
          ('78 Example Willow Court', 'Recaulked bathtub', 28.50),
          ('78 Example Willow Court', 'Replaced thermostat', 220.00),
          ('430 Test Bay Avenue', 'Refrigerator door seal replacement', 285.00),
          ('430 Test Bay Avenue', 'Ceiling fan installation', 420.00),
          ('430 Test Bay Avenue', 'Patio pressure washing', 45.00)
     ) AS r(address, title, amount)
         JOIN properties p ON p.user_id = 1 AND p.address = r.address
         JOIN maintenance_records m ON m.property_id = p.id AND m.title = r.title
WHERE NOT EXISTS (
    SELECT 1 FROM maintenance_expenses e
    WHERE e.maintenance_record_id = m.id AND e.description = 'Total job cost'
);