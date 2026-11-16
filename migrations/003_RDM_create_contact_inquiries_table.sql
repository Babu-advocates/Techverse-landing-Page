-- Migration: migrations/003_RDM_create_contact_inquiries_table.sql
-- Description: Create contact_inquiries table to persist client inquiries and track delivery status
-- Author: RDM

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  service VARCHAR(255),
  currency VARCHAR(10) DEFAULT 'INR',
  budget VARCHAR(100),
  description TEXT NOT NULL,
  ip_address VARCHAR(100),
  delivery_status VARCHAR(50) DEFAULT 'PENDING',
  delivery_provider VARCHAR(50) DEFAULT 'FORMSUBMIT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
