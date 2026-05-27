import type { Config } from '@netlify/functions';
import { GoogleGenAI, Type } from '@google/genai';
import {
  getEmployeeBoxInfo,
  getPerformanceScale,
  getPotentialScale,
  categoryMap,
  performanceMap,
  potentialMap,
} from '../../utils/talentUtils';

function createGeminiClient() {
  const apiKey = Netlify.env.get('GEMINI_API_KEY');
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

async function generateContentWithRetry(ai: GoogleGenAI, params: Record<string, unknown>, retries = 3) {
  let lastError: unknown = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: unknown) {
      lastError = err;
      const msg = (err as { message?: string })?.message ?? '';
      if (msg.includes('503') || msg.includes('high demand') || msg.includes('exceeded')) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

function noAiResponse() {
  return Response.json(
    { message: 'Gemini AI client is not available. Check GEMINI_API_KEY.' },
    { status: 500 }
  );
}

export default async (req: Request) => {
  const { pathname } = new URL(req.url);
  const method = req.method;

  if (pathname === '/api/health' && method === 'GET') {
    return Response.json({ status: 'ok' });
  }

  if (method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const ai = createGeminiClient();

  if (pathname === '/api/generate/job-description') {
    if (!ai) return noAiResponse();
    const { title, unitKerja } = await req.json();
    const prompt = `
    Buat deskripsi pekerjaan (Uraian Jabatan) yang profesional dan ringkas untuk jabatan "${title}" di unit kerja (SKPD) "${unitKerja}" di lingkungan Pemerintah Kabupaten Aceh Barat.
    Pertimbangkan signifikansi strategis jabatan ini bagi pencapaian tujuan SKPD dan pemerintah daerah.
    Deskripsi harus dalam Bahasa Indonesia.
    Fokus pada poin-poin berikut:
    1.  **Ikhtisar Jabatan**: Ringkasan singkat tentang peran dan kedudukan jabatan dalam struktur organisasi.
    2.  **Tugas Pokok**: Daftar tugas-tugas utama yang menjadi tanggung jawab jabatan (gunakan daftar berpoin).
    3.  **Kualifikasi Jabatan**: Persyaratan kompetensi, pendidikan, dan pangkat/golongan yang dibutuhkan (gunakan daftar berpoin).

    Pastikan bahasa yang digunakan formal, sesuai untuk analisis jabatan dan tata naskah dinas di lingkungan pemerintahan Indonesia.
    `;
    try {
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: { temperature: 0.5, topP: 0.95 },
      });
      return Response.json({ text: (response as { text?: string }).text });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  if (pathname === '/api/generate/development-plan') {
    if (!ai) return noAiResponse();
    const { employee } = await req.json();
    const { boxNumber, category, recommendation } = getEmployeeBoxInfo(employee);
    const performanceScale = getPerformanceScale(employee.performance);
    const potentialScale = getPotentialScale(employee.potential);
    const prompt = `
    Anda adalah seorang Asesor SDM Aparatur Ahli senior di BKPSDM Kabupaten Aceh Barat, yang bertugas menyusun Rencana Pengembangan Individu (Individual Development Plan - IDP) yang strategis.
    Gunakan "Buku Saku Implementasi Manajemen Talenta ASN (LAN RI & Tanoto Foundation)" sebagai referensi utama untuk memastikan rencana ini sesuai dengan praktik terbaik.

    Data Pegawai:
    - Nama: ${employee.name} - NIP: ${employee.nip} - Jabatan Saat Ini: ${employee.jabatan}
    - Pangkat/Golongan: ${employee.pangkatGolongan} - Pendidikan: ${employee.pendidikan} - ${employee.jurusan}
    - Eselon: ${employee.eselon} - SKPD: ${employee.unitKerja}
    - Kinerja: ${performanceMap[performanceScale]} (Skor: ${employee.performance}/100)
    - Potensi: ${potentialMap[potentialScale]} (Skor: ${employee.potential}/100)
    - Kompetensi: ${employee.competency ?? 'Belum dinilai'}/100 - Keterampilan: ${employee.skills.join(', ') || 'Belum terdata'}
    - Jabatan Lowong/Kritikal Target: ${employee.criticalPosition || 'Belum terdata'}

    Analisis Posisi:
    Pegawai ini berada di **Kotak ${boxNumber} (${category})** pada 9-Box Matrix.
    Rekomendasi umum sesuai Permenpan RB No. 3 Tahun 2020 adalah: **"${recommendation}"**

    Instruksi:
    Buat IDP dalam format HTML yang terstruktur, profesional, dan dapat ditindaklanjuti.
    Gunakan heading (<h3>), list (<ul>, <li>), dan bold (<strong>).
    Rencana harus menerjemahkan rekomendasi umum menjadi aksi-aksi konkret yang terinspirasi dari "Buku Saku", dengan struktur sebagai berikut:

    1.  <strong>Ringkasan Profil & Arah Pengembangan</strong>:
        - Analisis singkat posisi pegawai di Kotak ${boxNumber}. Hubungkan posisinya dengan Jabatan Lowong/Kritikal Target dan potensi kontribusinya bagi organisasi.

    2.  <strong>Fokus Pengembangan (Berdasarkan Kategori Program)</strong>:
        - Berdasarkan rekomendasi untuk Kotak ${boxNumber}, jabarkan rencana aksi dalam 2-3 kategori relevan berikut ini (pilih yang paling sesuai):
        - **a. Pengembangan Kompetensi (Wajib & Non-Wajib)**:
            - Sarankan pelatihan *mandatory* (wajib) yang relevan (contoh: Diklat PIM jika sesuai, Diklat Fungsional).
            - Sarankan pelatihan *non-mandatory* (berdasarkan minat & kebutuhan) seperti seminar, workshop, atau *online course* spesifik yang dapat menutup *gap* kompetensi.
        - **b. Manajemen Karir & Retensi Talenta**:
            - Jika relevan (terutama untuk Kotak 7, 8, 9), usulkan strategi dari buku saku: **Rotasi Jabatan** (jelaskan jenis rotasi yang cocok), **Pengayaan Jabatan (Job Enrichment)** (beri contoh tugas tambahan yang strategis), atau **Perluasan Jabatan (Job Enlargement)**.
            - Untuk talenta potensial, sebutkan kemungkinan diusulkan untuk **Tugas Belajar/Pendidikan Lanjutan**.
        - **c. Pembinaan & Peningkatan Kinerja**:
            - Jika relevan (terutama untuk kotak yang kinerjanya rendah/sesuai), sarankan **Bimbingan Kinerja** atau **Sesi Coaching/Mentoring** terjadwal dengan atasan langsung atau mentor yang ditunjuk. Untuk kinerja rendah, sebutkan perlunya **Konseling Kinerja**.

    3.  <strong>Target & Prioritas Jangka Pendek (6 Bulan)</strong>:
        - Sebutkan 2-3 langkah paling prioritas yang harus segera dieksekusi. Buat target ini SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

    Pastikan outputnya adalah string HTML yang siap pakai. Jangan sertakan \`\`\`html di awal atau akhir. Nada tulisan harus konstruktif dan selaras dengan semangat pengembangan SDM Unggul.
    `;
    try {
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: { temperature: 0.6, topP: 0.95 },
      });
      return Response.json({ text: (response as { text?: string }).text });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  if (pathname === '/api/generate/talent-pool-analysis') {
    if (!ai) return noAiResponse();
    const { employees } = await req.json();
    const boxSummary: Record<number, { count: number; employees: { name: string; jabatan: string }[] }> = {};
    for (let i = 1; i <= 9; i++) { boxSummary[i] = { count: 0, employees: [] }; }
    employees.forEach((e: Record<string, unknown>) => {
      const { boxNumber } = getEmployeeBoxInfo(e as Parameters<typeof getEmployeeBoxInfo>[0]);
      if (boxSummary[boxNumber]) {
        boxSummary[boxNumber].count++;
        boxSummary[boxNumber].employees.push({ name: e.name as string, jabatan: e.jabatan as string });
      }
    });
    const topTalentString = [9, 8, 7].map(boxNum => {
      const data = boxSummary[boxNum];
      if (data.count === 0) return `Kotak ${boxNum}: Tidak ada pegawai.`;
      const names = data.employees.map(e => `${e.name} (${e.jabatan})`).join(', ');
      return `Kotak ${boxNum} (${categoryMap[boxNum]}): ${data.count} pegawai. Mereka adalah: ${names}.`;
    }).join('\n');
    const coreEmployeeString = [5, 4, 2].map(boxNum => {
      const data = boxSummary[boxNum];
      if (data.count === 0) return `Kotak ${boxNum}: Tidak ada pegawai.`;
      return `Kotak ${boxNum} (${categoryMap[boxNum]}): ${data.count} pegawai.`;
    }).join('\n');
    const atRiskEmployeeString = [1, 3, 6].map(boxNum => {
      const data = boxSummary[boxNum];
      if (data.count === 0) return `Kotak ${boxNum}: Tidak ada pegawai.`;
      const names = data.employees.map(e => `${e.name} (${e.jabatan})`).join(', ');
      return `Kotak ${boxNum} (${categoryMap[boxNum]}): ${data.count} pegawai. Mereka adalah: ${names}.`;
    }).join('\n');
    const prompt = `
    Anda adalah Kepala BKPSDM Kabupaten Aceh Barat. Anda diminta untuk menyajikan Laporan Analisis Talent Pool kepada Tim Komite Talenta dan Komite Suksesi.
    Laporan ini harus strategis, tajam, dan berdasarkan "Buku Saku Implementasi Manajemen Talenta ASN", menggunakan data 9-Box Matrix sesuai "Permenpan RB No. 3 Tahun 2020".
    Data Ringkas Pegawai ASN berdasarkan Kotak 9-Box:
    KELOMPOK TALENTA UNGGULAN (CALON KRS):
    ${topTalentString}
    KELOMPOK TULANG PUNGGUNG ORGANISASI:
    ${coreEmployeeString}
    KELOMPOK BERISIKO & BUTUH INTERVENSI:
    ${atRiskEmployeeString}
    Instruksi: Hasilkan laporan dalam format HTML yang rapi untuk dipresentasikan. Jangan sertakan tag \`<html>\`, \`<body>\`, atau \`\`\`html.
    Struktur laporan harus mengikuti kerangka berikut untuk membantu Komite Suksesi dalam mengambil keputusan:
    1.  <h3>Ringkasan Eksekutif: Peta Talent Pool Pemerintah Kabupaten Aceh Barat</h3> - Analisis distribusi talenta pada 9 Kotak. Identifikasi konsentrasi dan kekosongan kritis. Berikan gambaran umum kekuatan dan area risiko.
    2.  <h3>Identifikasi Kelompok Rencana Suksesi (KRS) & Prioritas Manajemen</h3>
        - <strong>Calon Anggota Talent Pool/KRS (Kotak 7, 8, 9)</strong>: Sebutkan nama-nama pegawai dan jelaskan mengapa mereka aset berharga.
        - <strong>Pegawai Tulang Punggung (Kotak 2, 4, 5)</strong>: Analisis peran vital kelompok ini.
        - <strong>Talenta Berisiko & Membutuhkan Intervensi (Kotak 1, 3, 6)</strong>: Identifikasi pegawai di kategori ini dan jelaskan dampaknya.
    3.  <h3>Rekomendasi Strategis untuk Komite Talenta & Suksesi</h3>
        - <strong>Strategi Akselerasi & Retensi (Untuk KRS)</strong>: Sarankan 'Talent Mobility', 'Job Enrichment', dan prioritas beasiswa/tugas belajar.
        - <strong>Strategi Pengembangan Kapasitas (Untuk Pegawai Tulang Punggung)</strong>: Rekomendasikan 'upskilling', 'reskilling', dan 'cross-functional assignment'.
        - <strong>Strategi Intervensi Kinerja</strong>: Usulkan implementasi 'Performance Improvement Plan (PIP)', 'Coaching & Konseling Kinerja', dan evaluasi 'job-fit'.
    Gunakan tag HTML seperti <h3>, <p>, <ul>, <li>, dan <strong>.
    `;
    try {
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: { temperature: 0.7, topP: 0.95 },
      });
      return Response.json({ text: (response as { text?: string }).text });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  if (pathname === '/api/generate/employee-data') {
    if (!ai) return noAiResponse();
    const { jabatan, unitKerja } = await req.json();
    const prompt = `
    Anda adalah Asisten Personalia AI yang sangat kreatif untuk Pemerintah Kabupaten Aceh Barat.
    Tugas Anda adalah membuat data profil untuk seorang Aparatur Sipil Negara (ASN) fiktif yang baru untuk posisi **${jabatan}** di **${unitKerja}**.
    Buat data yang realistis, unik, dan sesuai dengan konteks pemerintahan daerah di Indonesia. Sertakan pendidikan dan jurusan yang sesuai, NIP yang valid, dan eselon yang relevan. Pastikan NIP mengikuti format yang masuk akal (Tahun Lahir, Bulan Lahir, Tanggal Lahir, Tahun Pengangkatan, Bulan Pengangkatan, Jenis Kelamin, Nomor Urut).
    Hasilkan data dalam format JSON sesuai dengan skema yang diberikan.
    `;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Nama lengkap Indonesia yang umum, terdiri dari 2 kata.' },
          nip: { type: Type.STRING, description: 'Nomor Induk Pegawai (NIP) 18 digit yang realistis. Format: YYYYMMDD YYYYMM C NNN. C adalah 1 untuk pria, 2 untuk wanita.' },
          pangkatGolongan: { type: Type.STRING, description: 'Pangkat dan golongan yang sesuai. Contoh: Penata Muda, III/a' },
          pendidikan: { type: Type.STRING, description: 'Tingkat pendidikan terakhir. Contoh: S1.' },
          jurusan: { type: Type.STRING, description: 'Jurusan pendidikan yang relevan.' },
          email: { type: Type.STRING, description: 'Alamat email fiktif. Contoh: nama.singkat@example.com' },
          phone: { type: Type.STRING, description: 'Nomor telepon Indonesia 12-13 digit fiktif, diawali 08.' },
          eselon: { type: Type.STRING, description: "Tingkat eselon jabatan. Contoh: 'Administrator (Eselon III)'." },
          skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 keterampilan relevan.' },
          criticalPosition: { type: Type.STRING, description: 'Jabatan target suksesi yang realistis.' },
        },
        required: ['name', 'nip', 'pangkatGolongan', 'pendidikan', 'jurusan', 'phone', 'eselon', 'skills', 'criticalPosition'],
      };
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.9,
        },
      });
      return Response.json({ text: (response as { text?: string }).text });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  if (pathname === '/api/generate/succession-insight') {
    if (!ai) return noAiResponse();
    const { job, candidates } = await req.json();
    const responseTextPrefix = `<h3>Analisis Strategis Suksesi untuk ${job.title}</h3>`;
    if (candidates.length === 0) {
      const noCandidateHtml = `${responseTextPrefix}<p><strong>Peringatan Kritis:</strong> Saat ini tidak ada kandidat internal yang teridentifikasi untuk mengisi jabatan kritikal ini. Hal ini menciptakan risiko keberlanjutan kepemimpinan yang signifikan pada ${job.unitKerja}.</p><h4>Rekomendasi Aksi Segera:</h4><ul><li><strong>Identifikasi Eksternal:</strong> Segera mulai proses identifikasi kandidat potensial dari luar instansi.</li><li><strong>Review Kriteria:</strong> Lakukan peninjauan ulang terhadap kriteria jabatan dan data talenta di SKPD terkait.</li><li><strong>Pengembangan Jangka Panjang:</strong> Identifikasi pegawai di jenjang di bawahnya yang memiliki potensi tinggi dan masukkan mereka ke dalam program akselerasi pengembangan.</li></ul>`;
      return Response.json({ text: noCandidateHtml });
    }
    const candidateSummary = candidates.map((c: Record<string, unknown>) => {
      const { boxNumber, category } = getEmployeeBoxInfo(c as Parameters<typeof getEmployeeBoxInfo>[0]);
      return `- ${c.name} (Jabatan: ${c.jabatan}, Posisi: Kotak ${boxNumber} - ${category}, Status: ${c.successionStatus})`;
    }).join('\n');
    const prompt = `
    Anda adalah konsultan ahli manajemen suksesi senior. Berikan analisis strategis singkat kepada Komite Talenta.
    Jabatan Kritikal: ${job.title} di ${job.unitKerja}. Deskripsi: ${job.description}. Eselon: ${job.requiredEselon}.
    Daftar Kandidat Internal:
    ${candidateSummary}
    Instruksi: Hasilkan analisis dalam format HTML singkat (<h3>, <p>, <h4>, <ul>, <li>, <strong>). Fokus pada 3 poin:
    1.  <h4>Penilaian Kondisi Pipeline Suksesi:</h4> Berikan penilaian (misal: "Sehat", "Berisiko") dan alasannya berdasarkan distribusi kandidat.
    2.  <h4>Rekomendasi Strategis untuk Kandidat Utama:</h4> Fokus pada 1-2 kandidat teratas (berdasarkan status 'Siap Sekarang' dan Kotak tertinggi). Berikan rekomendasi aksi konkret.
    3.  <h4>Identifikasi Risiko & Rencana Mitigasi:</h4> Sebutkan potensi risiko (misal: "Ketergantungan pada satu kandidat") dan sarankan langkah mitigasi.
    Gunakan bahasa yang tegas dan strategis.
    `;
    try {
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: { temperature: 0.6, topP: 0.95 },
      });
      return Response.json({ text: responseTextPrefix + (response as { text?: string }).text });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  if (pathname === '/api/generate/match-candidates') {
    if (!ai) return noAiResponse();
    const { job, candidates } = await req.json();
    const simplifiedCandidates = candidates.map((c: Record<string, unknown>) => ({
      id: c.id,
      name: c.name,
      jabatan: c.jabatan,
      eselon: c.eselon,
      pendidikan: `${c.pendidikan} ${c.jurusan}`,
      performance: c.performance,
      potential: c.potential,
      competency: c.competency,
      skills: (c.skills as string[]).slice(0, 5),
    }));
    const prompt = `
    Anda adalah Konsultan HR Senior yang ahli dalam Talent Matching & Assessment.
    Tugas Anda adalah melakukan penilaian objektif terhadap daftar kandidat ASN untuk Jabatan Kritikal berikut:

    JABATAN TARGET: ${job.title} (${job.unitKerja})
    DESKRIPSI TUGAS: ${job.description}
    KUALIFIKASI: Eselon ${job.requiredEselon}, Pendidikan: ${(job.requiredEducation as string[]).join(', ')}.

    DAFTAR KANDIDAT:
    ${JSON.stringify(simplifiedCandidates)}

    INSTRUKSI:
    1. Analisis setiap kandidat secara mendalam berdasarkan kesesuaian Eselon (Jabatan saat ini vs Target), Relevansi Pendidikan, Keahlian (Skills), dan Rekam Jejak (Performance/Potential).
    2. Berikan SKOR (0-100):
       - 90-100: Sangat Cocok (Pendidikan relevan, eselon sesuai/promosi ideal, high potential).
       - 75-89: Cocok (Memenuhi sebagian besar syarat, perlu sedikit pengembangan).
       - <75: Kurang Cocok (Gap kompetensi atau eselon terlalu jauh).
    3. Berikan ALASAN SINGKAT (1-2 kalimat) yang tajam. Soroti kekuatan utama (misal: "Strong leadership track record") atau gap utama (misal: "Pendidikan tidak relevan").

    Kembalikan HASIL HANYA dalam format JSON Array sesuai skema.
    `;
    try {
      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
          },
          required: ['id', 'score', 'reason'],
        },
      };
      const response = await generateContentWithRetry(ai, {
        model: 'gemini-2.5-flash-preview-05-20',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.3,
        },
      });
      let textResponse = (response as { text?: string }).text ?? '[]';
      textResponse = textResponse.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
      return Response.json({ matches: JSON.parse(textResponse) });
    } catch (err: unknown) {
      return Response.json({ message: 'Error generating content from Gemini', error: (err as Error).message }, { status: 500 });
    }
  }

  return new Response('Not Found', { status: 404 });
};

export const config: Config = {
  path: '/api/*',
};
