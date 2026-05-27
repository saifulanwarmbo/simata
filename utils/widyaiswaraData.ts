
import { Employee, CompetencyStandard } from '../types';

export const widyaiswaraStandards: CompetencyStandard[] = [
    {
        level: 'Ahli Pertama',
        manajerial: [
            { name: "Integritas", level: 2, description: "Mampu mengingatkan, mengajak rekan kerja untuk bertindak sesuai nilai, norma, dan etika organisasi.", indicators: ["Mengingatkan rekan kerja", "Menerapkan norma secara konsisten", "Memberikan informasi yang dapat dipercaya"] },
            { name: "Kerja Sama", level: 2, description: "Menumbuhkan tim kerja yang partisipatif dan efektif.", indicators: ["Membantu orang lain", "Berbagi informasi", "Membangun komitmen tim"] },
            { name: "Komunikasi", level: 2, description: "Aktif menjalankan komunikasi secara formal dan informal.", indicators: ["Menggunakan komunikasi informal", "Mendengarkan aktif", "Membuat materi presentasi"] },
            { name: "Orientasi pada hasil", level: 2, description: "Berupaya meningkatkan hasil kerja pribadi yang lebih tinggi dari standar.", indicators: ["Menetapkan standar kerja pribadi", "Mencari metode kerja alternatif", "Memberi contoh"] },
            { name: "Pelayanan Publik", level: 2, description: "Mampu menyupervisi/mengawasi/menyelia dan menjelaskan proses pelaksanaan tugas.", indicators: ["Menunjukkan sikap yakin", "Mencari informasi kebutuhan", "Memanfaatkan kebiasaan/tata cara"] },
            { name: "Pengembangan diri dan orang lain", level: 2, description: "Meningkatkan kemampuan bawahan dengan memberikan contoh dan penjelasan.", indicators: ["Memberikan contoh & instruksi", "Membantu bawahan belajar", "Menggunakan metode lain untuk meyakinkan"] },
            { name: "Mengelola Perubahan", level: 2, description: "Proaktif beradaptasi mengikuti perubahan.", indicators: ["Menyesuaikan cara kerja", "Mengembangkan kemampuan diri", "Cepat tanggap"] },
            { name: "Pengambilan Keputusan", level: 2, description: "Menganalisis masalah secara mendalam.", indicators: ["Melakukan analisis mendalam", "Mempertimbangkan alternatif", "Membuat keputusan operasional"] },
        ],
        sosialKultural: [
            { name: "Perekat Bangsa", level: 2, description: "Aktif mengembangkan sikap saling menghargai, menekankan persamaan dan persatuan.", indicators: ["Menampilkan sikap peduli keberagaman", "Membangun hubungan baik", "Bersikap tenang & mengendalikan emosi"] },
        ],
        teknis: [
            { name: "Pengembangan Kurikulum Pelatihan", level: 2, description: "Mampu menerapkan pengetahuan dalam proses pengembangan kurikulum pelatihan ASN dengan bantuan supervisi.", indicators: ["Mengidentifikasi & mengolah data", "Menggunakan petunjuk teknis", "Mengatasi permasalahan dasar"] },
            { name: "Penyusunan Rancang Bangun Program Pelatihan", level: 2, description: "Mampu menyusun dan menerapkan rancang bangun program pelatihan.", indicators: ["Mengidentifikasi & mengolah data", "Melaksanakan tugas kompleks", "Menyusun draf"] },
            { name: "Pengelolaan Pembelajaran Pelatihan", level: 2, description: "Mampu melaksanakan pengelolaan pembelajaran pelatihan ASN.", indicators: ["Mengidentifikasi & mengolah data", "Melaksanakan tugas teknis", "Menggunakan petunjuk teknis"] },
            { name: "Penjaminan Mutu Pelatihan", level: 2, description: "Mampu menyiapkan penjaminan mutu pelatihan ASN.", indicators: ["Mengidentifikasi & mengolah data", "Menggunakan petunjuk teknis", "Melaksanakan tugas kompleks"] },
            { name: "Evaluasi Pelatihan", level: 2, description: "Mampu melakukan evaluasi pelatihan ASN.", indicators: ["Mengidentifikasi & mengolah data", "Menggunakan petunjuk teknis", "Mengatasi permasalahan dasar"] },
        ]
    },
    {
        level: 'Ahli Muda',
        manajerial: [
            { name: "Integritas", level: 3, description: "Mampu memastikan, menanamkan keyakinan bersama agar anggota yang dipimpin bertindak sesuai nilai, norma, dan etika organisasi.", indicators: ["Memastikan anggota bertindak sesuai nilai", "Memberi apresiasi dan teguran", "Melakukan monitoring dan evaluasi"] },
            { name: "Kerja Sama", level: 3, description: "Efektif membangun tim kerja untuk peningkatan kinerja organisasi.", indicators: ["Melihat kekuatan/kelemahan tim", "Mengupayakan keputusan berdasarkan usulan tim", "Membangun aliansi"] },
            { name: "Komunikasi", level: 3, description: "Berkomunikasi secara asertif, terampil berkomunikasi lisan/tertulis untuk menyampaikan informasi yang sensitif/rumit/kompleks.", indicators: ["Menyampaikan informasi sensitif", "Menyederhanakan topik rumit", "Membuat laporan/proposal kompleks"] },
            { name: "Orientasi pada hasil", level: 3, description: "Menetapkan target kerja yang menantang bagi unit kerja, memberi apresiasi dan teguran untuk mendorong kinerja.", indicators: ["Menetapkan target kinerja unit", "Memberi apresiasi dan teguran", "Mengembangkan metode kerja efektif"] },
            { name: "Pelayanan Publik", level: 3, description: "Mampu memanfaatkan kekuatan kelompok serta memperbaiki standar pelayanan publik di lingkup unit kerja.", indicators: ["Memahami pengaruh kelompok", "Menggunakan keterampilan lintas organisasi", "Mengimplementasikan cara efektif memantau"] },
            { name: "Pengembangan diri dan orang lain", level: 3, description: "Memberikan umpan balik dan membimbing.", indicators: ["Memberikan tugas menantang", "Mengamati dan memberi umpan balik", "Mendorong kepercayaan diri bawahan"] },
            { name: "Mengelola Perubahan", level: 3, description: "Membantu orang lain mengikuti perubahan, mengantisipasi perubahan secara tepat.", indicators: ["Membantu orang lain berubah", "Menyesuaikan prioritas kerja", "Mengantisipasi perubahan"] },
            { name: "Pengambilan Keputusan", level: 3, description: "Membandingkan berbagai alternatif, menyeimbangkan risiko keberhasilan dalam implementasi.", indicators: ["Membandingkan alternatif", "Memilih alternatif solusi terbaik", "Menyeimbangkan risiko"] },
        ],
        sosialKultural: [
            { name: "Perekat Bangsa", level: 3, description: "Mempromosikan, mengembangkan sikap toleransi dan persatuan.", indicators: ["Mempromosikan sikap menghargai perbedaan", "Melakukan pemetaan sosial", "Mengidentifikasi potensi kesalahpahaman"] },
        ],
        teknis: [
             { name: "Pengembangan Kurikulum Pelatihan", level: 3, description: "Mampu menganalisis pelaksanaan pengembangan kurikulum pelatihan ASN.", indicators: ["Memverifikasi draf dokumen", "Menggunakan hasil analisis", "Memberikan ulasan hasil"] },
            { name: "Penyusunan Rancang Bangun Program Pelatihan", level: 3, description: "Mampu menganalisis pelaksanaan penyusunan dan penerapan rancang bangun program pelatihan.", indicators: ["Menganalisis data/informasi", "Menggunakan hasil analisis", "Memberikan ulasan penyusunan"] },
            { name: "Pengelolaan Pembelajaran Pelatihan", level: 3, description: "Mampu menganalisis pelaksanaan pengelolaan pembelajaran pelatihan ASN.", indicators: ["Menganalisis data/informasi", "Menggunakan hasil analisis", "Memberikan ulasan hasil pelaksanaan"] },
            { name: "Penjaminan Mutu Pelatihan", level: 3, description: "Mampu menganalisis pelaksanaan penjaminan mutu lembaga pelatihan ASN.", indicators: ["Menganalisis data/informasi", "Menggunakan hasil analisis", "Memberikan ulasan terkait pelaksanaan"] },
            { name: "Evaluasi Pelatihan", level: 3, description: "Mampu menganalisis pelaksanaan evaluasi pelatihan ASN.", indicators: ["Menganalisis data/informasi proses dan hasil", "Menggunakan hasil analisis", "Memberikan ulasan kinerja bawahan"] },
        ]
    },
    {
        level: 'Ahli Madya',
        manajerial: [
            { name: "Integritas", level: 4, description: "Menciptakan situasi kerja yang mendorong kepatuhan pada nilai, norma, dan etika organisasi.", indicators: ["Menciptakan situasi kerja yang patuh nilai", "Menerapkan prinsip moral tinggi", "Berani melakukan koreksi"] },
            { name: "Kerja Sama", level: 4, description: "Membangun komitmen tim, sinergi.", indicators: ["Membangun sinergi antar unit", "Memfasilitasi kepentingan berbeda", "Mengembangkan sistem penghargaan kerja sama"] },
            { name: "Komunikasi", level: 4, description: "Mampu mengemukakan pemikiran multidimensi secara lisan dan tertulis untuk mendorong kesepakatan.", indicators: ["Mengintegrasikan informasi", "Menuangkan pemikiran multidimensi", "Menyampaikan informasi persuasif"] },
            { name: "Orientasi pada hasil", level: 4, description: "Mendorong unit kerja mencapai target yang ditetapkan atau melebihi hasil kerja sebelumnya.", indicators: ["Mendorong unit kerja melebihi target", "Memantau dan mengevaluasi hasil kerja", "Mendorong pemanfaatan sumber daya"] },
            { name: "Pelayanan Publik", level: 4, description: "Memonitor, mengevaluasi, memperhitungkan dan mengantisipasi dampak dari isu-isu jangka panjang.", indicators: ["Memahami isu jangka panjang", "Menjaga kebijakan pelayanan publik", "Menerapkan strategi jangka panjang"] },
            { name: "Pengembangan diri dan orang lain", level: 4, description: "Menyusun program pengembangan jangka panjang dalam rangka mendorong manajemen pembelajaran.", indicators: ["Menyusun program pengembangan jangka panjang", "Melaksanakan manajemen pembelajaran", "Mengembangkan orang secara konsisten"] },
            { name: "Mengelola Perubahan", level: 4, description: "Memimpin perubahan pada unit kerja.", indicators: ["Mengarahkan unit kerja untuk siap berubah", "Memastikan perubahan diterapkan", "Memimpin dan memastikan penerapan program"] },
            { name: "Pengambilan Keputusan", level: 4, description: "Menyelesaikan masalah yang mengandung risiko tinggi, mengantisipasi dampak keputusan.", indicators: ["Menyusun konsep penyelesaian masalah", "Menghasilkan solusi kompleks", "Membuat keputusan & mitigasi risiko"] },
        ],
        sosialKultural: [
            { name: "Perekat Bangsa", level: 4, description: "Mendayagunakan perbedaan secara konstruktif dan kreatif untuk meningkatkan efektivitas organisasi.", indicators: ["Menginisiasi dan merepresentasikan pemerintah", "Mendayagunakan perbedaan", "Membuat program akomodatif"] },
        ],
        teknis: [
            { name: "Pengembangan Kurikulum Pelatihan", level: 4, description: "Mampu meningkatkan efisiensi dan/atau efektivitas pengembangan kurikulum pelatihan ASN.", indicators: ["Mengevaluasi konsep dan praktik", "Memperbaiki atau mengembangkan metode", "Menjadi rujukan kapasitas praktik"] },
            { name: "Penyusunan Rancang Bangun Program Pelatihan", level: 4, description: "Mampu meningkatkan efisiensi dan/atau efektivitas penyusunan dan penerapan rancang bangun program pelatihan.", indicators: ["Mengevaluasi konsep dan praktik", "Memperbaiki atau mengembangkan metode", "Menjadi rujukan kapasitas praktik"] },
            { name: "Pengelolaan Pembelajaran Pelatihan", level: 4, description: "Mampu meningkatkan efisiensi dan/atau efektivitas pengelolaan pembelajaran pelatihan ASN.", indicators: ["Mengevaluasi konsep dan praktik", "Memperbaiki atau mengembangkan metode", "Menjadi rujukan kapasitas praktik"] },
            { name: "Penjaminan Mutu Pelatihan", level: 4, description: "Mampu meningkatkan efisiensi dan/atau efektivitas penyiapan penjaminan mutu pelatihan ASN.", indicators: ["Mengevaluasi konsep dan praktik", "Memperbaiki atau mengembangkan metode", "Menjadi rujukan kapasitas praktik"] },
            { name: "Evaluasi Pelatihan", level: 4, description: "Mampu meningkatkan efisiensi dan/atau efektivitas pelaksanaan evaluasi pelatihan ASN.", indicators: ["Mengevaluasi konsep dan praktik", "Memperbaiki atau mengembangkan metode", "Menjadi rujukan kapasitas praktik"] },
        ]
    },
    {
        level: 'Ahli Utama',
        manajerial: [
            { name: "Integritas", level: 5, description: "Mampu menjadi role model dalam penerapan standar keadilan dan etika di tingkat nasional.", indicators: ["Mempertahankan standar keadilan dan etika", "Menjadi 'role model'", "Membuat konsep kebijakan"] },
            { name: "Kerja Sama", level: 4, description: "Membangun komitmen tim, sinergi.", indicators: ["Membangun sinergi antar unit", "Memfasilitasi kepentingan berbeda", "Mengembangkan sistem penghargaan kerja sama"] },
            { name: "Komunikasi", level: 4, description: "Mampu mengemukakan pemikiran multidimensi secara lisan dan tertulis untuk mendorong kesepakatan.", indicators: ["Mengintegrasikan informasi", "Menuangkan pemikiran multidimensi", "Menyampaikan informasi persuasif"] },
            { name: "Orientasi pada hasil", level: 4, description: "Mendorong unit kerja mencapai target yang ditetapkan atau melebihi hasil kerja sebelumnya.", indicators: ["Mendorong unit kerja melebihi target", "Memantau dan mengevaluasi hasil kerja", "Mendorong pemanfaatan sumber daya"] },
            { name: "Pelayanan Publik", level: 4, description: "Memonitor, mengevaluasi, memperhitungkan dan mengantisipasi dampak dari isu-isu jangka panjang.", indicators: ["Memahami isu jangka panjang", "Menjaga kebijakan pelayanan publik", "Menerapkan strategi jangka panjang"] },
            { name: "Pengembangan diri dan orang lain", level: 4, description: "Menyusun program pengembangan jangka panjang dalam rangka mendorong manajemen pembelajaran.", indicators: ["Menyusun program pengembangan jangka panjang", "Melaksanakan manajemen pembelajaran", "Mengembangkan orang secara konsisten"] },
            { name: "Mengelola Perubahan", level: 4, description: "Memimpin perubahan pada unit kerja.", indicators: ["Mengarahkan unit kerja untuk siap berubah", "Memastikan perubahan diterapkan", "Memimpin dan memastikan penerapan program"] },
            { name: "Pengambilan Keputusan", level: 4, description: "Menyelesaikan masalah yang mengandung risiko tinggi, mengantisipasi dampak keputusan.", indicators: ["Menyusun konsep penyelesaian masalah", "Menghasilkan solusi kompleks", "Membuat keputusan & mitigasi risiko"] },
        ],
        sosialKultural: [
            { name: "Perekat Bangsa", level: 5, description: "Wakil pemerintah untuk membangun hubungan sosial psikologis.", indicators: ["Membangun hubungan sosial psikologis", "Mengkomunikasikan dampak risiko", "Membuat kebijakan akomodatif"] },
        ],
        teknis: [
            { name: "Pengembangan Kurikulum Pelatihan", level: 5, description: "Mampu mengembangkan konsep dan teknik baru dalam penyusunan, penerapan, evaluasi kurikulum pelatihan ASN.", indicators: ["Membangun dan mengembangkan kebijakan", "Melakukan kolaborasi strategis", "Menjadi rujukan kapasitas"] },
            { name: "Penyusunan Rancang Bangun Program Pelatihan", level: 5, description: "Mampu menyusun konsep dan teknik baru dalam pengembangan rancang bangun program pelatihan.", indicators: ["Membangun dan mengembangkan kebijakan", "Melakukan kolaborasi strategis", "Menjadi rujukan kapasitas"] },
            { name: "Pengelolaan Pembelajaran Pelatihan", level: 5, description: "Mampu mengembangkan konsep dan teknik baru dalam pengelolaan pembelajaran pelatihan ASN.", indicators: ["Membangun dan mengembangkan kebijakan", "Melakukan kolaborasi strategis", "Menjadi rujukan kapasitas"] },
            { name: "Penjaminan Mutu Pelatihan", level: 5, description: "Mampu mengembangkan, konsep, proses dan teknik baru dalam penjaminan mutu lembaga pelatihan ASN.", indicators: ["Membangun dan mengembangkan kebijakan", "Melakukan kolaborasi strategis", "Menjadi rujukan kapasitas"] },
            { name: "Evaluasi Pelatihan", level: 5, description: "Mampu mengembangkan konsep dan teknik baru dalam evaluasi pelatihan ASN.", indicators: ["Membangun dan mengembangkan kebijakan", "Melakukan kolaborasi strategis", "Menjadi rujukan kapasitas"] },
        ]
    }
];


