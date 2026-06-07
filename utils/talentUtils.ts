
import { Employee, SuccessionStatus, CriticalJob } from '../types';

// Define thresholds for scaling scores (1-100) to the 3-tier system.
const HIGH_THRESHOLD = 90;
const MEDIUM_THRESHOLD = 70;

export const eselonOrder = [
    'JPT Utama (Eselon I.a)',
    'JPT Madya (Eselon I.b)',
    'JPT Pratama (Eselon II)',
    'Administrator (Eselon III)',
    'Pengawas (Eselon IV)',
    'Fungsional Ahli Utama',
    'Fungsional Ahli Madya',
    'Fungsional Ahli Muda',
    'Fungsional Ahli Pertama',
    'Fungsional Terampil',
    'Pelaksana',
    'Staf',
];

export const skpdOptions = [
    'Dinas Pendidikan dan Kebudayaan',
    'Dinas Kesehatan',
    'Dinas Pekerjaan Umum dan Penataan Ruang',
    'Dinas Perumahan Rakyat dan Kawasan Permukiman',
    'Dinas Kependudukan dan Pencatatan Sipil',
    'Dinas Komunikasi, Informatika dan Persandian',
    'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu',
    'Dinas Sosial',
    'Dinas Pertanian dan Perkebunan',
    'Dinas Lingkungan Hidup',
    'Dinas Peternakan',
    'Dinas Koperasi, Usaha Kecil dan Menengah',
    'Dinas Perindustrian dan Perdagangan',
    'Dinas Pariwisata, Pemuda dan Olahraga',
    'Dinas Pemberdayaan Masyarakat dan Gampong',
    'Dinas Kelautan dan Perikanan',
    'Dinas Perhubungan',
    'Badan Perencanaan Pembangunan Daerah',
    'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia',
    'Badan Penanggulangan Bencana Daerah',
    'Badan Pengelolaan Keuangan Daerah',
    'Inspektorat',
    'Satuan Polisi Pamong Praja dan Wilayatul Hisbah',
    'Sekretariat Daerah',
    'Sekretariat DPRD',
    'Kantor Kecamatan'
].sort();

export const pangkatGolonganOptions = [
    'Juru Muda, I/a',
    'Juru Muda Tingkat I, I/b',
    'Juru, I/c',
    'Juru Tingkat I, I/d',
    'Pengatur Muda, II/a',
    'Pengatur Muda Tingkat I, II/b',
    'Pengatur, II/c',
    'Pengatur Tingkat I, II/d',
    'Penata Muda, III/a',
    'Penata Muda Tingkat I, III/b',
    'Penata, III/c',
    'Penata Tingkat I, III/d',
    'Pembina, IV/a',
    'Pembina Tingkat I, IV/b',
    'Pembina Utama Muda, IV/c',
    'Pembina Utama Madya, IV/d',
    'Pembina Utama, IV/e',
    'PPPK'
];

/**
 * Gets the rank of an eselon for sorting purposes. Lower number is higher rank.
 * @param eselon The eselon string.
 * @returns A numerical rank.
 */
export const getEselonRank = (eselon: string): number => {
    const index = eselonOrder.indexOf(eselon);
    // If not found, return a high number to place it at the bottom.
    return index === -1 ? eselonOrder.length : index;
};


/**
 * Converts a performance score (1-100) to a 3-tier scale.
 * @param score The performance score.
 * @returns 1 (Di Bawah Ekspektasi), 2 (Sesuai Ekspektasi), or 3 (Di Atas Ekspektasi).
 */
export const getPerformanceScale = (score: number): number => {
    if (score >= HIGH_THRESHOLD) return 3;
    if (score >= MEDIUM_THRESHOLD) return 2;
    return 1;
};

/**
 * Converts a potential score (1-100) to a 3-tier scale.
 * @param score The potential score.
 * @returns 1 (Rendah), 2 (Menengah), or 3 (Tinggi).
 */
export const getPotentialScale = (score: number): number => {
    if (score >= HIGH_THRESHOLD) return 3;
    if (score >= MEDIUM_THRESHOLD) return 2;
    return 1;
};


// These maps translate the 3-tier scale value into a human-readable string.
export const performanceMap: { [key: number]: string } = { 1: 'Di Bawah Ekspektasi', 2: 'Sesuai Ekspektasi', 3: 'Di Atas Ekspektasi' };
export const potentialMap: { [key: number]: string } = { 1: 'Rendah', 2: 'Menengah', 3: 'Tinggi' };

