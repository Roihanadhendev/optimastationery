import { getDashboardStats } from "./inquiries/actions";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, MessageSquare, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    interface InquiryRow {
        id: string;
        productName: string;
        customerPhone: string | null;
        source: string;
        createdAt: Date;
        product: { name: string; sku: string } | null;
    }

    const recentInquiries: InquiryRow[] = await prisma.inquiry.findMany({
        include: { product: { select: { name: true, sku: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
    }) as InquiryRow[];

    const statCards = [
        {
            label: "Total Produk",
            value: stats.totalProducts,
            icon: Package,
            color: "text-blue-600 bg-blue-100",
        },
        {
            label: "Stok Habis",
            value: stats.outOfStock,
            icon: AlertTriangle,
            color: "text-amber-600 bg-amber-100",
        },
        {
            label: "WA Leads (30 Hari)",
            value: stats.totalLeads,
            icon: MessageSquare,
            color: "text-green-600 bg-green-100",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                    Ringkasan data Optima Stationery.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                                >
                                    <stat.icon className="w-6 h-6" aria-hidden="true" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Inquiries */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Inquiry Terbaru
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentInquiries.length > 0 ? (
                        <div className="space-y-3">
                            {recentInquiries.map((inq) => (
                                <div
                                    key={inq.id}
                                    className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">
                                            {inq.productName}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {inq.product?.sku ?? "—"} •{" "}
                                            {inq.customerPhone ?? "Anonim"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{inq.source}</Badge>
                                        <span className="text-xs text-slate-400">
                                            {new Date(inq.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-8">
                            Belum ada inquiry masuk.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
