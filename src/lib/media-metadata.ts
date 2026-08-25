import {
  EMPTY_MEDIA_METADATA,
  Media,
  MediaMetadata,
  MediaMetadataField,
  MEDIA_METADATA_FIELDS,
  MEDIA_METADATA_MAX_LENGTH,
} from "@/types/media";

/**
 * Turns a media object into a fully-populated form state — nulls become "",
 * which is exactly what the API treats as "clear this field" on save.
 */
export function toMediaMetadataForm(media?: Media | null): Required<MediaMetadata> {
  if (!media) return { ...EMPTY_MEDIA_METADATA };

  return MEDIA_METADATA_FIELDS.reduce(
    (acc, field) => ({ ...acc, [field]: media[field] ?? "" }),
    {} as Required<MediaMetadata>
  );
}

/** The server only accepts http/https; anything else (javascript:, bare host) is a 400. */
export function isValidMediaUrl(value: string): boolean {
  if (!value.trim()) return true; // empty is fine — it clears the field

  try {
    const { protocol } = new URL(value.trim());
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const URL_FIELDS: MediaMetadataField[] = ["sourceUrl", "licenseUrl"];

/**
 * Mirrors the server-side rules so we can block a save before it round-trips.
 * Returns a per-field message map; empty means valid.
 */
export function validateMediaMetadata(
  values: MediaMetadata
): Partial<Record<MediaMetadataField, string>> {
  const errors: Partial<Record<MediaMetadataField, string>> = {};

  for (const field of MEDIA_METADATA_FIELDS) {
    const value = values[field];
    if (value === undefined) continue;

    const trimmed = value.trim();
    const max = MEDIA_METADATA_MAX_LENGTH[field];

    if (trimmed.length > max) {
      errors[field] = `Must be ${max} characters or fewer.`;
      continue;
    }

    if (URL_FIELDS.includes(field) && !isValidMediaUrl(trimmed)) {
      errors[field] = "Enter a full http:// or https:// URL.";
    }
  }

  return errors;
}

/** True when the media object carries anything worth showing as attribution. */
export function hasAttribution(media: Media): boolean {
  return Boolean(media.sourceLabel || media.sourceUrl || media.licenseLabel || media.licenseUrl);
}
