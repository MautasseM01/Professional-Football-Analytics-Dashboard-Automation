
/**
 * Utilities for handling image URLs and conversions
 */

/**
 * Extracts the file ID from a Google Drive URL
 * @param url The Google Drive URL
 * @returns The file ID or null if not found
 */
export const extractGoogleDriveFileId = (url: string): string | null => {
  // Handle direct uc?export=view format
  const directPattern = /[?&]id=([^&]+)/;
  const directMatch = url.match(directPattern);
  if (directMatch) return directMatch[1];
  
  // Handle /file/d/{fileId}/view format
  const filePattern = /\/file\/d\/([^\/]+)\/view/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) return fileMatch[1];
  
  // Handle uc?id={fileId} format
  const ucPattern = /\/uc\?id=([^&]+)/;
  const ucMatch = url.match(ucPattern);
  if (ucMatch) return ucMatch[1];
  
  return null;
};

/**
 * Converts a Google Drive URL to a direct image URL
 * @param url The Google Drive URL
 * @returns A direct image URL that may work better for embedding
 */
export const getGoogleDriveDirectUrl = (url: string): string => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Gets a thumbnail version of a Google Drive image which may avoid CORS issues
 * @param url The Google Drive URL
 * @returns A thumbnail URL for the image
 */
export const getGoogleDriveThumbnailUrl = (url: string): string | null => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};
