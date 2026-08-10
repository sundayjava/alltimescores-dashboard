"use client";

import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { X, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContentSchema } from "@/schemas/content.schema";
import { TagStub } from "@/types/content";
import { cn } from "@/lib/utils";

interface PanelTagsProps {
  control: Control<ContentSchema>;
  availableTags: TagStub[];
}

export function PanelTags({ control, availableTags }: PanelTagsProps) {
  const [search, setSearch] = useState("");

  const filtered = availableTags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Tags
      </Label>

      <Controller
        name="tagIds"
        control={control}
        render={({ field }) => {
          const selectedIds = field.value ?? [];

          const toggle = (id: string) => {
            const next = selectedIds.includes(id)
              ? selectedIds.filter((x) => x !== id)
              : [...selectedIds, id];
            field.onChange(next);
          };

          const selectedTags = availableTags.filter((t) =>
            selectedIds.includes(t.id)
          );

          return (
            <div className="space-y-2">
              {/* Selected tags chips */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium"
                    >
                      #{t.name}
                      <button
                        type="button"
                        onClick={() => toggle(t.id)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search tags…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 rounded-none pl-7 text-xs"
                />
              </div>

              {/* Tag list */}
              <div className="max-h-36 overflow-y-auto space-y-0.5 border border-border p-1">
                {filtered.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-1.5">
                    No tags found
                  </p>
                ) : (
                  filtered.map((t) => {
                    const selected = selectedIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggle(t.id)}
                        className={cn(
                          "flex w-full items-center gap-2 px-2 py-1 text-xs transition-colors text-left",
                          selected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "h-3 w-3 border shrink-0 flex items-center justify-center",
                            selected
                              ? "bg-primary border-primary"
                              : "border-input"
                          )}
                        >
                          {selected && (
                            <X className="h-2 w-2 text-primary-foreground" />
                          )}
                        </span>
                        #{t.name}
                      </button>
                    );
                  })
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {selectedIds.length} tag{selectedIds.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          );
        }}
      />
    </div>
  );
}