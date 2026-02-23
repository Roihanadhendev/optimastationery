"use client";

import { useState, useEffect } from "react";
import {
    ArrowUpDown,
    AlertTriangle,
    Check,
    Loader2,
    ArrowUp,
    ArrowDown,
    PercentIcon,
    DollarSign,
    Eye,
    Save,
    X,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface PriceChange {
    id: string;
    name: string;
    sku: string;
    currentPrice: number;
    newPrice: number;
    difference: number;
}

export default function BulkPricePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [mode, setMode] = useState<"percentage" | "fixed">("percentage");
    const [value, setValue] = useState<string>("");
    const [direction, setDirection] = useState<"increase" | "decrease">(
        "increase"
    );
    const [roundTo, setRoundTo] = useState<100 | 500>(100);
    const [previewData, setPreviewData] = useState<PriceChange[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        fetch("/api/admin/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories || []))
            .catch(console.error);
    }, []);

    const handlePreview = async () => {
        if (!selectedCategory || !value) return;
        setIsLoading(true);
        setMessage(null);
        setPreviewData(null);

        try {
            const res = await fetch("/api/admin/bulk-price", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-role": "ADMIN",
                },
                body: JSON.stringify({
                    categoryId: selectedCategory,
                    mode,
                    value: parseFloat(value),
                    direction,
                    roundTo,
                    preview: true,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.error });
                return;
            }

            setPreviewData(data.changes);
        } catch {
            setMessage({ type: "error", text: "Gagal memuat preview." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExecute = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/bulk-price", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-role": "ADMIN",
                },
                body: JSON.stringify({
                    categoryId: selectedCategory,
                    mode,
                    value: parseFloat(value),
                    direction,
                    roundTo,
                    preview: false,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.error });
                return;
            }

            setMessage({ type: "success", text: data.message });
            setPreviewData(null);
            setShowConfirm(false);
        } catch {
            setMessage({ type: "error", text: "Gagal menyimpan perubahan harga." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ArrowUpDown className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-extrabold text-slate-900">
                                Manajemen Harga Massal
                            </h1>
                            <p className="text-sm text-slate-500">
                                Update harga produk per kategori secara batch
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
                {/* Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                    >
                        {message.type === "success" ? (
                            <Check className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
                    <h2 className="font-heading font-bold text-lg text-slate-900 mb-6">
                        Konfigurasi Update
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Kategori
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setPreviewData(null);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            >
                                <option value="">Pilih kategori...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Value Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Nilai
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        setPreviewData(null);
                                    }}
                                    placeholder={
                                        mode === "percentage" ? "Contoh: 10" : "Contoh: 5000"
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-12 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    min="0"
                                    step={mode === "percentage" ? "0.1" : "100"}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                    {mode === "percentage" ? "%" : "IDR"}
                                </span>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mode
                            </label>
                            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setMode("percentage");
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${mode === "percentage"
                                            ? "bg-primary text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <PercentIcon className="w-4 h-4" />
                                    Persen
                                </button>
                                <button
                                    onClick={() => {
                                        setMode("fixed");
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${mode === "fixed"
                                            ? "bg-primary text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <DollarSign className="w-4 h-4" />
                                    Nominal
                                </button>
                            </div>
                        </div>

                        {/* Direction Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Arah Perubahan
                            </label>
                            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setDirection("increase");
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${direction === "increase"
                                            ? "bg-green-500 text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                    Naik
                                </button>
                                <button
                                    onClick={() => {
                                        setDirection("decrease");
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${direction === "decrease"
                                            ? "bg-red-500 text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <ArrowDown className="w-4 h-4" />
                                    Turun
                                </button>
                            </div>
                        </div>

                        {/* Rounding */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Pembulatan
                            </label>
                            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setRoundTo(100);
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 py-2.5 text-sm font-medium transition-all ${roundTo === 100
                                            ? "bg-primary text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    Rp100
                                </button>
                                <button
                                    onClick={() => {
                                        setRoundTo(500);
                                        setPreviewData(null);
                                    }}
                                    className={`flex-1 py-2.5 text-sm font-medium transition-all ${roundTo === 500
                                            ? "bg-primary text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    Rp500
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handlePreview}
                            disabled={!selectedCategory || !value || isLoading}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                            Preview Perubahan
                        </button>
                    </div>
                </div>

                {/* Preview Table */}
                {previewData && previewData.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="font-heading font-bold text-lg text-slate-900">
                                Preview Perubahan Harga
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Tinjau perubahan berikut sebelum menyimpan.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Produk
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                            Harga Saat Ini
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                            Harga Baru
                                        </th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                            Selisih
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {previewData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                                {item.sku}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700 text-right">
                                                {formatRupiah(item.currentPrice)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-primary text-right">
                                                {formatRupiah(item.newPrice)}
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-sm font-semibold text-right ${item.difference > 0
                                                        ? "text-green-600"
                                                        : item.difference < 0
                                                            ? "text-red-600"
                                                            : "text-slate-400"
                                                    }`}
                                            >
                                                {item.difference > 0 ? "+" : ""}
                                                {formatRupiah(item.difference)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setPreviewData(null)}
                                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm shadow-green-500/20"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Dialog */}
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-lg text-slate-900">
                                        Konfirmasi Perubahan
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Anda akan mengubah harga{" "}
                                        <span className="font-semibold text-slate-700">
                                            {previewData?.length} produk
                                        </span>
                                        . Tindakan ini tidak bisa dibatalkan secara otomatis.
                                        Riwayat perubahan akan disimpan di log.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Batal
                                </button>
                                <button
                                    onClick={handleExecute}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Ya, Update Harga
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
