export interface ImageItem {
  collection: string;
  datetime: string;
  display_sitename: string;
  doc_url: string;
  height: number;
  image_url: string;
  thumbnail_url: string;
  width: number;
}

export interface ImageResponse {
  documents: ImageItem[];
  meta: {
    is_end: boolean;
  };
}
