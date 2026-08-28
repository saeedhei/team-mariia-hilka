// Read One + Update + Delete
import { NextRequest, NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { Task, UpdateTaskInput } from '@/types/task';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

function getErrorStatusCode(error: unknown): number | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  ) {
    return error.statusCode;
  }

  return undefined;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const task = (await kanbansDB.get(id)) as Task;

    if (task.type !== 'task') {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error: unknown) {
    console.error(error);

    if (getErrorStatusCode(error) === 404) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const body: UpdateTaskInput = await request.json();

    const task = (await kanbansDB.get(id)) as Task;

    if (task.type !== 'task') {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const updatedTask: Task = {
      ...task,
      title: body.title?.trim() ?? task.title,
      description: body.description?.trim() ?? task.description,
      completed: body.completed ?? task.completed,
      updatedAt: new Date().toISOString(),
    };

    const result = await kanbansDB.insert(updatedTask);

    return NextResponse.json({
      ...updatedTask,
      _rev: result.rev,
    });
  } catch (error: unknown) {
    console.error(error);

    if (getErrorStatusCode(error) === 404) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const task = (await kanbansDB.get(id)) as Task;

    if (task.type !== 'task') {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    await kanbansDB.destroy(task._id, task._rev!);

    return NextResponse.json({
      message: 'Task deleted successfully',
    });
  } catch (error: unknown) {
    console.error(error);

    if (getErrorStatusCode(error) === 404) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
}
