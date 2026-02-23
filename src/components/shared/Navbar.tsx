"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-heading font-bold text-2xl text-primary">Optima Stationery</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 items-center justify-center px-8">
                        <div className="w-full max-w-lg relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                                <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                className="block w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm sm:leading-6 bg-slate-50 transition-all"
                                placeholder="Cari produk..."
                                aria-label="Search Catalog"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/catalog" className="text-sm font-semibold leading-6 text-gray-700 hover:text-primary transition-colors">
                            Katalog
                        </Link>
                        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
                            Hubungi Kami
                        </a>
                    </div>

                    <div className="flex items-center md:hidden gap-4">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle main menu"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Toggle main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md absolute top-16 left-0 w-full shadow-lg z-[-1] animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-4 px-4 py-6 sm:px-6">
                        <div className="relative w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                                <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                className="block w-full rounded-full border border-gray-200 py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50"
                                placeholder="Cari produk..."
                            />
                        </div>

                        <Link
                            href="/catalog"
                            className="block px-3 py-2 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Katalog Produk
                        </Link>
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full rounded-full bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors mt-4"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Hubungi Kami via WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
