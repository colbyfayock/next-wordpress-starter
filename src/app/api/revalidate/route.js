import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * Webhook endpoint for on-demand revalidation
 * Call this from WordPress when content changes
 *
 * POST /api/revalidate
 * Body: { path: "/2021/04/post-slug/", secret: "your-secret" }
 */

export async function POST(request) {
  try {
    const { path, secret } = await request.json();

    // Verify secret token (set in env vars)
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    // Revalidate the specific path
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ message: 'Error revalidating', error: error.message }, { status: 500 });
  }
}
