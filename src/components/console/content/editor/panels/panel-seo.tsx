"use client";

import { Controller, Control, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContentSchema } from "@/schemas/content.schema";

interface PanelSeoProps {
    control: Control<ContentSchema>;
    register: UseFormRegister<ContentSchema>;
}

export function PanelSeo({ control, register }: PanelSeoProps) {
    return (
        <div className="space-y-4">
            {/* Meta */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Meta
                </p>
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">SEO title</Label>
                    <Input
                        {...register("seo.seoTitle")}
                        placeholder="SEO page title…"
                        className="h-8 rounded-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Meta description</Label>
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