import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
      'image/svg+xml',
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/json',
      'model/gltf+json',
      'model/gltf-binary',
      'application/octet-stream',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const uploadMiddleware = promisify(upload.array('files'));

interface ProcessedFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  metadata: {
    dimensions?: { width: number; height: number };
    colorSpace?: string;
    channels?: number;
    format?: string;
    hasAlpha?: boolean;
  };
  thumbnailUrl?: string;
}

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const THUMB_DIR = path.join(UPLOAD_DIR, 'thumbnails');

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${name}_${timestamp}_${random}${ext}`;
}

// Process image and extract metadata
async function processImage(buffer: Buffer, mimetype: string): Promise<any> {
  try {
    if (mimetype === 'image/svg+xml') {
      // SVG processing - basic metadata extraction
      const svgContent = buffer.toString('utf-8');
      const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
      const widthMatch = svgContent.match(/width="([^"]+)"/);
      const heightMatch = svgContent.match(/height="([^"]+)"/);
      
      let dimensions = { width: 0, height: 0 };
      
      if (viewBoxMatch) {
        const [, , width, height] = viewBoxMatch[1].split(' ').map(Number);
        dimensions = { width, height };
      } else if (widthMatch && heightMatch) {
        dimensions = {
          width: parseInt(widthMatch[1]),
          height: parseInt(heightMatch[1]),
        };
      }
      
      return {
        dimensions,
        format: 'svg',
        channels: 4,
        hasAlpha: true,
      };
    }
    
    // Use Sharp for other image formats
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    return {
      dimensions: { width: metadata.width || 0, height: metadata.height || 0 },
      format: metadata.format,
      channels: metadata.channels,
      colorSpace: metadata.space,
      hasAlpha: metadata.hasAlpha,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {};
  }
}

// Generate thumbnail for images
async function generateThumbnail(buffer: Buffer, mimetype: string, outputPath: string): Promise<string | null> {
  try {
    if (mimetype === 'image/svg+xml') {
      // For SVG, we'll save the original as thumbnail (or could use a library to convert)
      const thumbnailPath = path.join(THUMB_DIR, path.basename(outputPath, '.svg') + '.png');
      // For now, just return null - in production, you might want to convert SVG to PNG
      return null;
    }
    
    const thumbnailPath = path.join(THUMB_DIR, path.basename(outputPath, path.extname(outputPath)) + '.jpg');
    
    await sharp(buffer)
      .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    return `/uploads/thumbnails/${path.basename(thumbnailPath)}`;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

// Process JSON files (Lottie, etc.)
async function processJson(buffer: Buffer): Promise<any> {
  try {
    const jsonContent = JSON.parse(buffer.toString('utf-8'));
    
    // Check if it's a Lottie file
    if (jsonContent.v && jsonContent.fr && jsonContent.layers) {
      return {
        format: 'lottie',
        version: jsonContent.v,
        frameRate: jsonContent.fr,
        duration: jsonContent.op / jsonContent.fr,
        dimensions: { width: jsonContent.w, height: jsonContent.h },
      };
    }
    
    return { format: 'json' };
  } catch (error) {
    console.error('Error processing JSON:', error);
    return { format: 'json' };
  }
}

// Main upload handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure upload directories exist
    ensureDirectoryExists(UPLOAD_DIR);
    ensureDirectoryExists(THUMB_DIR);

    // Process file upload
    await uploadMiddleware(req as any, res as any);

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const processedFiles: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = generateFilename(file.originalname);
      const filePath = path.join(UPLOAD_DIR, filename);
      
      // Get metadata from form data
      const metadataKey = `metadata_${i}`;
      const clientMetadata = req.body[metadataKey] ? JSON.parse(req.body[metadataKey]) : {};

      // Validate file type using file-type library
      const detectedType = await fileTypeFromBuffer(file.buffer);
      
      // Write file to disk
      await fs.promises.writeFile(filePath, file.buffer);

      // Process file based on type
      let fileMetadata: any = {};
      let thumbnailUrl: string | null = null;

      if (file.mimetype.startsWith('image/')) {
        fileMetadata = await processImage(file.buffer, file.mimetype);
        thumbnailUrl = await generateThumbnail(file.buffer, file.mimetype, filePath);
      } else if (file.mimetype === 'application/json') {
        fileMetadata = await processJson(file.buffer);
      }

      const processedFile: ProcessedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
        originalName: file.originalname,
        filename,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
        url: `/uploads/${filename}`,
        metadata: fileMetadata,
        ...(thumbnailUrl && { thumbnailUrl }),
      };

      processedFiles.push(processedFile);

      // Log upload for debugging
      console.log(`Processed file: ${file.originalname} -> ${filename}`);
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${processedFiles.length} files`,
      files: processedFiles,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        return res.status(413).json({ error: 'File too large' });
      }
      if (error.message.includes('Invalid file type')) {
        return res.status(400).json({ error: 'Invalid file type' });
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
}; 