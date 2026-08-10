import { api } from "@/lib/api";
import { Media, MediaFolder, MediaListResponse, MediaQueryParams } from "@/types/media";

const BASE = "/cms/media";

// Axios detects FormData and sets multipart/form-data + boundary automatically
export async function uploadMedia(
    file: File,
    folder: MediaFolder,
    onProgress?: (percent: number) => void
): Promise<Media> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post<{ success: boolean; data: Media }>(
        `${BASE}?folder=${folder}`,
        formData,
        {
            headers: {
                "Content-Type": undefined, // Let browser set multipart/form-data + boundary
            },
            onUploadProgress: (e) => {
                if (e.total && onProgress) {
                    onProgress(Math.round((e.loaded * 100) / e.total));
                }
            },
        }
    );

    return data.data;
}

export async function getMedia(params?: MediaQueryParams): Promise<MediaListResponse> {
    const response = await api.get<MediaListResponse>(BASE, { params });
    return response.data;
}

export async function getMediaById(id: string): Promise<Media> {
    const { data } = await api.get<{ success: boolean; data: Media }>(`${BASE}/${id}`);
    return data.data;
}

export async function deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete<{ success: boolean; message: string }>(`${BASE}/${id}`);
    return data;
}

export function getMediaUrl(relativeUrl: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  try {
    const { origin } = new URL(apiUrl);   // strips /api/v1, keeps http://localhost:4000
    return `${origin}${relativeUrl}`;
  } catch {
    return relativeUrl;
  }
}