DELIMITER $$

CREATE TRIGGER nifca.before_insert_users
BEFORE INSERT ON nifca.users
FOR EACH ROW
BEGIN
    DECLARE role_name VARCHAR(50);

    -- Get the role name for the given role_id
    SELECT name INTO role_name FROM nifca.roles WHERE id = NEW.role_id;

    -- If the role is NOT 'client', default company_id to 1 (Nifca)
    IF role_name <> 'client' THEN
        SET NEW.company_id = 1;
    END IF;
END $$

DELIMITER ;
