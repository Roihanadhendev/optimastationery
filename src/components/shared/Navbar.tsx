import Link from "next/link";
import { Search, Menu } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-secondary/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-heading font-bold text-2xl text-primary">Optima Stationery</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 items-center justify-center px-8">
                        <div className="w-full max-w-lg relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                className="block w-full rounded-full border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-accent"
                                placeholder="Cari produk..."
                                aria-label="Search Catalog"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/catalog" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors">
                            Katalog
                        </Link>
                        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
                            Hubungi Kami
                        </a>
                    </div>

                    <div className="flex items-center md:hidden gap-4">
                        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" aria-label="Open menu">
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