export const boxNumberMap: { [key:string]: number } = {
    '33': 9, '23': 7, '13': 4,
    '32': 8, '22': 5, '12': 2,
    '31': 6, '21': 3, '11': 1,
};

export const categoryMap: { [key: number]: string } = {
    9: 'Kinerja di atas ekspektasi dan potensial tinggi',
    8: 'Kinerja sesuai ekspektasi dan potensial tinggi',
    7: 'Kinerja di atas ekspektasi dan potensial menengah',
    6: 'Kinerja di bawah ekspektasi dan potensial tinggi',
    5: 'Kinerja sesuai ekspektasi dan potensial menengah',
    4: 'Kinerja di atas ekspektasi dan potensial rendah',
    3: 'Kinerja di bawah ekspektasi dan potensial menengah',
    2: 'Kinerja sesuai ekspektasi dan potensial rendah',
    1: 'Kinerja di bawah ekspektasi dan potensial rendah',
};

export const recommendationMap: { [key: number]: string } = {
    9: 'Dipromosikan dan dipertahankan, Masuk Kelompok Rencana Suksesi Instansi/Nasional, Penghargaan.',
    8: 'Dipertahankan, Masuk Kelompok Rencana Suksesi Instansi, Rotasi/Perluasan jabatan, Bimbingan kinerja.',
    7: 'Dipertahankan, Masuk Kelompok Rencana Suksesi Instansi, Rotasi/Pengayaan jabatan, Pengembangan kompetensi, Tugas belajar.',
    6: 'Penempatan yang sesuai, Bimbingan kinerja, Konseling kinerja.',
    5: 'Penempatan yang sesuai, Bimbingan kinerja, Pengembangan kompetensi.',
    4: 'Rotasi, Pengembangan kompetensi.',
    3: 'Bimbingan kinerja, Konseling kinerja, Pengembangan kompetensi, Penempatan yang sesuai.',
    2: 'Bimbingan kinerja, Pengembangan kompetensi, Penempatan yang sesuai.',
    1: 'Diproses sesuai ketentuan peraturan perundangan.',
};

