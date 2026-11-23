"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { X, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { bulkTags } from "@/services/tag.service";
import { TAG_KEYS } from "@/hooks/tags/use-tags";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContentSchema } from "@/schemas/content.schema";
import { TagStub } from "@/types/content";
import { useTags } from "@/hooks/tags/use-tags";
import { cn } from "@/lib/utils";

interface PanelTagsProps {
  control: Control<ContentSchema>;
  /** Tags already attached to the content — keeps their chips labelled even
   *  when they're not part of the currently fetched page. */
  knownTags?: TagStub[];
}

export function PanelTags({ control, knownTags = [] }: PanelTagsProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [newTags, setNewTags] = useState("");
  const [adding, setAdding] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Server-side search so tags outside the first page are reachable
  const { data: tagsData, isFetching } = useTags({
    limit: 50,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const filtered: TagStub[] = useMemo(
    () =>
      (tagsData?.data ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
    [tagsData]
  );

  // Remember every tag we've seen so selected chips never lose their name
  const tagCache = useRef(new Map<string, TagStub>());
  for (const t of knownTags) tagCache.current.set(t.id, t);
  for (const t of filtered) tagCache.current.set(t.id, t);

  // Split pasted/typed text on commas or newlines, resolve every name to a tag
  // (existing ones are reused, missing ones created) and select them all.
  const addTags = async (
    selectedIds: string[],
    onChange: (ids: string[]) => void
  ) => {
    const names = newTags
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0 || adding) return;

    setAdding(true);
    try {
      const { data } = await bulkTags(names);
      for (const t of data) tagCache.current.set(t.id, t);
      const merged = [...selectedIds];
      for (const t of data) if (!merged.includes(t.id)) merged.push(t.id);
      onChange(merged);
      setNewTags("");
      queryClient.invalidateQueries({ queryKey: TAG_KEYS.all });
      const created = data.filter((t) => t.created).length;
      toast.success(
        `${data.length} tag${data.length !== 1 ? "s" : ""} added` +
          (created ? ` (${created} new)` : "")
      );
    } catch {
      toast.error("Failed to add tags. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const total = tagsData?.pagination?.total ?? filtered.length;
  const hasMore = total > filtered.length;

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

          const selectedTags = selectedIds.map(
            (id) =>
              tagCache.current.get(id) ?? { id, name: id, slug: id }
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

              {/* Add tags (comma separated) */}
              <div className="space-y-1">
                <div className="flex gap-1">
                  <Input
                    placeholder="Add tags, separated by commas"
                    value={newTags}
                    disabled={adding}
                    onChange={(e) => setNewTags(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // don't submit the post form
                        addTags(selectedIds, field.onChange);
                      }
                    }}
                    className="h-7 rounded-none text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={adding || !newTags.trim()}
                    onClick={() => addTags(selectedIds, field.onChange)}
                    className="h-7 rounded-none px-3 text-xs"
                  >
                    {adding ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Paste a comma-separated list. Existing tags are reused, not duplicated.
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search tags…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 rounded-none pl-7 pr-7 text-xs"
                />
                {isFetching && (
                  <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Tag list */}
              <div className="max-h-36 overflow-y-auto space-y-0.5 border border-border p-1">
                {filtered.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-1.5">
                    {isFetching ? "Searching…" : "No tags found"}
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
                {hasMore && ` · showing ${filtered.length} of ${total} — search to narrow`}
              </p>
            </div>
          );
        }}
      />
    </div>
  );
}
