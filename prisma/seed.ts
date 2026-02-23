// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // ── Categories ──
    console.log("🌱 Seeding categories...");

    const categories = [
        { name: "Alat Tulis", slug: "alat-tulis" },
        { name: "Mesin Kantor", slug: "mesin-kantor" },
        { name: "Aksesoris", slug: "aksesoris" },
        { name: "Sekolah", slug: "sekolah" },
        { name: "Kertas & Percetakan", slug: "kertas-percetakan" },
        { name: "Perlengkapan Kantor", slug: "perlengkapan-kantor" },
    ];

    const categoryMap: Record<string, string> = {};

    for (const cat of categories) {
        const result = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categoryMap[cat.slug] = result.id;
    }

    console.log(`✅ ${categories.length} categories seeded!`);

    // ── Products ──
    console.log("🌱 Seeding products...");

    const products = [
        // Alat Tulis
        { name: "Pulpen Pilot G-2 0.5mm Hitam", sku: "PLT-G2-BK-05", slug: "pulpen-pilot-g2-hitam", price: 18500, category: "alat-tulis", description: "Pulpen gel premium Pilot G-2 dengan ujung 0.5mm. Tinta hitam pekat, nyaman digenggam." },
        { name: "Pulpen Pilot G-2 0.5mm Biru", sku: "PLT-G2-BL-05", slug: "pulpen-pilot-g2-biru", price: 18500, category: "alat-tulis", description: "Pulpen gel Pilot G-2 ujung 0.5mm warna biru. Ideal untuk menulis sehari-hari." },
        { name: "Pensil Mekanik Faber-Castell 0.5mm", sku: "FC-MP-05", slug: "pensil-mekanik-faber-castell", price: 25000, category: "alat-tulis", description: "Pensil mekanik Faber-Castell dengan grip karet anti-slip, cocok untuk menggambar teknis." },
        { name: "Spidol Snowman Boardmarker Hitam", sku: "SNW-BM-BK", slug: "spidol-snowman-boardmarker", price: 12000, category: "alat-tulis", description: "Spidol whiteboard Snowman warna hitam. Mudah dihapus dan tahan lama." },
        { name: "Stabilo Boss Highlighter Kuning", sku: "STB-HL-YL", slug: "stabilo-boss-kuning", price: 15000, category: "alat-tulis", description: "Highlighter Stabilo Boss Original warna kuning neon. Ujung chisel 2-5mm." },
        { name: "Penghapus Staedtler Mars Plastic", sku: "STD-ERS-MP", slug: "penghapus-staedtler-mars", price: 8500, category: "alat-tulis", description: "Penghapus premium bebas PVC, bersih tanpa meninggalkan residu." },

        // Mesin Kantor
        { name: "Kalkulator Casio MX-12B", sku: "CSO-MX12B", slug: "kalkulator-casio-mx12b", price: 125000, category: "mesin-kantor", description: "Kalkulator 12 digit dengan layar besar. Dilengkapi fungsi GT dan tax calculation." },
        { name: "Laminator Joyko LM-01", sku: "JYK-LM01", slug: "laminator-joyko-lm01", price: 350000, category: "mesin-kantor", description: "Mesin laminator A4 untuk melindungi dokumen penting. Pemanasan cepat 3 menit." },
        { name: "Paper Shredder Gemet 500C", sku: "GMT-500C", slug: "paper-shredder-gemet-500c", price: 1250000, category: "mesin-kantor", description: "Mesin penghancur kertas cross-cut, kapasitas 5 lembar, keamanan level P-3." },

        // Aksesoris
        { name: "Stapler Kangaro HP-45", sku: "KGR-HP45", slug: "stapler-kangaro-hp45", price: 35000, category: "aksesoris", description: "Stapler heavy-duty kapasitas 30 lembar. Kokoh dan tahan lama untuk penggunaan kantor." },
        { name: "Gunting Kenko SC-848", sku: "KNK-SC848", slug: "gunting-kenko-sc848", price: 22000, category: "aksesoris", description: "Gunting stainless steel 8 inch dengan handle ergonomis." },
        { name: "Tape Dispenser Joyko TD-103", sku: "JYK-TD103", slug: "tape-dispenser-joyko-td103", price: 28000, category: "aksesoris", description: "Dispenser selotip meja dengan pemotong tajam built-in." },
        { name: "Binder Clip 32mm (1 Dozen)", sku: "GN-BC32-DZ", slug: "binder-clip-32mm", price: 15000, category: "aksesoris", description: "Klip binder 32mm isi 12 pcs. Kuat menjepit hingga 120 lembar." },

        // Sekolah
        { name: "Buku Tulis Campus 58 Lembar", sku: "CMP-BT58", slug: "buku-tulis-campus-58", price: 5500, category: "sekolah", description: "Buku tulis Campus ukuran A5, 58 lembar bergaris. Kertas putih berkualitas." },
        { name: "Crayon Titi 24 Warna", sku: "TITI-CR24", slug: "crayon-titi-24-warna", price: 32000, category: "sekolah", description: "Set krayon oil pastel 24 warna cerah. Aman dan tidak beracun untuk anak-anak." },
        { name: "Penggaris Butterfly 30cm", sku: "BTF-RLR30", slug: "penggaris-butterfly-30cm", price: 5000, category: "sekolah", description: "Penggaris plastik transparan 30cm dengan skala milimeter yang jelas." },
        { name: "Tas Pensil Kenko PC-01", sku: "KNK-PC01", slug: "tas-pensil-kenko-pc01", price: 18000, category: "sekolah", description: "Tas pensil dengan resleting ganda, bahan canvas tahan lama." },

        // Kertas & Percetakan
        { name: "Kertas HVS A4 80gsm (1 Rim)", sku: "HVS-A4-80-RM", slug: "kertas-hvs-a4-80gsm", price: 52000, category: "kertas-percetakan", description: "Kertas HVS A4 80gsm isi 500 lembar. Putih cerah, cocok untuk fotokopi dan print." },
        { name: "Kertas HVS F4 70gsm (1 Rim)", sku: "HVS-F4-70-RM", slug: "kertas-hvs-f4-70gsm", price: 48000, category: "kertas-percetakan", description: "Kertas HVS ukuran F4/Folio 70gsm isi 500 lembar." },
        { name: "Kertas Foto Glossy A4 230gsm (20 Lbr)", sku: "FT-A4-230-20", slug: "kertas-foto-glossy-a4", price: 35000, category: "kertas-percetakan", description: "Kertas foto glossy A4 230gsm untuk hasil cetak foto berkualitas tinggi." },

        // Perlengkapan Kantor
        { name: "Map Ordner Bantex A4", sku: "BTX-ORD-A4", slug: "map-ordner-bantex-a4", price: 42000, category: "perlengkapan-kantor", description: "Map ordner Bantex ukuran A4 dengan ring 2 lubang. Bahan karton tebal berlapis PVC." },
        { name: "Amplop Putih Polos (50 Lbr)", sku: "AMP-PTH-50", slug: "amplop-putih-polos-50", price: 18000, category: "perlengkapan-kantor", description: "Amplop putih ukuran standar 110x230mm, isi 50 lembar." },
        { name: "Sticky Notes 3x3 Kuning (100 Lbr)", sku: "STK-3X3-YL", slug: "sticky-notes-3x3-kuning", price: 8500, category: "perlengkapan-kantor", description: "Sticky notes kuning 76x76mm isi 100 lembar. Lem re-stickable." },
        { name: "Whiteboard Sakana 60x90cm", sku: "SKN-WB-6090", slug: "whiteboard-sakana-60x90", price: 185000, category: "perlengkapan-kantor", description: "Whiteboard magnetic ukuran 60x90cm dengan frame aluminium. Termasuk dudukan spidol." },
    ];

    for (const prod of products) {
        const catId = categoryMap[prod.category];
        if (!catId) continue;

        await prisma.product.upsert({
            where: { sku: prod.sku },
            update: {},
            create: {
                name: prod.name,
                sku: prod.sku,
                slug: prod.slug,
                price: prod.price,
                description: prod.description,
                categoryId: catId,
                stockStatus: true,
                isFeatured: false,
            },
        });
    }

    // Mark some as featured
    const featuredSkus = ["PLT-G2-BK-05", "CSO-MX12B", "HVS-A4-80-RM", "SKN-WB-6090"];
    await prisma.product.updateMany({
        where: { sku: { in: featuredSkus } },
        data: { isFeatured: true },
    });

    // Mark one as out of stock
    await prisma.product.update({
        where: { sku: "GMT-500C" },
        data: { stockStatus: false },
    });

    console.log(`✅ ${products.length} products seeded!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
