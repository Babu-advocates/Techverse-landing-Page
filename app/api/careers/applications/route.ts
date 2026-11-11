import { NextRequest, NextResponse } from 'next/server';
import { saveResumeFile } from '@/lib/storage';
import { submitApplication } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Honeypot anti-spam check
    const botCheck = formData.get('company_website');
    if (botCheck) {
      // Silently return success to foil bots
      return NextResponse.json({ ok: true, referenceNumber: 'TV-2026-0000' });
    }

    const fullName = (formData.get('full_name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const phone = (formData.get('phone') as string)?.trim();
    const alternatePhone = (formData.get('alternate_phone') as string)?.trim() || undefined;
    const location = (formData.get('location') as string)?.trim();
    const jobId = (formData.get('job_id') as string)?.trim() || undefined;
    const linkedinUrl = (formData.get('linkedin_url') as string)?.trim() || undefined;
    const githubUrl = (formData.get('github_url') as string)?.trim() || undefined;
    const portfolioUrl = (formData.get('portfolio_url') as string)?.trim() || undefined;
    const experienceRaw = formData.get('experience_years') as string;
    const experienceYears = experienceRaw ? parseInt(experienceRaw, 10) : 0;
    const employmentStatus = (formData.get('employment_status') as string)?.trim() || undefined;
    const currentCompany = (formData.get('current_company') as string)?.trim() || undefined;
    const currentDesignation = (formData.get('current_designation') as string)?.trim() || undefined;
    const expectedSalary = (formData.get('expected_salary') as string)?.trim() || undefined;
    const noticePeriod = (formData.get('notice_period') as string)?.trim() || undefined;
    const highestQualification = (formData.get('highest_qualification') as string)?.trim() || undefined;
    const skills = (formData.get('skills') as string)?.trim() || undefined;
    const coverLetter = (formData.get('cover_letter') as string)?.trim() || undefined;
    const whyJoin = (formData.get('why_join') as string)?.trim() || undefined;
    const hearAboutUs = (formData.get('hear_about_us') as string)?.trim() || undefined;
    const privacyConsent = formData.get('privacy_consent') === 'true';

    // Required fields validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ ok: false, error: 'Full name is required (minimum 2 characters).' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!phone || phone.length < 7) {
      return NextResponse.json({ ok: false, error: 'A valid contact phone number is required.' }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json({ ok: false, error: 'Current location / city is required.' }, { status: 400 });
    }
    if (!privacyConsent) {
      return NextResponse.json({ ok: false, error: 'You must consent to privacy policy and data processing to apply.' }, { status: 400 });
    }

    // Resume file validation
    const resumeFile = formData.get('resume') as File | null;
    if (!resumeFile || typeof resumeFile === 'string' || resumeFile.size === 0) {
      return NextResponse.json({ ok: false, error: 'Please upload your Resume/CV (PDF or DOCX format, max 5MB).' }, { status: 400 });
    }

    // Save resume to private storage
    const savedFile = await saveResumeFile(resumeFile);

    // Save application to database & trigger notifications
    const result = await submitApplication({
      job_id: jobId || null,
      full_name: fullName,
      email,
      phone,
      alternate_phone: alternatePhone,
      location,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      experience_years: experienceYears,
      employment_status: employmentStatus,
      current_company: currentCompany,
      current_designation: currentDesignation,
      expected_salary: expectedSalary,
      notice_period: noticePeriod,
      highest_qualification: highestQualification,
      skills,
      cover_letter: coverLetter,
      why_join: whyJoin,
      hear_about_us: hearAboutUs,
      resume_file_path: savedFile.filePath,
      resume_original_name: savedFile.originalName,
      resume_mime_type: savedFile.mimeType,
      resume_file_size: savedFile.size,
      privacy_consent: privacyConsent,
    });

    return NextResponse.json({
      ok: true,
      message: 'Your application has been successfully submitted.',
      referenceNumber: result.referenceNumber,
      applicationId: result.application.id,
    });
  } catch (error: any) {
    console.error('[api/careers/applications] Error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Unable to submit application. Please try again.' },
      { status: 400 }
    );
  }
}
