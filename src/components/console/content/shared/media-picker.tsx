"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/types/content";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils";
import { MediaSelectableGrid } from "../media/media-selectable-grid";
import { useUploadMedia } from "@/hooks/media/use-media-mutations";
import { MediaFolder, MEDIA_FOLDERS } from "@/types/media";

interface MediaPickerProps {
  open: boolean;
  selectedId?: string | null;
  folder?: MediaFolder;
  onSelect: (media: MediaItem) => void;
  onClose: () => void;
}

export function MediaPicker({
  open,
  selectedId,
  folder = MEDIA_FOLDERS.CONTENTS,
  onSelect,
  onClose,
}: MediaPickerProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [pendingSelection, setPendingSelection] = useState<MediaItem | null>(
    null
  );
  const [uploadKey, setUploadKey] = useState(0);
  
  const uploadMutation = useUploadMedia();

  const handleUpload = useCallback(
    async (file: File, selectedFolder: MediaFolder) => {
      const result = await uploadMutation.mutateAsync({ 
        file, 
        folder: selectedFolder 
      });
      // Switch to library tab and auto-select the uploaded media
      setPendingSelection(result);
      setTab("library");
      setUploadKey((k) => k + 1);
    },
    [uploadMutation]
  );

  if (!open) return null;

  const handleSelect = (media: MediaItem) => {
    setPendingSelection(media);
  };

  const handleConfirm = () => {
    if (pendingSelection) {
      onSelect(pendingSelection);
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl h-150 rounded-xl border border-border bg-card shadow-xl flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
          <h2 className="text-base font-semibold">Select media</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 shrink-0">
          <button
            onClick={() => setTab("library")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              tab === "library"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Media library
          </button>
          <button
            onClick={() => setTab("upload")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              tab === "upload"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload new
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden px-5 py-3 min-h-0">
          {tab === "library" ? (
            <MediaSelectableGrid
              key={uploadKey}
              selectedId={pendingSelection?.id ?? selectedId}
              onSelect={handleSelect}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-full max-w-md">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Upload images to your media library
                </p>
                <Button
                  onClick={() => {
                    // This will be handled by showing upload dialog inline
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        await handleUpload(file, folder);
                      }
                    };
                    input.click();
                  }}
                  className="w-full gap-2"
                  disabled={uploadMutation.isPending}
                >
                  <Upload className="h-4 w-4" />
                  {uploadMutation.isPending ? "Uploading..." : "Choose file to upload"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3 shrink-0">
          <div className="text-xs text-muted-foreground">
            {pendingSelection ? (
              <span className="text-foreground font-medium">
                Selected: {pendingSelection.filename ?? pendingSelection.alt ?? "Image"}
                {pendingSelection.size
                  ? ` (${formatBytes(pendingSelection.size)})`
                  : ""}
              </span>
            ) : (
              "No image selected"
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={!pendingSelection}
            >
              Insert image
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}