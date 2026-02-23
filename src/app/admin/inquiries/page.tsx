import { getInquiries } from "./actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface InquiryRow {
    id: string;
    productName: string;
    customerPhone: string | null;
    source: string;
    createdAt: Date;
    product: { id: string; name: string; sku: string } | null;
}

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function InquiriesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const { inquiries, totalPages } = await getInquiries({ page }) as { inquiries: InquiryRow[]; totalPages: number };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">
                    Inquiry / Lead
                </h1>
                <p className="text-slate-500 mt-1">
                    Semua pertanyaan yang masuk lewat tombol WhatsApp.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead>No. HP</TableHead>
                            <TableHead>Sumber</TableHead>
                            <TableHead>Tanggal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.length > 0 ? (
                            inquiries.map((inq) => (
                                <TableRow key={inq.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {inq.productName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {inq.product?.sku ?? "—"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {inq.customerPhone ?? "Anonim"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{inq.source}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {new Date(inq.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Belum ada inquiry.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <p className="text-sm text-slate-500 text-center">
                    Halaman {page} dari {totalPages}
                </p>
            )}
        </div>
    );
}