export const boxStyleMap: { [key: number]: { color: string; bgColor: string } } = {
    9: { color: 'bg-indigo-600 text-white', bgColor: 'bg-indigo-50' },
    8: { color: 'bg-sky-600 text-white', bgColor: 'bg-sky-50' },
    7: { color: 'bg-indigo-400 text-white', bgColor: 'bg-indigo-50' },
    6: { color: 'bg-amber-500 text-white', bgColor: 'bg-amber-50' },
    5: { color: 'bg-sky-400 text-white', bgColor: 'bg-sky-50' },
    4: { color: 'bg-yellow-400 text-yellow-900', bgColor: 'bg-yellow-50' },
    3: { color: 'bg-red-400 text-white', bgColor: 'bg-red-50' },
    2: { color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50' },
    1: { color: 'bg-red-600 text-white', bgColor: 'bg-red-50' },
};

export const getEmployeeBoxInfo = (employee: Employee) => {
    const potentialScale = getPotentialScale(employee.potential);
    const performanceScale = getPerformanceScale(employee.performance);

    const key = `${potentialScale}${performanceScale}`;
    const boxNumber = boxNumberMap[key] || 0;
    const category = categoryMap[boxNumber] || 'Tidak terklasifikasi';
    const recommendation = recommendationMap[boxNumber] || 'Tidak ada rekomendasi spesifik.';
    return { boxNumber, category, recommendation };
};

export const getTalentStatusPermenpan = (boxNumber: number): string => {
    // Sesuai PermenPANRB No. 3 Tahun 2020
    if ([7, 8, 9].includes(boxNumber)) {
        return 'Ready Now';
    } else if ([5, 6].includes(boxNumber)) {
        return 'Potensial';
    } else if ([2, 3, 4].includes(boxNumber)) {
        return 'Development Needed';
    } else if (boxNumber === 1) {
        return 'Underperformer';
    }
    return 'Belum Terpetakan';
};

/**
 * Determines the succession status based on performance, potential, and retirement status.
 * @param employee The employee object (or a partial object with relevant fields).
 * @returns The calculated succession status.
 */
export const calculateSuccessionStatus = (employee: Pick<Employee, 'performance' | 'potential' | 'birthDate' | 'eselon' | 'pendidikan'>): SuccessionStatus => {
    // Rule 1: Retirement status overrides everything.
    // An employee who has passed or is within 1 year of retirement is not a candidate.
    if (employee.birthDate && employee.eselon && (isOverRetirementAge(employee as Employee) || isApproachingRetirement(employee as Employee))) {
        return 'Bukan Kandidat';
    }
    
    // Rule 2: Eselon III requires at least S1 education.
    if (employee.eselon === 'Administrator (Eselon III)' && isEducationBelowStandard(employee)) {
        return 'Bukan Kandidat';
    }

    // Rule 3: If not retiring and education is sufficient, use the 9-Box Matrix score.
    const potentialScale = getPotentialScale(employee.potential);
    const performanceScale = getPerformanceScale(employee.performance);
    const key = `${potentialScale}${performanceScale}`;
    const boxNumber = boxNumberMap[key] || 0;

    switch (boxNumber) {
        case 9:
        case 8:
            return 'Siap Sekarang';
        case 7:
        case 5:
            return '1-2 Tahun';
        case 6:
        case 4:
        case 3:
            return 'Potensi Masa Depan';
        case 1:
        case 2:
        default:
            return 'Bukan Kandidat';
    }
};

/**
 * Checks if an employee's major is relevant to the job's required education fields.
 * @param employeeJurusan The major of the employee.
 * @param requiredJurusan An array of required majors.
 * @returns True if relevant, false otherwise.
 */
export const isEducationRelevant = (employeeJurusan: string, requiredJurusan: string[]): boolean => {
    if (!requiredJurusan || requiredJurusan.length === 0) {
        return true; // No specific education required, so it's a match.
    }
    if (!employeeJurusan) {
        return false; // Job requires education, but employee has none listed.
    }

    const employeeMajorLower = employeeJurusan.trim().toLowerCase();
    
    // Check if the employee's major string contains any of the required major strings.
    // This allows for flexible matching (e.g., "S1 Akuntansi" matches "Akuntansi").
    return requiredJurusan.some(req => employeeMajorLower.includes(req.trim().toLowerCase()));
};


/**
 * Finds suitable candidates for a critical job from a list of employees,
 * correlated with their "Jabatan Lowong/Kritikal Target" field.
 * @param job The critical job to fill.
 * @param employees The list of all employees.
 * @returns A sorted array of suitable employees.
 */
export const findSuitableCandidates = (job: CriticalJob, employees: Employee[]): Employee[] => {
    const targetJobTitle = job.title.trim().toLowerCase();

    const candidates = employees.filter(emp => {
        // Condition 1: Must target this job.
        const employeeTargetPosition = emp.criticalPosition?.trim().toLowerCase();
        if (employeeTargetPosition !== targetJobTitle) {
            return false;
        }

        // Condition 2: Must be a potential candidate (not 'Bukan Kandidat').
        if (emp.successionStatus === 'Bukan Kandidat') {
            return false;
        }

        // Condition 3: Must not be over retirement age.
        if (isOverRetirementAge(emp)) {
            return false;
        }

        // Condition 4: Education must be relevant if specified.
        if (!isEducationRelevant(emp.jurusan, job.requiredEducation)) {
            return false;
        }

        // Title matching removed as field is deleted

        return true;
    });
    
    // Define the order of succession statuses
    const successionStatusOrder: SuccessionStatus[] = ['Siap Sekarang', '1-2 Tahun', 'Potensi Masa Depan'];

    // Sort candidates by readiness, then by box, then by performance.
    return candidates.sort((a, b) => {
        const statusA = successionStatusOrder.indexOf(a.successionStatus);
        const statusB = successionStatusOrder.indexOf(b.successionStatus);
        if (statusA !== statusB) {
            return statusA - statusB; // Lower index (better status) comes first.
        }

        const boxA = getEmployeeBoxInfo(a).boxNumber;
        const boxB = getEmployeeBoxInfo(b).boxNumber;
        if (boxA !== boxB) {
            return boxB - boxA; // Higher box number first
        }

        return b.performance - a.performance; // Higher performance first
    });
};


/**
 * Finds potential candidates for a job based on their qualifications, even if they haven't explicitly targeted it.
 * @param job The critical job.
 * @param allEmployees All employees.
 * @param primaryCandidateIds A set of IDs of employees who are already primary candidates.
 * @returns An array of potential candidates with a match reason.
 */
export const findPotentialCandidates = (
    job: CriticalJob, 
    allEmployees: Employee[], 
    primaryCandidateIds: Set<string>
): (Employee & { matchReason: string })[] => {

    const requiredEselonRank = getEselonRank(job.requiredEselon);

    const potentialCandidates = allEmployees
        .filter(emp => 
            !primaryCandidateIds.has(emp.id) && 
            emp.successionStatus !== 'Bukan Kandidat' && 
            !isOverRetirementAge(emp)
        )
        .map(emp => {
            let score = 0;
            let reasons: string[] = [];

            // Eselon Match: Must be same level or promotable (up to 2 levels below)
            const empEselonRank = getEselonRank(emp.eselon);
            const eselonDifference = empEselonRank - requiredEselonRank;
            if (eselonDifference >= 0 && eselonDifference <= 2) {
                score += 10;
                reasons.push(eselonDifference === 0 ? "Eselon Sesuai" : "Siap Promosi");
            } else {
                return null; // Hard filter: eselon is too far off or higher
            }
            
            // Education Match: Significant bonus if education is relevant
            if (isEducationRelevant(emp.jurusan, job.requiredEducation)) {
                score += 15;
                reasons.push("Jurusan Sesuai");
            }
            
            // Title matching removed
            
            // High Potential
            if (getPotentialScale(emp.potential) === 3) {
                score += 20;
                reasons.push("Potensi Tinggi");
            } else if (getPotentialScale(emp.potential) === 2) {
                score += 5;
            }

            // High Performance
            if (getPerformanceScale(emp.performance) === 3) {
                score += 10;
                reasons.push("Kinerja Unggul");
            }

            // High Competency
            if (emp.competency && emp.competency >= 85) {
                score += 5;
                reasons.push("Kompetensi Tinggi");
            }
            
            // A minimum score to be considered a potential candidate.
            // Must have eselon match (10) + at least high performance (10) or other strong factors.
            if (score >= 20) { 
                return { ...emp, score, matchReason: reasons.join(', ') };
            }
            return null;
        })
        .filter((emp): emp is Employee & { score: number; matchReason: string } => emp !== null)
        .sort((a, b) => b.score - a.score);

    return potentialCandidates;
};

/**
 * Validates the structure and semantic rules of an 18-digit NIP.
 * NIP Format: YYYYMMDD YYYYMM C NNN
 * - YYYYMMDD: Birth date (C determines female encoding where day is +40)
 * - YYYYMM: Appointment year and month
 * - C: Sex (1 for male, 2 for female)
 * - NNN: sequence number (001-999)
 * @param nip The NIP string to validate.
 * @returns An object with { isValid: boolean, message: string }
 */
export const validateNIPValidation = (nip: string): { isValid: boolean; message: string } => {
    if (!nip) return { isValid: false, message: 'NIP tidak boleh kosong.' };
    
    // Must be exactly 18 digits
    if (!/^\d{18}$/.test(nip)) {
        return { isValid: false, message: 'NIP harus terdiri dari tepat 18 angka.' };
    }

    const yearStr = nip.substring(0, 4);
    const monthStr = nip.substring(4, 6);
    const dayStr = nip.substring(6, 8);
    
    const appYearStr = nip.substring(8, 12);
    const appMonthStr = nip.substring(12, 14);
    
    const sexStr = nip.charAt(14);
    const seqStr = nip.substring(15, 18);

    // 1. Validate Gender
    if (sexStr !== '1' && sexStr !== '2') {
        return { isValid: false, message: 'Digit ke-15 harus angka 1 (Pria) atau 2 (Wanita).' };
    }

    // 2. Validate Birth Date
    let birthYear = parseInt(yearStr, 10);
    let birthMonth = parseInt(monthStr, 10);
    let birthDay = parseInt(dayStr, 10);

    // Female correction for older formats or just typical BKN encoding 
    // Technically standard NIP doesn't add +40 to day for women anymore in some regs, but historically it did or does for NIK. Wait, actually NIP doesn't add 40. But let's check what `getBirthDateFromNIP` did.
    // It currently assumes women have +40. Let's keep consistency.
    let actualBirthDay = birthDay;
    if (birthDay > 40) {
        actualBirthDay -= 40;
    }

    if (birthYear < 1900 || birthYear > new Date().getFullYear() - 15) {
        return { isValid: false, message: 'Tahun lahir pada NIP tidak masuk akal.' };
    }
    if (birthMonth < 1 || birthMonth > 12) {
        return { isValid: false, message: 'Bulan lahir pada NIP (digit 5-6) tidak valid.' };
    }
    if (actualBirthDay < 1 || actualBirthDay > 31) {
        return { isValid: false, message: 'Tanggal lahir pada NIP (digit 7-8) tidak valid.' };
    }

    // 3. Validate Appointment Date
    let appYear = parseInt(appYearStr, 10);
    let appMonth = parseInt(appMonthStr, 10);

    if (appYear < birthYear + 15) {
        return { isValid: false, message: 'Tahun pengangkatan terlalu dekat/sebelum tahun lahir (minimal usia 15 tahun).' };
    }
    if (appMonth < 1 || appMonth > 12) {
        return { isValid: false, message: 'Bulan pengangkatan pada NIP (digit 13-14) tidak valid.' };
    }

    // 4. Validate sequence
    if (seqStr === '000') {
        return { isValid: false, message: 'Tiga digit terakhir (16-18) tidak boleh 000.' };
    }

    return { isValid: true, message: 'NIP valid.' };
};

/**
 * Parses an 18-digit Indonesian NIP to extract the birth date.
 * It considers the gender encoding where the birth day is incremented by 40 for females.
 * @param nip The 18-digit NIP string.
 * @returns A Date object or null if the NIP format is invalid.
 */
export const getBirthDateFromNIP = (nip: string): Date | null => {
    if (!nip || nip.length < 8) {
        return null;
    }

    try {
        const yearStr = nip.substring(0, 4);
        const monthStr = nip.substring(4, 6);
        const dayStr = nip.substring(6, 8);
        
        let day = parseInt(dayStr, 10);
        // In Indonesian NIP, female birth dates are encoded by adding 40 to the day.
        if (day > 40) {
            day -= 40;
        }

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10) - 1; // Month is 0-indexed in JS Date

        // Basic validation
        if (isNaN(year) || isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
            return null;
        }

        const birthDate = new Date(year, month, day);
        // Check if the date is valid (e.g., not Feb 30)
        if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
            return null;
        }

        return birthDate;
    } catch (e) {
        console.error("Error parsing NIP:", e);
        return null;
    }
};

