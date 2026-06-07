import fetch from 'node-fetch';

(async () => {
    const res = await fetch('http://localhost:3000/api/generate/deep-succession-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            employees: [
                { unitKerja: 'Dinas Kominfo', jabatan: 'Kabid', eselon: 'III.b', successionStatus: 'Siap Sekarang', name: 'Budi' }
            ],
            jobs: [
                { title: 'Kadis', unitKerja: 'Dinas Kominfo', requiredEselon: 'II.b', vacancies: 1 }
            ]
        })
    });
    const text = await res.text();
    console.log("RESPONSE:", text);
})();
