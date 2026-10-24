export interface Media {
  id: string;
  url: string;
  pathname: string;
  contentType: string;
  altText?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface UploadMediaResult {
  url: string;
  pathname: string;
  contentType: string;
}
