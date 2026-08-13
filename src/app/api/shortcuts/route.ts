import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Helper to get the absolute path to shortcuts.json
const getShortcutsPath = () => path.join(process.cwd(), 'src', 'data', 'shortcuts.json');

export async function GET() {
  try {
    const filePath = getShortcutsPath();
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading shortcuts:', error);
    return NextResponse.json({ error: 'Failed to read shortcuts data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newShortcuts = await request.json();
    const filePath = getShortcutsPath();
    
    // Validate that it's an array (basic validation)
    if (!Array.isArray(newShortcuts)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
    }

    // Format JSON beautifully before saving
    const fileContent = JSON.stringify(newShortcuts, null, 2);
    
    // Write back to the file system
    await fs.writeFile(filePath, fileContent, 'utf8');
    
    return NextResponse.json({ success: true, message: 'Shortcuts saved successfully' });
  } catch (error) {
    console.error('Error saving shortcuts:', error);
    return NextResponse.json({ error: 'Failed to save shortcuts data' }, { status: 500 });
  }
}