export const initialWidyaiswaraEmployees: Employee[] = [
  {
    id: "197805152005011001",
    nip: "197805152005011001",
    name: "Dr. Budi Santoso, M.Pd.",
    jabatan: "Widyaiswara Ahli Utama",
    jenjang: "Ahli Utama",
    pangkatGolongan: "Pembina Utama Madya, IV/d",
    pendidikan: "S3",
    jurusan: "Manajemen Pendidikan",
    unitKerja: "BPSDM Aceh Barat",
    email: "budi.santoso@acehbaratkab.go.id",
    phone: "081234567890",
    trainingAttended: "Pelatihan Kepemimpinan Nasional Tk. I",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    eselon: "Fungsional Ahli Utama",
    performance: 98,
    potential: 95,
    competency: 96,
    skills: ["Analisis Kebijakan Pendidikan", "Manajemen Strategis", "Pengembangan Organisasi", "Evaluasi Program Pelatihan", "Public Speaking"],
    criticalPosition: "Kepala BPSDM Provinsi",
    developmentPlan: "Menjadi mentor bagi Widyaiswara jenjang di bawahnya dan memimpin tim perumus kebijakan pelatihan tingkat regional.",
    successionStatus: "Siap Sekarang",
    birthDate: "1978-05-15T00:00:00.000Z",
    educationHistory: [
      { id: "edu1-1", jenjang: "S1", jurusan: "Administrasi Pendidikan", institusi: "Universitas Negeri Medan", tahunLulus: "2000" },
      { id: "edu1-2", jenjang: "S2", jurusan: "Teknologi Pendidikan", institusi: "Universitas Pendidikan Indonesia", tahunLulus: "2004" },
      { id: "edu1-3", jenjang: "S3", jurusan: "Manajemen Pendidikan", institusi: "Universitas Gadjah Mada", tahunLulus: "2010" }
    ],
    careerHistory: [
        {id: "car1-1", jabatan: "Widyaiswara Ahli Muda", unitKerja: "BPSDM Aceh Barat", tmt: "2005-01-15"},
        {id: "car1-2", jabatan: "Widyaiswara Ahli Madya", unitKerja: "BPSDM Aceh Barat", tmt: "2012-04-01"},
        {id: "car1-3", jabatan: "Widyaiswara Ahli Utama", unitKerja: "BPSDM Aceh Barat", tmt: "2019-06-01"},
    ],
    performanceHistory: [ {id: "perf1-1", tahun: "2023", skp: "98.5", predikat: "Sangat Baik"}],
    developmentHistory: [ {id: "dev1-1", namaPelatihan: "TOT Kepemimpinan", penyelenggara: "Lembaga Administrasi Negara", tahun: "2022", jenis: "Klasikal"}],
    submissionType: "Admin",
    status: "Disetujui"
  },
  {
    id: "198511202010012002",
    nip: "198511202010012002",
    name: "Dr. Ratna Sari Dewi, M.Si.",
    jabatan: "Widyaiswara Ahli Madya",
    jenjang: "Ahli Madya",
    pangkatGolongan: "Pembina, IV/a",
    pendidikan: "S3",
    jurusan: "Ilmu Administrasi Publik",
    unitKerja: "BPSDM Aceh Barat",
    email: "ratna.sari@acehbaratkab.go.id",
    phone: "081298765432",
    trainingAttended: "Pelatihan Kepemimpinan Administrator",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    eselon: "Fungsional Ahli Madya",
    performance: 92,
    potential: 94,
    competency: 90,
    skills: ["Penyusunan Kurikulum", "Rancang Bangun Program Pelatihan", "Metodologi Penelitian", "Analisis Kebutuhan Diklat"],
    criticalPosition: "Widyaiswara Ahli Utama",
    developmentPlan: "Mengambil sertifikasi asesor kompetensi dan memimpin proyek evaluasi efektivitas pelatihan.",
    successionStatus: "1-2 Tahun",
     birthDate: "1985-11-20T00:00:00.000Z",
    educationHistory: [
      { id: "edu2-1", jenjang: "S1", jurusan: "Ilmu Pemerintahan", institusi: "Universitas Padjadjaran", tahunLulus: "2007" },
      { id: "edu2-2", jenjang: "S2", jurusan: "Administrasi Publik", institusi: "Universitas Indonesia", tahunLulus: "2011" },
       { id: "edu2-3", jenjang: "S3", jurusan: "Ilmu Administrasi Publik", institusi: "Universitas Indonesia", tahunLulus: "2018" }
    ],
    careerHistory: [
        {id: "car2-1", jabatan: "Widyaiswara Ahli Pertama", unitKerja: "BPSDM Aceh Barat", tmt: "2010-01-20"},
        {id: "car2-2", jabatan: "Widyaiswara Ahli Muda", unitKerja: "BPSDM Aceh Barat", tmt: "2015-05-01"},
        {id: "car2-3", jabatan: "Widyaiswara Ahli Madya", unitKerja: "BPSDM Aceh Barat", tmt: "2021-07-01"},
    ],
    performanceHistory: [ {id: "perf2-1", tahun: "2023", skp: "93.0", predikat: "Sangat Baik"}],
    developmentHistory: [ {id: "dev2-1", namaPelatihan: "Pelatihan Asesor Kompetensi", penyelenggara: "BNSP", tahun: "2022", jenis: "Klasikal"}],
    submissionType: "Admin",
    status: "Disetujui"
  },
  {
    id: "199002102014031003",
    nip: "199002102014031003",
    name: "Irfan Hakim, S.Kom., M.T.I.",
    jabatan: "Widyaiswara Ahli Muda",
    jenjang: "Ahli Muda",
    pangkatGolongan: "Penata Tk. I, III/d",
    pendidikan: "S2",
    jurusan: "Teknologi Informasi",
    unitKerja: "BPSDM Aceh Barat",
    email: "irfan.hakim@acehbaratkab.go.id",
    phone: "081312345678",
    trainingAttended: "Pelatihan Digital Leadership",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    eselon: "Fungsional Ahli Muda",
    performance: 88,
    potential: 91,
    competency: 85,
    skills: ["Pengembangan Media Pembelajaran", "E-Learning", "Literasi Digital", "Manajemen Proyek TI", "Coaching & Mentoring"],
    criticalPosition: "Widyaiswara Ahli Madya",
    developmentPlan: "Mengikuti pelatihan penjaminan mutu dan memimpin tim pengembangan platform LMS.",
    successionStatus: "1-2 Tahun",
    birthDate: "1990-02-10T00:00:00.000Z",
     educationHistory: [
      { id: "edu3-1", jenjang: "S1", jurusan: "Ilmu Komputer", institusi: "Institut Teknologi Sepuluh Nopember", tahunLulus: "2012" },
      { id: "edu3-2", jenjang: "S2", jurusan: "Teknologi Informasi", institusi: "Universitas Indonesia", tahunLulus: "2016" }
    ],
    careerHistory: [
        {id: "car3-1", jabatan: "Widyaiswara Ahli Pertama", unitKerja: "BPSDM Aceh Barat", tmt: "2014-03-10"},
        {id: "car3-2", jabatan: "Widyaiswara Ahli Muda", unitKerja: "BPSDM Aceh Barat", tmt: "2019-04-01"},
    ],
     performanceHistory: [ {id: "perf3-1", tahun: "2023", skp: "89.5", predikat: "Baik"}],
    developmentHistory: [ {id: "dev3-1", namaPelatihan: "Pelatihan Coaching dan Mentoring", penyelenggara: "Lembaga Administrasi Negara", tahun: "2023", jenis: "Klasikal"}],
    submissionType: "Admin",
    status: "Disetujui"
  },
  {
    id: "199208302019032004",
    nip: "199208302019032004",
    name: "Siti Nurhaliza, S.Psi.",
    jabatan: "Widyaiswara Ahli Pertama",
    jenjang: "Ahli Pertama",
    pangkatGolongan: "Penata Muda, III/a",
    pendidikan: "S1",
    jurusan: "Psikologi",
    unitKerja: "BPSDM Aceh Barat",
    email: "siti.nurhaliza@acehbaratkab.go.id",
    phone: "081511223344",
    trainingAttended: "Pelatihan Dasar CPNS",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    eselon: "Fungsional Ahli Pertama",
    performance: 85,
    potential: 88,
    competency: 80,
    skills: ["Komunikasi Efektif", "Pengelolaan Pembelajaran", "Ice Breaking & Energizer", "Team Building"],
    criticalPosition: "Widyaiswara Ahli Muda",
    developmentPlan: "Mengikuti pelatihan metodologi penelitian dan perancangan program pelatihan.",
    successionStatus: "Potensi Masa Depan",
    birthDate: "1992-08-30T00:00:00.000Z",
    educationHistory: [
      { id: "edu4-1", jenjang: "S1", jurusan: "Psikologi", institusi: "Universitas Airlangga", tahunLulus: "2015" }
    ],
     careerHistory: [
        {id: "car4-1", jabatan: "Calon Widyaiswara", unitKerja: "BPSDM Aceh Barat", tmt: "2019-03-01"},
        {id: "car4-2", jabatan: "Widyaiswara Ahli Pertama", unitKerja: "BPSDM Aceh Barat", tmt: "2020-04-01"},
    ],
    performanceHistory: [ {id: "perf4-1", tahun: "2023", skp: "86.0", predikat: "Baik"}],
    developmentHistory: [ {id: "dev4-1", namaPelatihan: "Pelatihan Dasar CPNS", penyelenggara: "BPSDM Aceh Barat", tahun: "2019", jenis: "Klasikal"}],
    submissionType: "Admin",
    status: "Disetujui"
  }
];
