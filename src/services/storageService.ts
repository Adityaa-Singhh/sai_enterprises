/**
 * Storage Service — Sai Enterprises
 *
 * Handles all Firebase Cloud Storage operations:
 *   - File upload with progress tracking
 *   - File deletion by storage path
 *   - File type + size validation
 *
 * IMPORTANT: Always store storagePath alongside the download URL.
 * The download URL alone cannot be used for deletion.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UploadResult {
  downloadURL: string;
  storagePath: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum: 5 MB.`;
  }
  return null; // valid
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Upload a file to Firebase Storage.
 *
 * @param file        The File object to upload
 * @param storagePath The full storage path, e.g. "products/prod-123/image-0.jpg"
 * @param onProgress  Optional callback receiving upload progress (0–100)
 * @returns           { downloadURL, storagePath }
 */
export function uploadFile(
  file: File,
  storagePath: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(pct));
        }
      },
      (error) => {
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL, storagePath });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Upload a product image.
 * Path: products/{productId}/{filename}
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}.${ext}`;
  return uploadFile(file, `products/${productId}/${filename}`, onProgress);
}

/**
 * Upload a brand logo.
 * Path: brands/{brandId}/{filename}
 */
export async function uploadBrandLogo(
  brandId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split('.').pop() ?? 'png';
  const filename = `logo.${ext}`;
  return uploadFile(file, `brands/${brandId}/${filename}`, onProgress);
}

/**
 * Upload a gallery image.
 * Path: gallery/{imageId}/{filename}
 */
export async function uploadGalleryImage(
  imageId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}.${ext}`;
  return uploadFile(file, `gallery/${imageId}/${filename}`, onProgress);
}

/**
 * Upload a category image.
 * Path: categories/{categoryId}/{filename}
 */
export async function uploadCategoryImage(
  categoryId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `image.${ext}`;
  return uploadFile(file, `categories/${categoryId}/${filename}`, onProgress);
}

/**
 * Upload a homepage banner.
 * Path: banners/{filename}
 */
export async function uploadBannerImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}.${ext}`;
  return uploadFile(file, `banners/${filename}`, onProgress);
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a file from Firebase Storage by its storage path.
 *
 * @param storagePath  The exact storage path returned during upload.
 *                     Example: "products/prod-abc/1234567890.jpg"
 */
export async function deleteFile(storagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err: unknown) {
    // If file doesn't exist, ignore — it may have been manually deleted
    const code = (err as { code?: string })?.code;
    if (code !== 'storage/object-not-found') {
      throw err;
    }
  }
}
