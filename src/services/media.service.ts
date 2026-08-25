import { api } from "@/lib/api";
import {
    Media,
    MediaFolder,
    MediaListResponse,
    MediaMetadata,
    MediaQueryParams,
    MEDIA_METADATA_FIELDS,
} from "@/types/media";

const BASE = "/cms/media";

// Axios detects FormData and sets multipart/form-data + boundary automatically
export async function uploadMedia(
    file: File,
    folder: MediaFolder,
    onProgress?: (percent: number) => void,
    metadata?: MediaMetadata
): Promise<Media> {
    const formData = new FormData();
    formData.append("image", file);

    // Every metadata field is optional; "" is accepted and stored as NULL, so we
    // only skip fields the caller never set.
    if (metadata) {
        for (const field of MEDIA_METADATA_FIELDS) {
            const value = metadata[field];
            if (value !== undefined) formData.append(field, value);
        }
    }

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

/**
 * Edits metadata on an already-uploaded image. JSON, not multipart — the file
 * itself never changes. Omitted fields stay as they are; "" clears a field.
 */
export async function updateMedia(id: string, metadata: MediaMetadata): Promise<Media> {
    const { data } = await api.patch<{ success: boolean; data: Media }>(
        `${BASE}/${id}`,
        metadata
    );
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