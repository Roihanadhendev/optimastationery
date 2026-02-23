"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/utils";
import { deleteProduct } from "@/app/admin/products/actions";
import {
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    Package,
} from "lucide-react";
import Link from "next/link";

interface ProductRow {
    id: string;
    name: string;
    sku: string;
    price: number;
    stockStatus: boolean;
    imageUrl: string | null;
    isFeatured: boolean;
    category: { id: string; name: string; slug: string } | null;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductTableProps {
    initialProducts: ProductRow[];
    categories: Category[];
    totalPages: number;
    currentPage: number;
    currentSearch: string;
    currentCategory: string;
}

export function ProductTable({
    initialProducts,
    categories,
    totalPages,
    currentPage,
    currentSearch,
    currentCategory,
}: ProductTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(currentSearch);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const updateFilters = (params: Record<string, string>) => {
        const searchParams = new URLSearchParams();
        const newParams = {
            search: search,
            category: currentCategory,
            page: String(currentPage),
            ...params,
        };

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) searchParams.set(key, value);
        });

        startTransition(() => {
            router.push(`/admin/products?${searchParams.toString()}`);
        });
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteProduct(deleteId);
        setDeleteId(null);
        router.refresh();
    };

    const columns: ColumnDef<ProductRow>[] = [
        {
            accessorKey: "imageUrl",
            header: "",
            cell: ({ row }) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {row.original.imageUrl ? (
                        <Image
                            src={row.original.imageUrl}
                            alt={row.original.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <Package className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Produk",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-slate-900">{row.original.name}</p>
                    <p className="text-xs text-slate-500">{row.original.sku}</p>
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.category?.name ?? "-"}</Badge>
            ),
        },
        {
            accessorKey: "price",
            header: "Harga",
            cell: ({ row }) => (
                <span className="font-medium">{formatRupiah(row.original.price)}</span>
            ),
        },
        {
            accessorKey: "stockStatus",
            header: "Stok",
            cell: ({ row }) =>
                row.original.stockStatus ? (
                    <Badge variant="default">Tersedia</Badge>
                ) : (
                    <Badge variant="destructive">Habis</Badge>
                ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${row.original.id}/edit`} aria-label="Edit product">
                            <Pencil className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(row.original.id)}
                        aria-label="Delete product"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: initialProducts,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari nama atau SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") updateFilters({ search, page: "1" });
                            }}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={currentCategory || "all"}
                        onValueChange={(v) =>
                            updateFilters({ category: v === "all" ? "" : v, page: "1" })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk
                    </Link>
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Tidak ada produk ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Halaman {currentPage} dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isPending}
                            onClick={() =>
                                updateFilters({ page: String(currentPage - 1) })
                            }
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages || isPending}
                            onClick={() =>
                                updateFilters({ page: String(currentPage + 1) })
                            }
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Produk</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak
                            dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
