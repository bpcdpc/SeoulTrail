import { ENV } from "../config/env";
import type { ImageItem, ImageResponse } from "../type/imageTypes";

async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `KakaoAK ${ENV.REST_KEY}` },
    });
    if (!res.ok) {
      const errorText = res.text();
      throw new Error(`HTTP Error : ${res.status} ${errorText}`);
    }
    const data: T = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) console.log(err);
    return null;
  }
}

export async function fetchImages(query: string): Promise<ImageItem[]> {
  const url = `${ENV.IMAGE_URL}?query=${query}&page=1&size=4`;
  const imageRes: ImageResponse | null = await fetchData(url);
  if (!imageRes) throw new Error("이미지 정보를 가져오지 못했습니다.");
  return imageRes.documents;
}
