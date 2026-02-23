import { PackageSearch, BadgeDollarSign, Building2 } from "lucide-react";

const utilities = [
    {
        title: "Produk Lengkap",
        description: "Dari alat tulis dasar hingga perlengkapan kantor spesifik, semua tersedia di satu tempat.",
        icon: PackageSearch,
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Harga Grosir & Retail",
        description: "Beli eceran atau porsi besar, kami tawarkan harga paling bersaing di Palembang.",
        icon: BadgeDollarSign,
        color: "bg-green-100 text-green-600",
    },
    {
        title: "Layanan B2B Instansi",
        description: "Siap melayani kebutuhan pengadaan untuk sekolah, perusahaan, dan instansi pemerintahan.",
        icon: Building2,
        color: "bg-indigo-100 text-indigo-600",
    }
];

export function UspSection() {
    return (
        <section className="py-24 bg-accent" aria-labelledby="usp-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 id="usp-heading" className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                        Mengapa Memilih Optima Stationery?
                    </h2>
                    <p className="text-lg text-slate-600">
                        Kami berkomitmen memberikan layanan terbaik dengan produk berkualitas untuk mendukung produktivitas Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {utilities.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" aria-hidden="true" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">
                                {feature.title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
