// Create and Read All
import { NextRequest, NextResponse } from 'next/server';
import { kanbansDB } from '@/lib/couchdb';
import type { CreateTaskInput, Task } from '@/types/task';

export async function GET() {
  try {
    const result = await kanbansDB.list({
      include_docs: true,
    });

    const tasks = result.rows
      .map((row) => row.doc as Task | undefined)
      .filter((doc): doc is Task => doc?.type === 'task');

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const task: Omit<Task, '_id'> = {
      type: 'task',
      title: body.title.trim(),
      description: body.description?.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await kanbansDB.insert(task);

    return NextResponse.json(
      {
        ...task,
        _id: result.id,
        _rev: result.rev,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
  }
}
