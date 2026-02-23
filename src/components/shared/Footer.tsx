import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <h3 className="font-heading font-bold text-2xl mb-4 text-white">Optima Stationery</h3>
                        <p className="text-blue-100 mb-6 max-w-sm">
                            Solusi alat tulis kantor dan perlengkapan sekolah terbaik di Palembang. Menyediakan produk lengkap, kualitas terjamin, dan harga kompetitif.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-4 text-white">Tautan Cepat</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#beranda" className="text-blue-100 hover:text-white transition-colors block">Beranda</Link>
                            </li>
                            <li>
                                <Link href="#katalog" className="text-blue-100 hover:text-white transition-colors block">Katalog Produk</Link>
                            </li>
                            <li>
                                <Link href="#tentang" className="text-blue-100 hover:text-white transition-colors block">Tentang Kami</Link>
                            </li>
                            <li>
                                <Link href="#kontak" className="text-blue-100 hover:text-white transition-colors block">Hubungi Kami</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-4 text-white">Kontak</h4>
                        <ul className="space-y-3 text-blue-100">
                            <li>📍 Jl. Karya Bersama, Palembang, Sumatera Selatan</li>
                            <li>📱 {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</li>
                            <li>✉️ legiocahayam@gmail.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
                    <p>&copy; {new Date().getFullYear()} Optima Stationery. Hak Cipta Dilindungi.</p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
