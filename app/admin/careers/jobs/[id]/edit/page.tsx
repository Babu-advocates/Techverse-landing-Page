import { notFound } from 'next/navigation';
import { getAdminJobById } from '@/lib/careers';
import JobForm from '@/components/careers/JobForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await getAdminJobById(id);

  if (!job) {
    notFound();
  }

  return <JobForm initialJob={job} isEdit={true} />;
}
