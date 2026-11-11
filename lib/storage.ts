import fs from 'fs';
import path from 'path';

// Private storage directory strictly outside public folder
const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'resumes');

// Ensure directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function saveResumeFile(file: File): Promise<{
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
}> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Resume file exceeds maximum limit of 5 MB.');
  }

  const mimeType = file.type || 'application/pdf';
  if (!ALLOWED_MIME_TYPES.includes(mimeType) && !file.name.match(/\.(pdf|docx?)$/i)) {
    throw new Error('Only PDF and DOC/DOCX documents are permitted.');
  }

  const extension = path.extname(file.name).toLowerCase() || '.pdf';
  const safeExtension = ['.pdf', '.doc', '.docx'].includes(extension) ? extension : '.pdf';
  const randomFileName = `${crypto.randomUUID()}${safeExtension}`;
  const targetPath = path.join(STORAGE_DIR, randomFileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Magic bytes basic verification for PDF (%PDF-)
  if (safeExtension === '.pdf') {
    const header = buffer.subarray(0, 4).toString('ascii');
    if (header !== '%PDF') {
      throw new Error('Invalid PDF format: file header signature mismatch.');
    }
  }

  fs.writeFileSync(targetPath, buffer);

  // Return relative path for database storage
  const relativePath = path.join('storage', 'resumes', randomFileName);

  return {
    filePath: relativePath,
    originalName: file.name,
    mimeType,
    size: file.size,
  };
}

export function getResumeFileBuffer(relativeFilePath: string): {
  buffer: Buffer;
  fileName: string;
} {
  // Prevent path traversal attacks
  const normalized = path.normalize(relativeFilePath).replace(/^(\.\.[\/\\])+/, '');
  const absolutePath = path.resolve(process.cwd(), normalized);

  if (!absolutePath.startsWith(STORAGE_DIR)) {
    throw new Error('Access denied: unauthorized storage path.');
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error('Resume file not found on disk.');
  }

  const buffer = fs.readFileSync(absolutePath);
  return {
    buffer,
    fileName: path.basename(absolutePath),
  };
}
