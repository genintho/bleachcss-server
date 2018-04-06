CREATE TABLE selector_file_mappings
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    css_file_id INT,
    css_selector_id INT,
    application_id INT
);
CREATE INDEX selector_file_mappings_css_file_id_index ON selector_file_mappings (css_file_id);
CREATE INDEX selector_file_mappings_css_selector_id_index ON selector_file_mappings (css_selector_id);
CREATE INDEX selector_file_mappings_application_id_index ON selector_file_mappings (application_id);