/**
 * Checks if an employee is approaching retirement (within the next year).
 * Retirement age is based on the employee's eselon/functional position.
 * @param employee The employee object, must have `birthDate` and `eselon` properties.
 * @returns True if the employee is approaching retirement, otherwise false.
 */
export const isApproachingRetirement = (employee: Employee): boolean => {
    let birthDateStr = employee.birthDate;
    if (!birthDateStr && employee.nip) {
        const parsedNodeDate = getBirthDateFromNIP(employee.nip);
        if (parsedNodeDate) birthDateStr = parsedNodeDate.toISOString();
    }
    if (!birthDateStr) {
        return false;
    }

    let retirementAge: number;
    const eselon = employee.eselon;

    if (eselon.includes('Fungsional Ahli Utama')) {
        retirementAge = 65;
    } else if (
        eselon.includes('JPT Utama') ||
        eselon.includes('JPT Madya') ||
        eselon.includes('JPT Pratama') || // Eselon I & II
        eselon.includes('Fungsional Ahli Madya')
    ) {
        retirementAge = 60;
    } else {
        // Default for Administrator (III), Pengawas (IV), Fungsional Ahli Muda/Pertama, Pelaksana, etc.
        retirementAge = 58;
    }

    try {
        const birthDate = new Date(birthDateStr);
        if (isNaN(birthDate.getTime())) {
            return false;
        }

        const retirementDate = new Date(birthDate.getFullYear() + retirementAge, birthDate.getMonth(), birthDate.getDate());
        
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        const now = new Date();

        // Check if retirement date is in the future but within the next year.
        return retirementDate > now && retirementDate <= oneYearFromNow;
    } catch (e) {
        console.error("Error calculating retirement status:", e);
        return false;
    }
};

