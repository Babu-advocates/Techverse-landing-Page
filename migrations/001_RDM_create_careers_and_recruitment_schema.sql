-- ============================================================================
-- Migration: 001_RDM_create_careers_and_recruitment_schema.sql
-- Description: Dynamic Careers & Recruitment Management System Schema
-- Author: RDM
-- Created: 2026-11-11
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'recruiter' CHECK (role IN ('super_admin', 'hr_admin', 'recruiter', 'viewer')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. JOB DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS job_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    department_id UUID REFERENCES job_departments(id) ON DELETE SET NULL,
    employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME' CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    work_mode VARCHAR(50) NOT NULL DEFAULT 'HYBRID' CHECK (work_mode IN ('ONSITE', 'REMOTE', 'HYBRID')),
    location VARCHAR(150) NOT NULL DEFAULT 'Coimbatore / Remote',
    min_experience INT NOT NULL DEFAULT 0,
    max_experience INT,
    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),
    salary_currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    vacancies INT NOT NULL DEFAULT 1,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    qualifications TEXT[] NOT NULL DEFAULT '{}',
    preferred_qualifications TEXT[] NOT NULL DEFAULT '{}',
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    opening_date DATE NOT NULL DEFAULT CURRENT_DATE,
    application_deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED')),
    published_at TIMESTAMPTZ,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_reference VARCHAR(50) UNIQUE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    location VARCHAR(150) NOT NULL,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    experience_years INT NOT NULL DEFAULT 0,
    employment_status VARCHAR(100),
    current_company VARCHAR(255),
    current_designation VARCHAR(255),
    expected_salary VARCHAR(100),
    notice_period VARCHAR(100),
    highest_qualification VARCHAR(150),
    skills TEXT,
    cover_letter TEXT,
    why_join TEXT,
    hear_about_us VARCHAR(255),
    resume_file_path VARCHAR(500) NOT NULL,
    resume_original_name VARCHAR(255) NOT NULL,
    resume_mime_type VARCHAR(100) NOT NULL,
    resume_file_size INT NOT NULL,
    application_status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (application_status IN (
        'NEW', 'UNDER_REVIEW', 'SHORTLISTED', 'ASSESSMENT_PENDING',
        'ASSESSMENT_COMPLETED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
        'SELECTED', 'REJECTED', 'OFFER_RELEASED', 'OFFER_ACCEPTED',
        'OFFER_DECLINED', 'WITHDRAWN'
    )),
    source VARCHAR(100) DEFAULT 'WEBSITE',
    privacy_consent BOOLEAN NOT NULL DEFAULT true,
    assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. APPLICATION STATUS HISTORY TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    changed_by_name VARCHAR(255),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. APPLICATION NOTES TABLE (Internal Recruiter Notes)
CREATE TABLE IF NOT EXISTS application_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_name VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    interview_round VARCHAR(150) NOT NULL,
    interview_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    interview_mode VARCHAR(50) NOT NULL DEFAULT 'ONLINE' CHECK (interview_mode IN ('ONLINE', 'OFFLINE')),
    meeting_link VARCHAR(500),
    venue VARCHAR(255),
    interviewer VARCHAR(255) NOT NULL,
    feedback TEXT,
    result VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (result IN ('PENDING', 'PASSED', 'FAILED', 'RESCHEDULED')),
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RECRUITMENT NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS recruitment_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    recipient VARCHAR(255) NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'SENT' CHECK (delivery_status IN ('SENT', 'FAILED', 'SIMULATED')),
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE & SEARCH
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status_deadline ON jobs(status, application_deadline) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department_id);
CREATE INDEX IF NOT EXISTS idx_applications_ref ON job_applications(application_reference);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_assigned ON job_applications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_interviews_app ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_history_app ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_notes_app ON application_notes(application_id);

