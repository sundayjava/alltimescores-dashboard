"use client";

import { useState } from "react";
import { Search, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/services/media.service";
import { useMedia } from "@/hooks/media/use-media";
import { PAGE_SIZE } from "@/lib/constant";
import { MediaItem } from "@/types/content";

interface MediaSelectableGridProps {
  selectedId?: string | null;
  onSelect: (media: MediaItem) => void;
}

export function MediaSelectableGrid({
  selectedId,
  onSelect,
}: MediaSelectableGridProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");

  const { data, isLoading, isFetching } = useMedia({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const media = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search media…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(localSearch);
              setPage(1);
            }
          }}
          className="h-8 pl-8 text-sm"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No media found</p>
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2",
              isFetching && "opacity-60"
            )}
          >
            {media.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={cn(
                  "group relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                  selectedId === item.id
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                )}
              >
                <img
                  src={getMediaUrl(item.url)}
                  alt={item.alt ?? ""}
                  className="w-full h-full object-cover"
                />
                {selectedId === item.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] truncate">
                    {item.fileName ?? item.alt ?? "Image"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <span className="flex items-center px-2 text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