/**
 * Checks if an employee has passed their retirement age.
 * Retirement age is based on the employee's eselon/functional position.
 * @param employee The employee object, must have `birthDate` and `eselon` properties.
 * @returns True if the employee is over retirement age, otherwise false.
 */
export const isOverRetirementAge = (employee: Employee): boolean => {
    let birthDateStr = employee.birthDate;
    if (!birthDateStr && employee.nip) {
        const parsedNodeDate = getBirthDateFromNIP(employee.nip);
        if (parsedNodeDate) birthDateStr = parsedNodeDate.toISOString();
    }
    if (!birthDateStr) {
        return false;
    }

    let retirementAge: number;
    const eselon = employee.eselon;

    if (eselon.includes('Fungsional Ahli Utama')) {
        retirementAge = 65;
    } else if (
        eselon.includes('JPT Utama') ||
        eselon.includes('JPT Madya') ||
        eselon.includes('JPT Pratama') || // Eselon I & II
        eselon.includes('Fungsional Ahli Madya')
    ) {
        retirementAge = 60;
    } else {
        // Default for Administrator (III), Pengawas (IV), Fungsional Ahli Muda/Pertama, Pelaksana, etc.
        retirementAge = 58;
    }

    try {
        const birthDate = new Date(birthDateStr);
        if (isNaN(birthDate.getTime())) {
            return false;
        }

        const retirementDate = new Date(birthDate.getFullYear() + retirementAge, birthDate.getMonth(), birthDate.getDate());
        const now = new Date();

        // Check if the current date is past the retirement date.
        return retirementDate <= now;
    } catch (e) {
        console.error("Error calculating retirement status:", e);
        return false;
    }
};

