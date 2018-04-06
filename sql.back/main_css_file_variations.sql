CREATE TABLE css_file_variations
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INT NOT NULL,
    css_file_id INT NOT NULL,
    url STRING NOT NULL,
    fetched_at DATETIME,
    fetch_status STRING,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);