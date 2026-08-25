"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    MediaMetadata,
    MediaMetadataField,
    MEDIA_METADATA_MAX_LENGTH,
} from "@/types/media";

interface MediaMetadataFieldsProps {
    values: Required<MediaMetadata>;
    errors?: Partial<Record<MediaMetadataField, string>>;
    disabled?: boolean;
    onChange: (field: MediaMetadataField, value: string) => void;
}

export function MediaMetadataFields({
    values,
    errors = {},
    disabled = false,
    onChange,
}: MediaMetadataFieldsProps) {
    const fieldProps = (field: MediaMetadataField) => ({
        id: `media-${field}`,
        value: values[field],
        maxLength: MEDIA_METADATA_MAX_LENGTH[field],
        disabled,
        "aria-invalid": Boolean(errors[field]),
        "aria-describedby": errors[field] ? `media-${field}-error` : undefined,
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(field, e.target.value),
    });

    return (
        <div className="space-y-4">
            <Field
                field="alt"
                label="Alt text"
                hint="Describes the image for screen readers and search engines."
                error={errors.alt}
            >
                <Input
                    {...fieldProps("alt")}
                    placeholder="A goalkeeper diving to save a penalty"
                    className="h-9"
                />
            </Field>

            <Field field="caption" label="Caption" error={errors.caption}>
                <Input
                    {...fieldProps("caption")}
                    placeholder="Shown under the image"
                    className="h-9"
                />
            </Field>

            <Field field="description" label="Description" error={errors.description}>
                <Textarea
                    {...fieldProps("description")}
                    placeholder="Longer editorial note (optional)"
                    rows={3}
                    className="text-sm"
                />
            </Field>

            {/* Attribution — a label with no URL is perfectly valid. */}
            <div className="pt-1 space-y-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-3">
                    Attribution
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field field="sourceLabel" label="Source" error={errors.sourceLabel}>
                        <Input
                            {...fieldProps("sourceLabel")}
                            placeholder="Photo by Jane Doe"
                            className="h-9"
                        />
                    </Field>

                    <Field
                        field="sourceUrl"
                        label="Source link"
                        hint="Optional"
                        error={errors.sourceUrl}
                    >
                        <Input
                            {...fieldProps("sourceUrl")}
                            type="url"
                            inputMode="url"
                            placeholder="https://example.com/jane"
                            className="h-9"
                        />
                    </Field>

                    <Field field="licenseLabel" label="Licence" error={errors.licenseLabel}>
                        <Input
                            {...fieldProps("licenseLabel")}
                            placeholder="CC BY 4.0"
                            className="h-9"
                        />
                    </Field>

                    <Field
                        field="licenseUrl"
                        label="Licence link"
                        hint="Optional"
                        error={errors.licenseUrl}
                    >
                        <Input
                            {...fieldProps("licenseUrl")}
                            type="url"
                            inputMode="url"
                            placeholder="https://creativecommons.org/licenses/by/4.0/"
                            className="h-9"
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}

interface FieldProps {
    field: MediaMetadataField;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}

function Field({ field, label, hint, error, children }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={`media-${field}`} className="text-xs font-medium">
                {label}
                {hint && (
                    <span className="font-normal text-muted-foreground">· {hint}</span>
                )}
            </Label>
            <div
                className={cn(
                    error &&
                        "**:data-[slot=input]:border-destructive **:data-[slot=textarea]:border-destructive"
                )}
            >
                {children}
            </div>
            {error && (
                <p id={`media-${field}-error`} className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
