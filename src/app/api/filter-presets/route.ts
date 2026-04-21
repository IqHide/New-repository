import { auth } from '@/auth/auth';
import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const presets = await prisma.filterPreset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(presets);
}

async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const preset = await prisma.filterPreset.create({
    data: {
      userId: session.user.id,
      name: body.name,
      brand: body.brand ?? null,
      onlyWithPhoto: body.onlyWithPhoto,
      accelerationMin: body.accelerationMin,
      accelerationMax: body.accelerationMax,
      quarterMileMin: body.quarterMileMin,
      quarterMileMax: body.quarterMileMax,
      nurburgringMin: body.nurburgringMin,
      nurburgringMax: body.nurburgringMax,
    },
  });

  return NextResponse.json(preset, { status: 201 });
}

export { GET, POST };
