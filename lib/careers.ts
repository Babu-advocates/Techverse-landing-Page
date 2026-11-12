import { query } from './db';
import { sendRecruitmentEmail, getApplicantConfirmationHtml, getAdminApplicationAlertHtml } from './email';

export type JobDepartment = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
};

export type Job = {
  id: string;
  title: string;
  slug: string;
  department_id: string;
  department_name?: string;
  department_slug?: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  work_mode: 'ONSITE' | 'REMOTE' | 'HYBRID';
  location: string;
  min_experience: number;
  max_experience?: number;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  vacancies: number;
  short_description: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferred_qualifications: string[];
  required_skills: string[];
  benefits: string[];
  opening_date: string;
  application_deadline?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  application_count?: number;
};

export type JobApplication = {
  id: string;
  application_reference: string;
  job_id?: string;
  job_title?: string;
  full_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  location: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  experience_years: number;
  employment_status?: string;
  current_company?: string;
  current_designation?: string;
  expected_salary?: string;
  notice_period?: string;
  highest_qualification?: string;
  skills?: string;
  cover_letter?: string;
  why_join?: string;
  hear_about_us?: string;
  resume_file_path: string;
  resume_original_name: string;
  resume_mime_type: string;
  resume_file_size: number;
  application_status: string;
  source: string;
  privacy_consent: boolean;
  assigned_to?: string;
  assigned_name?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatusHistory = {
  id: string;
  application_id: string;
  previous_status?: string;
  new_status: string;
  changed_by?: string;
  changed_by_name?: string;
  comments?: string;
  created_at: string;
};

export type ApplicationNote = {
  id: string;
  application_id: string;
  admin_id?: string;
  admin_name: string;
  note: string;
  created_at: string;
};

export type Interview = {
  id: string;
  application_id: string;
  candidate_name?: string;
  job_title?: string;
  interview_round: string;
  interview_date: string;
  start_time: string;
  end_time: string;
  interview_mode: 'ONLINE' | 'OFFLINE';
  meeting_link?: string;
  venue?: string;
  interviewer: string;
  feedback?: string;
  result: 'PENDING' | 'PASSED' | 'FAILED' | 'RESCHEDULED';
  created_by?: string;
  created_at: string;
};

// ----------------------------------------------------------------------------
// PUBLIC CAREERS FUNCTIONS
// ----------------------------------------------------------------------------

export async function getAllDepartments(): Promise<JobDepartment[]> {
  return query<JobDepartment>(
    `SELECT id, name, slug, description, status FROM job_departments WHERE status = 'ACTIVE' ORDER BY name ASC`
  );
}

export type JobFilterParams = {
  department?: string;
  employment_type?: string;
  work_mode?: string;
  min_experience?: number;
  search?: string;
};

export async function getPublishedJobs(filters: JobFilterParams = {}): Promise<Job[]> {
  const conditions: string[] = [
    `j.status = 'PUBLISHED'`,
    `j.deleted_at IS NULL`,
    `(j.application_deadline IS NULL OR j.application_deadline >= CURRENT_DATE)`,
  ];
  const params: any[] = [];
  let paramIdx = 1;

  if (filters.department) {
    conditions.push(`d.slug = $${paramIdx}`);
    params.push(filters.department);
    paramIdx++;
  }

  if (filters.employment_type) {
    conditions.push(`j.employment_type = $${paramIdx}`);
    params.push(filters.employment_type);
    paramIdx++;
  }

  if (filters.work_mode) {
    conditions.push(`j.work_mode = $${paramIdx}`);
    params.push(filters.work_mode);
    paramIdx++;
  }

  if (filters.min_experience !== undefined) {
    conditions.push(`j.min_experience <= $${paramIdx}`);
    params.push(filters.min_experience);
    paramIdx++;
  }

  if (filters.search && filters.search.trim()) {
    conditions.push(`(
      j.title ILIKE $${paramIdx} OR
      j.short_description ILIKE $${paramIdx} OR
      j.description ILIKE $${paramIdx} OR
      d.name ILIKE $${paramIdx} OR
      array_to_string(j.required_skills, ' ') ILIKE $${paramIdx}
    )`);
    params.push(`%${filters.search.trim()}%`);
    paramIdx++;
  }

  const sql = `
    SELECT 
      j.*,
      d.name as department_name,
      d.slug as department_slug
    FROM jobs j
    LEFT JOIN job_departments d ON j.department_id = d.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY j.published_at DESC NULLS LAST, j.created_at DESC
  `;

  return query<Job>(sql, params);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const rows = await query<Job>(
    `SELECT 
      j.*,
      d.name as department_name,
      d.slug as department_slug
    FROM jobs j
    LEFT JOIN job_departments d ON j.department_id = d.id
    WHERE j.slug = $1 AND j.status = 'PUBLISHED' AND j.deleted_at IS NULL
    LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

// ----------------------------------------------------------------------------
// CANDIDATE APPLICATION SUBMISSION
// ----------------------------------------------------------------------------

function generateReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TV-${year}-${rand}`;
}

export type ApplicationInput = {
  job_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  location: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  experience_years: number;
  employment_status?: string;
  current_company?: string;
  current_designation?: string;
  expected_salary?: string;
  notice_period?: string;
  highest_qualification?: string;
  skills?: string;
  cover_letter?: string;
  why_join?: string;
  hear_about_us?: string;
  resume_file_path: string;
  resume_original_name: string;
  resume_mime_type: string;
  resume_file_size: number;
  privacy_consent: boolean;
};

export async function submitApplication(data: ApplicationInput): Promise<{
  application: JobApplication;
  referenceNumber: string;
}> {
  // Check duplicate submission in last 30 days for same job & email
  if (data.job_id) {
    const existing = await query(
      `SELECT id FROM job_applications 
       WHERE email = $1 AND job_id = $2 AND created_at > NOW() - INTERVAL '30 days'
       LIMIT 1`,
      [data.email.toLowerCase().trim(), data.job_id]
    );
    if (existing.length > 0) {
      throw new Error('You have already applied for this role within the last 30 days.');
    }
  }

  // Generate unique reference
  let reference = generateReference();
  let unique = false;
  let attempts = 0;
  while (!unique && attempts < 5) {
    const check = await query('SELECT id FROM job_applications WHERE application_reference = $1', [reference]);
    if (check.length === 0) unique = true;
    else {
      reference = generateReference();
      attempts++;
    }
  }

  const rows = await query<JobApplication>(
    `INSERT INTO job_applications (
      application_reference, job_id, full_name, email, phone, alternate_phone,
      location, linkedin_url, github_url, portfolio_url, experience_years,
      employment_status, current_company, current_designation, expected_salary,
      notice_period, highest_qualification, skills, cover_letter, why_join,
      hear_about_us, resume_file_path, resume_original_name, resume_mime_type,
      resume_file_size, application_status, source, privacy_consent, submitted_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18, $19, $20,
      $21, $22, $23, $24,
      $25, 'NEW', 'WEBSITE', $26, NOW()
    )
    RETURNING *`,
    [
      reference,
      data.job_id || null,
      data.full_name.trim(),
      data.email.toLowerCase().trim(),
      data.phone.trim(),
      data.alternate_phone?.trim() || null,
      data.location.trim(),
      data.linkedin_url?.trim() || null,
      data.github_url?.trim() || null,
      data.portfolio_url?.trim() || null,
      Number(data.experience_years) || 0,
      data.employment_status?.trim() || null,
      data.current_company?.trim() || null,
      data.current_designation?.trim() || null,
      data.expected_salary?.trim() || null,
      data.notice_period?.trim() || null,
      data.highest_qualification?.trim() || null,
      data.skills?.trim() || null,
      data.cover_letter?.trim() || null,
      data.why_join?.trim() || null,
      data.hear_about_us?.trim() || null,
      data.resume_file_path,
      data.resume_original_name,
      data.resume_mime_type,
      data.resume_file_size,
      data.privacy_consent,
    ]
  );

  const application = rows[0];

  // Log initial status in audit history
  await query(
    `INSERT INTO application_status_history (application_id, new_status, comments)
     VALUES ($1, 'NEW', 'Initial application received via website careers portal')`,
    [application.id]
  );

  // Fetch role title if applied to specific job
  let jobTitle = 'General Application';
  if (data.job_id) {
    const jobRow = await query('SELECT title FROM jobs WHERE id = $1', [data.job_id]);
    if (jobRow.length > 0) jobTitle = jobRow[0].title;
  }

  // Dispatch candidate confirmation email (fail-safe)
  const candidateHtml = getApplicantConfirmationHtml({
    fullName: application.full_name,
    jobTitle,
    referenceNumber: reference,
  });
  sendRecruitmentEmail({
    applicationId: application.id,
    to: application.email,
    subject: `Application Received: ${jobTitle} — ${reference}`,
    html: candidateHtml,
    type: 'APPLICANT_CONFIRMATION',
  }).catch((err) => console.error('[email-trigger-err]', err));

  // Dispatch admin notification email (fail-safe)
  const adminAlertHtml = getAdminApplicationAlertHtml({
    fullName: application.full_name,
    email: application.email,
    phone: application.phone,
    jobTitle,
    experienceYears: application.experience_years,
    referenceNumber: reference,
    adminUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/careers/applications/${application.id}`,
  });
  sendRecruitmentEmail({
    applicationId: application.id,
    to: process.env.CAREERS_TO || 'careers@techverseinfotech.com',
    subject: `[New Candidate] ${application.full_name} applied for ${jobTitle} (${reference})`,
    html: adminAlertHtml,
    type: 'ADMIN_ALERT',
  }).catch((err) => console.error('[email-admin-alert-err]', err));

  return { application, referenceNumber: reference };
}

// ----------------------------------------------------------------------------
// ADMIN DASHBOARD FUNCTIONS
// ----------------------------------------------------------------------------

export async function getRecruitmentMetrics() {
  const [jobStats, appStats, monthStats, interviewStats] = await Promise.all([
    query(`
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(*) FILTER (WHERE status = 'PUBLISHED') as published_jobs,
        COUNT(*) FILTER (WHERE status = 'PUBLISHED' AND (application_deadline IS NULL OR application_deadline >= CURRENT_DATE)) as active_jobs,
        COUNT(*) FILTER (WHERE status = 'DRAFT') as draft_jobs,
        COUNT(*) FILTER (WHERE status = 'CLOSED' OR (application_deadline < CURRENT_DATE)) as closed_jobs
      FROM jobs
      WHERE deleted_at IS NULL
    `),
    query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE application_status = 'NEW') as new_applications,
        COUNT(*) FILTER (WHERE application_status = 'SHORTLISTED') as shortlisted,
        COUNT(*) FILTER (WHERE application_status IN ('INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED')) as interviewing,
        COUNT(*) FILTER (WHERE application_status IN ('SELECTED', 'OFFER_RELEASED', 'OFFER_ACCEPTED')) as selected
      FROM job_applications
    `),
    query(`
      SELECT COUNT(*) as this_month
      FROM job_applications
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `),
    query(`
      SELECT COUNT(*) as scheduled_interviews
      FROM interviews
      WHERE interview_date >= CURRENT_DATE
        AND result IN ('PENDING', 'RESCHEDULED')
    `),
  ]);

  return {
    totalJobs: Number(jobStats[0]?.total_jobs || 0),
    publishedJobs: Number(jobStats[0]?.published_jobs || 0),
    activeJobs: Number(jobStats[0]?.active_jobs || 0),
    draftJobs: Number(jobStats[0]?.draft_jobs || 0),
    closedJobs: Number(jobStats[0]?.closed_jobs || 0),
    totalApplications: Number(appStats[0]?.total_applications || 0),
    newApplications: Number(appStats[0]?.new_applications || 0),
    shortlisted: Number(appStats[0]?.shortlisted || 0),
    interviewing: Number(appStats[0]?.interviewing || 0),
    selected: Number(appStats[0]?.selected || 0),
    thisMonthApplications: Number(monthStats[0]?.this_month || 0),
    applicationsThisMonth: Number(monthStats[0]?.this_month || 0),
    scheduledInterviews: Number(interviewStats[0]?.scheduled_interviews || 0),
  };
}

export type AdminJobFilterParams = {
  status?: string;
  department_id?: string;
  search?: string;
};

export async function getAdminJobs(filters: AdminJobFilterParams = {}): Promise<Job[]> {
  const conditions: string[] = ['j.deleted_at IS NULL'];
  const params: any[] = [];
  let paramIdx = 1;

  if (filters.status && filters.status !== 'ALL') {
    conditions.push(`j.status = $${paramIdx}`);
    params.push(filters.status);
    paramIdx++;
  }

  if (filters.department_id) {
    conditions.push(`j.department_id = $${paramIdx}`);
    params.push(filters.department_id);
    paramIdx++;
  }

  if (filters.search && filters.search.trim()) {
    conditions.push(`(j.title ILIKE $${paramIdx} OR j.slug ILIKE $${paramIdx})`);
    params.push(`%${filters.search.trim()}%`);
    paramIdx++;
  }

  const sql = `
    SELECT 
      j.*,
      d.name as department_name,
      d.slug as department_slug,
      COUNT(a.id)::int as application_count
    FROM jobs j
    LEFT JOIN job_departments d ON j.department_id = d.id
    LEFT JOIN job_applications a ON j.id = a.job_id
    WHERE ${conditions.join(' AND ')}
    GROUP BY j.id, d.name, d.slug
    ORDER BY j.created_at DESC
  `;

  return query<Job>(sql, params);
}

export async function getAdminJobById(id: string): Promise<Job | null> {
  const rows = await query<Job>(
    `SELECT 
      j.*,
      d.name as department_name,
      d.slug as department_slug,
      COUNT(a.id)::int as application_count
    FROM jobs j
    LEFT JOIN job_departments d ON j.department_id = d.id
    LEFT JOIN job_applications a ON j.id = a.job_id
    WHERE j.id = $1 AND j.deleted_at IS NULL
    GROUP BY j.id, d.name, d.slug`,
    [id]
  );
  return rows[0] || null;
}

export async function createJob(data: Partial<Job>, adminUserId?: string): Promise<Job> {
  // Generate slug if omitted
  const slug =
    data.slug ||
    data.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') ||
    'job-position';

  const publishedAt = data.status === 'PUBLISHED' ? new Date().toISOString() : null;

  const rows = await query<Job>(
    `INSERT INTO jobs (
      title, slug, department_id, employment_type, work_mode, location,
      min_experience, max_experience, salary_min, salary_max, salary_currency,
      vacancies, short_description, description, responsibilities, qualifications,
      preferred_qualifications, required_skills, benefits, opening_date,
      application_deadline, status, published_at, seo_title, seo_description,
      created_by, updated_by
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18, $19, $20,
      $21, $22, $23, $24, $25,
      $26, $26
    )
    RETURNING *`,
    [
      data.title,
      slug,
      data.department_id || null,
      data.employment_type || 'FULL_TIME',
      data.work_mode || 'HYBRID',
      data.location || 'Coimbatore / Remote',
      data.min_experience || 0,
      data.max_experience || null,
      data.salary_min || null,
      data.salary_max || null,
      data.salary_currency || 'INR',
      data.vacancies || 1,
      data.short_description || '',
      data.description || '',
      data.responsibilities || [],
      data.qualifications || [],
      data.preferred_qualifications || [],
      data.required_skills || [],
      data.benefits || [],
      data.opening_date || new Date().toISOString().split('T')[0],
      data.application_deadline || null,
      data.status || 'DRAFT',
      publishedAt,
      data.seo_title || null,
      data.seo_description || null,
      adminUserId || null,
    ]
  );
  return rows[0];
}

export async function updateJob(id: string, data: Partial<Job>, adminUserId?: string): Promise<Job> {
  const existing = await getAdminJobById(id);
  if (!existing) throw new Error('Job not found.');

  const publishedAt =
    data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED' ? new Date().toISOString() : existing.published_at;

  const rows = await query<Job>(
    `UPDATE jobs SET
      title = COALESCE($1, title),
      slug = COALESCE($2, slug),
      department_id = $3,
      employment_type = COALESCE($4, employment_type),
      work_mode = COALESCE($5, work_mode),
      location = COALESCE($6, location),
      min_experience = COALESCE($7, min_experience),
      max_experience = $8,
      salary_min = $9,
      salary_max = $10,
      salary_currency = COALESCE($11, salary_currency),
      vacancies = COALESCE($12, vacancies),
      short_description = COALESCE($13, short_description),
      description = COALESCE($14, description),
      responsibilities = COALESCE($15, responsibilities),
      qualifications = COALESCE($16, qualifications),
      preferred_qualifications = COALESCE($17, preferred_qualifications),
      required_skills = COALESCE($18, required_skills),
      benefits = COALESCE($19, benefits),
      opening_date = COALESCE($20, opening_date),
      application_deadline = $21,
      status = COALESCE($22, status),
      published_at = $23,
      seo_title = $24,
      seo_description = $25,
      updated_by = $26,
      updated_at = NOW()
    WHERE id = $27 AND deleted_at IS NULL
    RETURNING *`,
    [
      data.title,
      data.slug,
      data.department_id || null,
      data.employment_type,
      data.work_mode,
      data.location,
      data.min_experience,
      data.max_experience || null,
      data.salary_min || null,
      data.salary_max || null,
      data.salary_currency,
      data.vacancies,
      data.short_description,
      data.description,
      data.responsibilities,
      data.qualifications,
      data.preferred_qualifications,
      data.required_skills,
      data.benefits,
      data.opening_date,
      data.application_deadline || null,
      data.status,
      publishedAt,
      data.seo_title || null,
      data.seo_description || null,
      adminUserId || null,
      id,
    ]
  );
  return rows[0];
}

export async function updateJobStatus(id: string, status: Job['status'], adminUserId?: string): Promise<Job> {
  const publishedAt = status === 'PUBLISHED' ? new Date().toISOString() : null;
  const rows = await query<Job>(
    `UPDATE jobs SET
      status = $1,
      published_at = CASE WHEN $1 = 'PUBLISHED' AND published_at IS NULL THEN NOW() ELSE published_at END,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $3 AND deleted_at IS NULL
    RETURNING *`,
    [status, adminUserId || null, id]
  );
  if (rows.length === 0) throw new Error('Job not found.');
  return rows[0];
}

export async function deleteJob(id: string, adminUserId?: string): Promise<boolean> {
  // Soft delete preserves all existing candidate applications
  const rows = await query(
    `UPDATE jobs SET
      deleted_at = NOW(),
      status = 'CLOSED',
      updated_by = $1,
      updated_at = NOW()
    WHERE id = $2 AND deleted_at IS NULL
    RETURNING id`,
    [adminUserId || null, id]
  );
  return rows.length > 0;
}

// ----------------------------------------------------------------------------
// APPLICATION MANAGEMENT (ADMIN)
// ----------------------------------------------------------------------------

export type AdminApplicationFilters = {
  status?: string;
  job_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function getAdminApplications(filters: AdminApplicationFilters = {}) {
  const conditions: string[] = ['1=1'];
  const params: any[] = [];
  let paramIdx = 1;

  if (filters.status && filters.status !== 'ALL') {
    conditions.push(`a.application_status = $${paramIdx}`);
    params.push(filters.status);
    paramIdx++;
  }

  if (filters.job_id) {
    conditions.push(`a.job_id = $${paramIdx}`);
    params.push(filters.job_id);
    paramIdx++;
  }

  if (filters.search && filters.search.trim()) {
    conditions.push(`(
      a.full_name ILIKE $${paramIdx} OR
      a.email ILIKE $${paramIdx} OR
      a.phone ILIKE $${paramIdx} OR
      a.application_reference ILIKE $${paramIdx} OR
      j.title ILIKE $${paramIdx}
    )`);
    params.push(`%${filters.search.trim()}%`);
    paramIdx++;
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM job_applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    WHERE ${conditions.join(' AND ')}
  `;
  const countRes = await query<{ total: string }>(countQuery, params);
  const total = Number(countRes[0]?.total || 0);

  const dataQuery = `
    SELECT 
      a.*,
      j.title as job_title,
      u.full_name as assigned_name
    FROM job_applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN admin_users u ON a.assigned_to = u.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY a.submitted_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(limit, offset);

  const items = await query<JobApplication>(dataQuery, params);
  return { items, total, limit, offset };
}

export async function getApplicationDetails(id: string) {
  const appRows = await query<JobApplication>(
    `SELECT 
      a.*,
      j.title as job_title,
      j.slug as job_slug,
      u.full_name as assigned_name
    FROM job_applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN admin_users u ON a.assigned_to = u.id
    WHERE a.id = $1`,
    [id]
  );

  if (appRows.length === 0) return null;
  const application = appRows[0];

  const [history, notes, interviews] = await Promise.all([
    query<ApplicationStatusHistory>(
      `SELECT h.*, u.full_name as changed_by_name
       FROM application_status_history h
       LEFT JOIN admin_users u ON h.changed_by = u.id
       WHERE h.application_id = $1
       ORDER BY h.created_at DESC`,
      [id]
    ),
    query<ApplicationNote>(
      `SELECT n.*
       FROM application_notes n
       WHERE n.application_id = $1
       ORDER BY n.created_at DESC`,
      [id]
    ),
    query<Interview>(
      `SELECT i.*
       FROM interviews i
       WHERE i.application_id = $1
       ORDER BY i.interview_date DESC, i.start_time DESC`,
      [id]
    ),
  ]);

  return {
    application,
    history,
    notes,
    interviews,
  };
}

export async function updateApplicationStatus(
  id: string,
  newStatus: string,
  comments?: string,
  adminUser?: { id: string; fullName: string }
) {
  const current = await query<{ application_status: string }>('SELECT application_status FROM job_applications WHERE id = $1', [id]);
  if (current.length === 0) throw new Error('Application not found.');
  const previousStatus = current[0].application_status;

  await query('UPDATE job_applications SET application_status = $1, updated_at = NOW() WHERE id = $2', [
    newStatus,
    id,
  ]);

  await query(
    `INSERT INTO application_status_history (application_id, previous_status, new_status, changed_by, changed_by_name, comments)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, previousStatus, newStatus, adminUser?.id || null, adminUser?.fullName || 'System Admin', comments || null]
  );

  return { ok: true, previousStatus, newStatus };
}

export async function addApplicationNote(id: string, note: string, adminUser: { id: string; fullName: string }) {
  const rows = await query<ApplicationNote>(
    `INSERT INTO application_notes (application_id, admin_id, admin_name, note)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, adminUser.id, adminUser.fullName, note.trim()]
  );
  return rows[0];
}

export async function assignApplication(id: string, recruiterId: string | null) {
  await query('UPDATE job_applications SET assigned_to = $1, updated_at = NOW() WHERE id = $2', [recruiterId, id]);
  return { ok: true };
}

export async function scheduleInterview(data: Partial<Interview>, adminUserId?: string) {
  const rows = await query<Interview>(
    `INSERT INTO interviews (
      application_id, interview_round, interview_date, start_time, end_time,
      interview_mode, meeting_link, venue, interviewer, feedback, result, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.application_id,
      data.interview_round || 'Technical Round',
      data.interview_date,
      data.start_time,
      data.end_time,
      data.interview_mode || 'ONLINE',
      data.meeting_link || null,
      data.venue || null,
      data.interviewer || 'Technical Interviewer',
      data.feedback || null,
      data.result || 'PENDING',
      adminUserId || null,
    ]
  );

  // Automatically update status to INTERVIEW_SCHEDULED
  if (data.application_id) {
    await updateApplicationStatus(
      data.application_id,
      'INTERVIEW_SCHEDULED',
      `Scheduled ${data.interview_round} for ${data.interview_date}`
    );
  }

  return rows[0];
}
