import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative bg-white overflow-hidden" aria-labelledby="hero-heading">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative pt-4 pb-16 lg:pt-8 lg:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                            Pusat Alat Tulis Palembang
                        </div>

                        <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-heading">
                            Lengkapi Kebutuhan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Kantor & Sekolah</span> Anda dengan Optima.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg">
                            Kualitas Terjamin, Harga Kompetitif, & Pengiriman Cepat di Palembang. Belanja lebih mudah untuk kebutuhan retail maupun instansi.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/catalog"
                                className="inline-flex justify-center items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-800 transition-all hover:scale-105 active:scale-95"
                            >
                                Lihat Katalog
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`} target="_blank" rel="noopener noreferrer"
                                className="inline-flex justify-center items-center gap-2 rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                Konsultasi B2B
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-y-4 gap-x-8 text-sm text-slate-600 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>100% Original</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Harga Grosir</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Pengiriman Cepat</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-8 lg:mt-0 xl:pl-10">
                        <div className="absolute w-full aspect-square rounded-full max-w-md mx-auto lg:max-w-none bg-blue-50/50 -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl lg:w-[600px] lg:h-[600px]"></div>

                        {/* Visual representation placeholder instead of raw image to avoid broken img paths for now */}
                        <div className="relative rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-50 border border-white/50 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                            <div className="text-center p-8 relative z-10 w-full">
                                <div className="grid grid-cols-2 gap-4 auto-rows-fr">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                                            <span className="text-2xl">📚</span>
                                        </div>
                                        <span className="font-semibold text-slate-700">Alat Tulis</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform translate-y-4 hover:translate-y-3 transition-transform">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                                            <span className="text-2xl">🖨️</span>
                                        </div>
                                        <span className="font-semibold text-slate-700">Mesin Kantor</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform -translate-y-4 hover:-translate-y-5 transition-transform">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                                            <span className="text-2xl">🖇️</span>
                                        </div>
                                        <span className="font-semibold text-slate-700">Aksesoris</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                                            <span className="text-2xl">🎒</span>
                                        </div>
                                        <span className="font-semibold text-slate-700">Sekolah</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4 animate-bounce hover:animate-none z-20">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs">A</div>
                                <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs">B</div>
                                <div className="w-10 h-10 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center text-xs">+1K</div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Pelanggan</p>
                                <p className="text-xs text-slate-500">Puas di Palembang</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
