import { NextRequest, NextResponse } from 'next/server';
import { getJobBySlug } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ ok: false, error: 'Slug parameter is required.' }, { status: 400 });
    }

    const job = await getJobBySlug(slug);
    if (!job) {
      return NextResponse.json({ ok: false, error: 'Job opening not found or no longer active.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, job });
  } catch (error: any) {
    console.error('[api/careers/jobs/[slug]] Error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to retrieve job details.' }, { status: 500 });
  }
}
