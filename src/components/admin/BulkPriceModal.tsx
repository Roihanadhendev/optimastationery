"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { bulkUpdatePrices } from "@/app/admin/products/actions";
import { Loader2, TrendingUp } from "lucide-react";

interface BulkPriceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIds: string[];
}

export function BulkPriceModal({
    open,
    onOpenChange,
    selectedIds,
}: BulkPriceModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [type, setType] = useState<"percentage" | "fixed">("percentage");
    const [value, setValue] = useState("");
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!value || selectedIds.length === 0) return;

        startTransition(async () => {
            await bulkUpdatePrices(selectedIds, type, Number(value), reason);
            onOpenChange(false);
            setValue("");
            setReason("");
            router.refresh();
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Update Harga Massal
                    </DialogTitle>
                    <DialogDescription>
                        Terapkan perubahan harga untuk {selectedIds.length} produk yang
                        dipilih.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label>Jenis Penyesuaian</Label>
                        <Select
                            value={type}
                            onValueChange={(v) => setType(v as "percentage" | "fixed")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Persentase (%)</SelectItem>
                                <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adjustValue">
                            {type === "percentage"
                                ? "Persentase (positif = naik, negatif = turun)"
                                : "Nominal (positif = naik, negatif = turun)"}
                        </Label>
                        <Input
                            id="adjustValue"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={type === "percentage" ? "10" : "5000"}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Alasan Perubahan</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Kenaikan harga supplier..."
                            rows={2}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={isPending || !value}>
                            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Terapkan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