-- SEED INITIAL DEPARTMENTS (Idempotent)
INSERT INTO job_departments (id, name, slug, description, status)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Software Engineering', 'software-engineering', 'Custom software, systems architecture, and core platforms.', 'ACTIVE'),
    ('00000000-0000-0000-0000-000000000002', 'AI & Data Annotation', 'ai-data-annotation', 'Computer vision, NLP annotation pipelines, and dataset QA.', 'ACTIVE'),
    ('00000000-0000-0000-0000-000000000003', 'ERP & Enterprise Solutions', 'erp-enterprise-solutions', 'Business automation, ERP workflows, and modules.', 'ACTIVE'),
    ('00000000-0000-0000-0000-000000000004', 'Cloud & DevOps', 'cloud-devops', 'High-availability infrastructure, CI/CD, and database clusters.', 'ACTIVE'),
    ('00000000-0000-0000-0000-000000000005', 'Product & Design', 'product-design', 'UX architecture, product strategy, and visual engineering.', 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;

-- SEED INITIAL SUPER ADMIN USER (Password: [REDACTED])
INSERT INTO admin_users (id, email, password_hash, full_name, role, status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@techverseinfotech.com',
    '$2a$10$i6x.F2h2m4h8g45wO9U1feCqE51Qf8N/Xw7m02X6J14Y9u5b3C43O', -- [REDACTED]
    'Techverse Lead Recruiter',
    'super_admin',
    'ACTIVE'
)
ON CONFLICT (email) DO NOTHING;

-- SEED INITIAL SAMPLE PUBLISHED JOBS (Idempotent)
INSERT INTO jobs (
    id, title, slug, department_id, employment_type, work_mode, location,
    min_experience, max_experience, salary_min, salary_max, salary_currency,
    vacancies, short_description, description,
    responsibilities, qualifications, preferred_qualifications, required_skills, benefits,
    opening_date, application_deadline, status, published_at, seo_title, seo_description
)
VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'Senior Full-Stack Engineer',
    'senior-full-stack-engineer',
    '00000000-0000-0000-0000-000000000001',
    'FULL_TIME',
    'HYBRID',
    'Coimbatore / Remote',
    3, 7, 700000, 1400000, 'INR',
    2,
    'Lead frontend architecture and high-performance backend microservices for enterprise client products.',
    'We are looking for a Senior Full-Stack Engineer to architect, build, and deploy production-grade applications across modern TypeScript, Next.js, and cloud ecosystems. You will collaborate closely with engineering leads and product stakeholders.',
    ARRAY[
        'Architect scalable frontend and backend architectures with Next.js, Node.js, and PostgreSQL',
        'Implement clean UI systems with smooth motion physics and high-precision responsiveness',
        'Design secure RESTful and GraphQL APIs with robust error handling and rate-limiting',
        'Mentor junior developers, conduct code reviews, and drive engineering quality standards'
    ],
    ARRAY[
        '3+ years of professional full-stack development experience',
        'Strong proficiency in TypeScript, React, Next.js, and relational databases',
        'Proven track record building and deploying production web applications',
        'Solid foundation in API design, authentication, and state management'
    ],
    ARRAY[
        'Experience with Docker, Kubernetes, or serverless cloud environments',
        'Hands-on experience with GSAP, Lenis, or advanced animation libraries',
        'Familiarity with enterprise ERP integrations'
    ],
    ARRAY['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'Tailwind CSS', 'Node.js', 'Git', 'REST APIs'],
    ARRAY[
        'Competitive industry salary with annual reviews',
        'Flexible hybrid working arrangements',
        'Health & accident insurance coverage',
        'Learning stipend for certifications and engineering conferences',
        'MacBook Pro & dedicated workstation setup'
    ],
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    'PUBLISHED',
    NOW(),
    'Senior Full-Stack Engineer Jobs in Coimbatore | Techverse Infotech',
    'Join Techverse Infotech as a Senior Full-Stack Engineer. Build modern web platforms with TypeScript, Next.js, and PostgreSQL. Apply today.'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'AI Data Operations & Annotation Lead',
    'ai-data-operations-lead',
    '00000000-0000-0000-0000-000000000002',
    'FULL_TIME',
    'ONSITE',
    'Coimbatore',
    2, 5, 450000, 850000, 'INR',
    1,
    'Lead computer vision and NLP dataset annotation pipelines, workforce QA protocols, and client deliverables.',
    'Techverse is expanding its AI Data Services practice. We need an Operations Lead to oversee high-throughput dataset annotation, label verification, and deliverable compliance for global AI and machine learning clients.',
    ARRAY[
        'Manage high-volume data annotation pipelines for computer vision and NLP models',
        'Establish automated and manual QA verification protocols to maintain 99%+ accuracy',
        'Coordinate with machine learning teams to structure labeling guidelines and ontologies',
        'Train, audit, and supervise in-house annotation specialists'
    ],
    ARRAY[
        '2+ years experience in AI data annotation, data operations, or BPO project management',
        'Deep understanding of polygon, bounding box, semantic segmentation, and LiDAR tagging',
        'Exceptional project management, tracking, and communication skills'
    ],
    ARRAY[
        'Familiarity with CVAT, Label Studio, or proprietary annotation tools',
        'Basic Python scripting for dataset conversion and validation'
    ],
    ARRAY['Data Annotation', 'Computer Vision QA', 'CVAT', 'Label Studio', 'Project Management', 'Quality Control'],
    ARRAY[
        'Performance-based quarterly bonuses',
        'Comprehensive health insurance',
        'Structured leadership advancement track',
        'Modern collaborative office environment in Coimbatore'
    ],
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '45 days',
    'PUBLISHED',
    NOW(),
    'AI Data Operations Lead Jobs | Techverse Infotech Careers',
    'Lead AI data annotation and quality assurance operations at Techverse Infotech. Explore open role and apply online.'
),
(
    'b0000000-0000-0000-0000-000000000003',
    'ERP & Business Systems Consultant',
    'erp-business-systems-consultant',
    '00000000-0000-0000-0000-000000000003',
    'FULL_TIME',
    'HYBRID',
    'Coimbatore / Bangalore',
    3, 6, 600000, 1200000, 'INR',
    1,
    'Design, implement, and configure custom ERP workflows for finance, inventory, and operations.',
    'Join our Enterprise Solutions group to deliver bespoke ERP platforms for enterprise clients across manufacturing, retail, and education sectors.',
    ARRAY[
        'Translate client business requirements into detailed ERP technical specifications',
        'Configure inventory, accounting, HR, and supply chain modules',
        'Lead user acceptance testing (UAT), data migration, and training workshops',
        'Provide post-deployment optimization and technical guidance'
    ],
    ARRAY[
        '3+ years experience implementing custom or open-source ERP systems',
        'Strong knowledge of business processes in accounting, procurement, and inventory',
        'Proficiency in SQL and relational database modeling'
    ],
    ARRAY[
        'Experience with ERPNext, Odoo, or custom modular ERP architectures',
        'Background in manufacturing or distribution domain workflows'
    ],
    ARRAY['ERP Implementation', 'Business Analysis', 'PostgreSQL', 'Workflow Automation', 'UAT'],
    ARRAY[
        'Competitive compensation and project milestone bonuses',
        'Flexible hybrid working model',
        'Health and wellness benefits',
        'Direct client impact and leadership visibility'
    ],
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    'PUBLISHED',
    NOW(),
    'ERP Systems Consultant Jobs | Techverse Infotech',
    'Design and deploy custom ERP solutions at Techverse Infotech. Apply for the ERP Consultant role today.'
)
ON CONFLICT (slug) DO NOTHING;
