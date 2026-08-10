"use client";

import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ContentSchema } from "@/schemas/content.schema";
import { CategoryStub, ContentTypeStub } from "@/types/content";

interface PanelCategoryProps {
    control: Control<ContentSchema>;
    categories: CategoryStub[];
    contentTypes: ContentTypeStub[];
    errors: Partial<Record<keyof ContentSchema, { message?: string }>>;
}

export function PanelCategory({
    control,
    categories,
    contentTypes,
    errors,
}: PanelCategoryProps) {
    return (
        <div className="space-y-4">
            {/* Category */}
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Category <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value)}
                            items={categories.map((c) => ({ value: c.id, label: c.name }))}
                        >
                            <SelectTrigger
                                className={cn(errors.categoryId && "border-destructive")}
                            >
                                <SelectValue placeholder="Select category…" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.categoryId && (
                    <p className="text-xs text-destructive">{errors.categoryId.message}</p>
                )}
            </div>

            {/* Content type */}
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Content Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="contentTypeId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value)}
                            items={contentTypes
                                .filter((ct) => ct.isActive)
                                .map((ct) => ({ value: ct.id, label: ct.name }))}
                        >
                            <SelectTrigger
                                className={cn(errors.contentTypeId && "border-destructive")}
                            >
                                <SelectValue placeholder="Select type…" />
                            </SelectTrigger>
                            <SelectContent>
                                {contentTypes
                                    .filter((ct) => ct.isActive)
                                    .map((ct) => (
                                        <SelectItem key={ct.id} value={ct.id}>
                                            {ct.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.contentTypeId && (
                    <p className="text-xs text-destructive">
                        {errors.contentTypeId.message}
                    </p>
                )}
            </div>
        </div>
    );
}