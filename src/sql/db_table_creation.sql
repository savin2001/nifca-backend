CREATE DATABASE nifca;

CREATE TABLE nifca.roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('admin', 'super_user', 'news', 'press_release', 'media', 'events', 'client') UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nifca.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,  -- Activated after successful login
    status ENUM('active', 'inactive') DEFAULT 'inactive', -- Account status
    failed_attempts INT DEFAULT 0, -- Track failed login attempts
    last_login TIMESTAMP NULL DEFAULT NULL, -- Store last login time
    verification_token VARCHAR(255) DEFAULT NULL, -- Token for email verification
    verified_at TIMESTAMP NULL DEFAULT NULL, -- Timestamp when email is verified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE nifca.companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    email_domain VARCHAR(100) UNIQUE, -- Optional: Use domain to auto-assign company
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE nifca.users ADD COLUMN company_id INT NULL;
ALTER TABLE nifca.users ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE nifca.roles MODIFY COLUMN name VARCHAR(50);


INSERT INTO nifca.roles (id, name) VALUES 
(1, 'admin'),
(2, 'super user'),
(3, 'news'),
(4, 'press release'),
(5, 'media'),
(6, 'events'),
(7, 'client');

INSERT INTO nifca.companies (id, name) VALUES (1, 'Nifca') ON DUPLICATE KEY UPDATE name = 'Nifca';
delete from nifca.users where email='allenpane399@gmail.com';

desc nifca.users;
select * from nifca.users;

SELECT * FROM nifca.roles;

SELECT * FROM nifca.companies;

select
