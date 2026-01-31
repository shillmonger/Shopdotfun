import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { uploadProfileImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadProfileImage(file);

    const client = await clientPromise;
    const db = client.db('shop_dot_fun');
    
    // Update the seller's profile image in database
    const result = await db.collection('sellers').updateOne(
      { email: session.user.email },
      {
        $set: {
          profileImage: uploadResult.secure_url,
          profileImagePublicId: uploadResult.publicId,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse('Seller not found', { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile image updated successfully',
      profileImage: uploadResult.secure_url
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to upload profile image' 
    }, { status: 500 });
  }
}