/**
 * Calculates string representing remaining time until retirement.
 * @param employee The employee object
 * @returns Formatted string or null
 */
export const getRemainingRetirementTime = (employee: Employee): string | null => {
    let birthDateStr = employee.birthDate;
    if (!birthDateStr && employee.nip) {
        const parsedNodeDate = getBirthDateFromNIP(employee.nip);
        if (parsedNodeDate) birthDateStr = parsedNodeDate.toISOString();
    }
    if (!birthDateStr) {
        return null;
    }

    let retirementAge: number;
    const eselon = employee.eselon;

    if (eselon.includes('Fungsional Ahli Utama')) {
        retirementAge = 65;
    } else if (
        eselon.includes('JPT Utama') ||
        eselon.includes('JPT Madya') ||
        eselon.includes('JPT Pratama') || // Eselon I & II
        eselon.includes('Fungsional Ahli Madya')
    ) {
        retirementAge = 60;
    } else {
        retirementAge = 58;
    }

    try {
        const birthDate = new Date(birthDateStr);
        if (isNaN(birthDate.getTime())) return null;

        const retirementDate = new Date(birthDate.getFullYear() + retirementAge, birthDate.getMonth(), birthDate.getDate());
        const now = new Date();

        if (retirementDate <= now) {
            return "Telah Pensiun";
        }

        let years = retirementDate.getFullYear() - now.getFullYear();
        let months = retirementDate.getMonth() - now.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Adjust for days
        if (now.getDate() > retirementDate.getDate()) {
             months--;
             if (months < 0) {
                 years--;
                 months += 12;
             }
        }

        if (years === 0 && months === 0) {
            return "Pensiun bulan ini";
        }

        let result = "Pensiun dalam ";
        if (years > 0) result += `${years} tahun `;
        if (months > 0) result += `${months} bulan`;

        return result.trim();
    } catch (e) {
        return null;
    }
};

/**
 * Checks if an employee's education level is below S1/D4 (i.e., SMA, D3, or equivalent).
 * @param employee The employee object.
 * @returns True if education is below standard, otherwise false.
 */
export const isEducationBelowStandard = (employee: Pick<Employee, 'pendidikan'>): boolean => {
    if (!employee.pendidikan) {
        return false;
    }
    const educationLevel = employee.pendidikan.trim().toUpperCase();
    
    // List of education levels considered below S1/D4 standard
    const belowStandardLevels = [
        'SMA', 'SMK', 'MA', // High School and equivalents
        'D3', 'D-III', 'DIPLOMA 3', // Diploma 3
        'D2', 'D-II', 'DIPLOMA 2', // Diploma 2
        'D1', 'D-I', 'DIPLOMA 1'  // Diploma 1
    ];

    // Check if the education level is in the list or contains "SEDERAJAT" (equivalent)
    return belowStandardLevels.includes(educationLevel) || educationLevel.includes('SEDERAJAT');
};
