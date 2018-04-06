CREATE TABLE css_selectors
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    selector STRING NOT NULL,
    md5 BLOB NOT NULL,
    application_id INT,
    seen_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX css_selectors_application_id_md5_uindex ON css_selectors (application_id, md5);