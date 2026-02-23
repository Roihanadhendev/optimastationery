"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    sku: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, sku, onChange }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value ?? null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleUpload = useCallback(
        async (file: File) => {
            if (!file.type.startsWith("image/")) return;

            // Client-side preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);

            setUploading(true);

            try {
                const supabase = createSupabaseBrowserClient();
                const ext = file.name.split(".").pop() ?? "jpg";
                const fileName = `${sku || "product"}-${Date.now()}.${ext}`;
                const filePath = `products/${fileName}`;

                const { error } = await supabase.storage
                    .from("product-images")
                    .upload(filePath, file, { upsert: true });

                if (error) throw error;

                const {
                    data: { publicUrl },
                } = supabase.storage.from("product-images").getPublicUrl(filePath);

                onChange(publicUrl);
            } catch (err) {
                console.error("Upload failed:", err);
                setPreview(value ?? null);
            } finally {
                setUploading(false);
            }
        },
        [sku, value, onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleUpload(file);
        },
        [handleUpload]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange("");
    };

    return (
        <div
            className={cn(
                "relative border-2 border-dashed rounded-xl transition-colors",
                dragOver ? "border-primary bg-blue-50" : "border-slate-200",
                preview ? "p-2" : "p-6"
            )}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <Image
                        src={preview}
                        alt="Product preview"
                        fill
                        className="object-contain"
                        sizes="400px"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                        aria-label="Remove image"
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center cursor-pointer gap-2">
                    <Upload className="w-10 h-10 text-slate-400" />
                    <span className="text-sm text-slate-500">
                        Drag & drop atau{" "}
                        <span className="text-primary font-medium">pilih file</span>
                    </span>
                    <span className="text-xs text-slate-400">PNG, JPG, WebP max 5MB</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    );
}
