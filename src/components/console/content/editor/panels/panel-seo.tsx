"use client";

import { Controller, Control, UseFormRegister, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContentSchema } from "@/schemas/content.schema";
import { cn } from "@/lib/utils";

interface PanelSeoProps {
    control: Control<ContentSchema>;
    register: UseFormRegister<ContentSchema>;
}

function CharCount({
    value,
    max,
    warn,
}: {
    value: string;
    max: number;
    warn: number;
}) {
    const len = value?.length ?? 0;
    return (
        <span
            className={cn(
                "text-xs tabular-nums",
                len > max
                    ? "text-destructive"
                    : len > warn
                        ? "text-yellow-500"
                        : "text-muted-foreground"
            )}
        >
            {len}/{max}
        </span>
    );
}

export function PanelSeo({ control, register }: PanelSeoProps) {
    const seoTitle = useWatch({ control, name: "seo.seoTitle" }) ?? "";
    const metaDesc = useWatch({ control, name: "seo.metaDescription" }) ?? "";
    const ogTitle = useWatch({ control, name: "seo.ogTitle" }) ?? "";
    const ogDesc = useWatch({ control, name: "seo.ogDescription" }) ?? "";
    const twitterTitle = useWatch({ control, name: "seo.twitterTitle" }) ?? "";
    const twitterDesc = useWatch({ control, name: "seo.twitterDescription" }) ?? "";

    return (
        <div className="space-y-4">
            {/* Meta */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Meta
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">SEO title</Label>
                        <CharCount value={seoTitle} max={60} warn={50} />
                    </div>
                    <Input
                        {...register("seo.seoTitle")}
                        placeholder="SEO page title…"
                        className="h-8 rounded-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Meta description</Label>
                        <CharCount value={metaDesc} max={160} warn={140} />
                    </div>
                    <textarea
                        {...register("seo.metaDescription")}
                        rows={3}
                        placeholder="Brief page description for search engines…"
                        className="flex w-full border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Focus keyword</Label>
                    <Input
                        {...register("seo.focusKeyword")}
                        placeholder="Main keyword…"
                        className="h-8 rounded-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Canonical URL</Label>
                    <Input
                        {...register("seo.canonicalUrl")}
                        placeholder="https://…"
                        className="h-8 rounded-none text-sm font-mono"
                    />
                </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Open Graph
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">OG title</Label>
                        <CharCount value={ogTitle} max={60} warn={50} />
                    </div>
                    <Input
                        {...register("seo.ogTitle")}
                        placeholder="Social share title…"
                        className="h-8 rounded-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">OG description</Label>
                        <CharCount value={ogDesc} max={160} warn={140} />
                    </div>
                    <textarea
                        {...register("seo.ogDescription")}
                        rows={2}
                        placeholder="Social share description…"
                        className="flex w-full border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                </div>
            </div>

            {/* Twitter */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Twitter / X
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Twitter title</Label>
                        <CharCount value={twitterTitle} max={60} warn={50} />
                    </div>
                    <Input
                        {...register("seo.twitterTitle")}
                        placeholder="Twitter card title…"
                        className="h-8 rounded-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Twitter description</Label>
                        <CharCount value={twitterDesc} max={160} warn={140} />
                    </div>
                    <textarea
                        {...register("seo.twitterDescription")}
                        rows={2}
                        placeholder="Twitter card description…"
                        className="flex w-full border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                </div>
            </div>

            {/* Indexing */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Indexing
                </p>
                <div className="space-y-2">
                    {[
                        { name: "seo.noIndex" as const, label: "No index", desc: "Exclude from search engines" },
                        { name: "seo.noFollow" as const, label: "No follow", desc: "Don't follow links on this page" },
                    ].map(({ name, label, desc }) => (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="mt-0.5 h-3.5 w-3.5 rounded-none border-border accent-primary"
                                    />
                                    <div>
                                        <p className="text-xs font-medium">{label}</p>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                </label>
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}