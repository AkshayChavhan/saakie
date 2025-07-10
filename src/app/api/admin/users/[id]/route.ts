import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for routes that use auth()
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Specify Node.js runtime for Prisma compatibility

// GET - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
        addresses: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formattedUser = {
      id: user.id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orderCount: user._count.orders,
      totalSpent: user.orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
      orders: user.orders,
      addresses: user.addresses,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, role, status } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(status && { status }),
      },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    const formattedUser = {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      orderCount: updatedUser._count.orders,
      totalSpent: updatedUser.orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
    };

    return NextResponse.json({
      message: 'User updated successfully',
      user: formattedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (existingUser.clerkId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user (this will cascade delete addresses and orders)
    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
