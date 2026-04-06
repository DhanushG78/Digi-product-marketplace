import { NextResponse } from 'next/server';
import { itemsDb } from '@/lib/memoryDb';

/**
 * GET /api/items/:id
 * Fetches a single item by its ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = itemsDb.find((item) => item.id === id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch item.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/items/:id
 * Updates an item completely or partially.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Find the item
    const index = itemsDb.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Merge existing fields with updated fields
    const updatedItem = { ...itemsDb[index], ...body };
    itemsDb[index] = updatedItem;

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/:id
 * Removes an item listing from the store.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = itemsDb.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Splice from array
    itemsDb.splice(index, 1);

    return NextResponse.json({ success: true, message: `Deleted item ${id}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item.' },
      { status: 500 }
    );
  }
}
