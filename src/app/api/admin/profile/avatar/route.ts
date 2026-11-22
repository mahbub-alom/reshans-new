import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
} from '@/lib/auth';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
}

const MAX_FILE_SIZE_BYTES = 2048 * 1024; 

async function authenticateAdmin(request: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  const token = headerToken || cookieToken;
  if (!token) return null;

  const user = await validateSessionToken(token);
  if (!user || user.role !== 'ADMIN') return null;

  return user;
}

export async function POST(request: Request) {
  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Verify file size: maximum 2048 KB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 2048 KB limit (Current size: ${(file.size / 1024).toFixed(1)} KB). Please choose a smaller image.`,
        },
        { status: 400 }
      );
    }

    // Verify mimetype: must be an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload an image file (PNG, JPG, WEBP, etc.)' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary folder 'reshans_avatars'
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: 'reshans_avatars',
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      message: 'Photo uploaded to Cloudinary successfully',
    });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload error' },
      { status: 500 }
    );
  }
}
