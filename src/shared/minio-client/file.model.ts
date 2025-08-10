export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export interface MetaData {
  contentType: AppMimeType;
  contentLength: number;
  contentTransferEnconding: string;
  contentDisposition: string;
}

export interface MinIOFile {
  url: string;
  originalname: string;
  fileName: string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export const AppMimeTypes = [
  'image/png',
  'image/jpeg',
  'text/csv',
  'text/plain',
  'application/msword',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text',
  'application/pdf',
  'application/vnd.google-earth.kmz',
  'application/vnd.google-earth.kml+xml',
] as const;

export type AppMimeType = (typeof AppMimeTypes)[number];

export const ContentTypeToFileExtension: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'text/csv': 'csv',
  'text/plain': 'txt',
  'application/msword': 'doc',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/pdf': 'pdf',
  'application/vnd.google-earth.kmz': 'kmz',
  'application/vnd.google-earth.kml+xml': 'kml',
};
