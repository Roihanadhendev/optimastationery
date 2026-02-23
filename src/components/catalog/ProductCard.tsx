import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Package, Star } from "lucide-react";
import { generateWhatsAppLink, formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const whatsappLink = generateWhatsAppLink(product.name, product.sku);

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image */}
            <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWETFjFRUv/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRm knyJckliyjqTzSlT54teleVq5t9do//Z"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-slate-300" />
                    </div>
                )}

                {/* Featured Badge */}
                {product.isFeatured && (
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        Unggulan
                    </div>
                )}

                {/* Stock Badge */}
                {!product.stockStatus && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        Habis
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                {product.category && (
                    <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">
                        {product.category.name}
                    </span>
                )}

                <h3 className="font-heading font-semibold text-slate-900 text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="font-heading font-bold text-lg text-primary">
                            {formatRupiah(product.price)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                            SKU: {product.sku}
                        </p>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm shadow-green-500/20"
                        title="Tanya Stok via WhatsApp"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tanya</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
