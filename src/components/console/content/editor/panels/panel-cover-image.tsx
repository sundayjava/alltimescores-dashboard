"use client";

import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { ImageIcon, X, Replace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "../../shared/media-picker";
import { ContentSchema } from "@/schemas/content.schema";
import { MediaItem } from "@/types/content";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/services/media.service";

interface PanelCoverImageProps {
  control: Control<ContentSchema>;
  currentImage?: MediaItem | null;
  onImageChange: (media: MediaItem | null) => void;
}

export function PanelCoverImage({
  control,
  currentImage,
  onImageChange,
}: PanelCoverImageProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Cover Image
      </Label>

      <Controller
        name="coverImageId"
        control={control}
        render={({ field }) => (
          <>
            {currentImage ? (
              <div className="relative group overflow-hidden border border-border">
                <img
                  src={getMediaUrl(currentImage.url)}
                  alt={currentImage.alt ?? "Cover image"}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 rounded-none text-xs gap-1"
                    onClick={() => setPickerOpen(true)}
                  >
                    <Replace className="h-3 w-3" />
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-7 rounded-none text-xs gap-1"
                    onClick={() => {
                      field.onChange("");
                      onImageChange(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className={cn(
                  "w-full aspect-video border-2 border-dashed border-border",
                  "flex flex-col items-center justify-center gap-2 text-muted-foreground",
                  "hover:border-primary/50 hover:bg-muted/30 transition-colors"
                )}
              >
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs font-medium">Set cover image</span>
              </button>
            )}
 
            <MediaPicker 
              open={pickerOpen}
              selectedId={field.value}
              folder="contents"
              onSelect={(media: MediaItem) => {
                field.onChange(media.id);
                onImageChange(media);
                setPickerOpen(false);
              }}
              onClose={() => setPickerOpen(false)}
            />
          </>
        )}
      />
    </div>
  );
}