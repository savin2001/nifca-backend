-- Pipeline Approval Schema
-- Run this against the MySQL database to set up the multi-stage approval pipeline

-- 1a. Pipeline stage definitions (the 4 fixed stages)
CREATE TABLE IF NOT EXISTS pipeline_stage_definitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stage_order INT NOT NULL,
  description TEXT,
  requires_unanimous BOOLEAN DEFAULT FALSE,
  min_reviewers INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pipeline_stage_definitions (name, stage_order, description, requires_unanimous, min_reviewers) VALUES
('Document Approval', 1, 'Verify all submitted documents are complete and valid', FALSE, 1),
('Strategic Fit Test', 2, 'Assess alignment with NIFC strategic objectives', FALSE, 1),
('Due Diligence', 3, 'Conduct background and compliance checks', FALSE, 1),
('Board Approval', 4, 'Final board decision - requires unanimous approval', TRUE, 3);

-- 1b. Pipeline stages per application
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  stage_definition_id INT NOT NULL,
  status ENUM('pending','active','approved','rejected','returned') DEFAULT 'pending',
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (stage_definition_id) REFERENCES pipeline_stage_definitions(id),
  UNIQUE KEY unique_app_stage (application_id, stage_definition_id)
);

-- 1c. Individual reviewers within each stage
CREATE TABLE IF NOT EXISTS pipeline_stage_reviewers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pipeline_stage_id INT NOT NULL,
  user_id INT NOT NULL,
  review_order INT NOT NULL,
  status ENUM('pending','active','approved','rejected','returned') DEFAULT 'pending',
  comments TEXT,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pipeline_stage_id) REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_stage_reviewer (pipeline_stage_id, user_id),
  UNIQUE KEY unique_stage_order (pipeline_stage_id, review_order)
);

-- 1d. Pipeline audit log
CREATE TABLE IF NOT EXISTS pipeline_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  pipeline_stage_id INT NULL,
  action VARCHAR(100) NOT NULL,
  performed_by INT NOT NULL,
  old_data JSON,
  new_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- 1e. Alter applications table to support pipeline
ALTER TABLE applications
  MODIFY COLUMN status ENUM('draft','pending','submitted','under_review','in_pipeline','approved','rejected','cancelled') DEFAULT 'draft',
  ADD COLUMN pipeline_current_stage_id INT NULL AFTER status,
  ADD COLUMN pipeline_started_at TIMESTAMP NULL,
  ADD COLUMN pipeline_completed_at TIMESTAMP NULL;

ALTER TABLE applications
  ADD FOREIGN KEY (pipeline_current_stage_id) REFERENCES pipeline_stages(id) ON DELETE SET NULL;
