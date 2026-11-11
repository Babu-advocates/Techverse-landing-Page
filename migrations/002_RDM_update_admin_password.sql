-- Migration: 002_RDM_update_admin_password.sql
-- Description: Update super admin password to [REDACTED]
-- Author: RDM

UPDATE admin_users
SET password_hash = '$2b$10$j2o0Wt8qQ/wDM9IzzgrHneAsk2b0v9RbfdKjoucZy2ViBG73pD9fi',
    updated_at = NOW()
WHERE email = 'admin@techverseinfotech.com';
