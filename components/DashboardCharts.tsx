import React from 'react';
import { Employee } from '../types';
import { getEmployeeBoxInfo } from '../utils/talentUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceArea,
  LabelList
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#84cc16'];

interface DashboardChartsProps {
    employees: Employee[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ employees }) => {
    // 1. Golongan stats
    const golonganStats = employees.reduce((acc, emp) => {
        let gol = emp.pangkatGolongan || 'Belum Diketahui';
        if (gol.includes(',')) {
            gol = gol.split(',')[1].trim(); // Extract 'III/a' from 'Penata Muda, III/a'
        }
        acc[gol] = (acc[gol] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const golonganData = Object.entries(golonganStats)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);

    // 2. Jabatan stats (Eselon / Kategori)
    const eselonStats = employees.reduce((acc, emp) => {
        const eselon = (emp.eselon === 'Tidak Ada' || !emp.eselon) ? 'Fungsional/Pelaksana' : emp.eselon;
        acc[eselon] = (acc[eselon] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const eselonData = Object.entries(eselonStats)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);

    // 3. Masa Kerja stats
    const masaKerjaStats = employees.reduce((acc, emp) => {
        let masa = 'Belum Diketahui';
        if (emp.nip && emp.nip.length >= 12) {
            const appYearStr = emp.nip.substring(8, 12);
            const appYear = parseInt(appYearStr, 10);
            if (!isNaN(appYear) && appYear > 1900 && appYear <= new Date().getFullYear()) {
                const mk = new Date().getFullYear() - appYear;
                if (mk < 5) masa = '< 5 Tahun';
                else if (mk <= 10) masa = '5 - 10 Tahun';
                else if (mk <= 20) masa = '11 - 20 Tahun';
                else masa = '> 20 Tahun';
            }
        }
        acc[masa] = (acc[masa] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    // Custom sort Masa Kerja
    const orderMK = ['< 5 Tahun', '5 - 10 Tahun', '11 - 20 Tahun', '> 20 Tahun', 'Belum Diketahui'];
    const masaKerjaData = Object.entries(masaKerjaStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => orderMK.indexOf(a.name) - orderMK.indexOf(b.name));

    // 4. 9-Box Scatter Data
    const quadrantDataMap: Record<number, { performance: number, potential: number, count: number, boxNumber: number }> = {};
    for (let i = 1; i <= 9; i++) {
        let perf = 1, pot = 1;
        if (i===9) { perf=3; pot=3; }
        else if (i===8) { perf=2; pot=3; }
        else if (i===7) { perf=3; pot=2; }
        else if (i===6) { perf=1; pot=3; }
        else if (i===5) { perf=2; pot=2; }
        else if (i===4) { perf=3; pot=1; }
        else if (i===3) { perf=1; pot=2; }
        else if (i===2) { perf=2; pot=1; }
        else if (i===1) { perf=1; pot=1; }
        quadrantDataMap[i] = { performance: perf, potential: pot, count: 0, boxNumber: i };
    }

    employees.forEach(emp => {
        const boxInfo = getEmployeeBoxInfo(emp);
        if (boxInfo.boxNumber >= 1 && boxInfo.boxNumber <= 9) {
            quadrantDataMap[boxInfo.boxNumber].count += 1;
        }
    });

    const quadrantData = Object.values(quadrantDataMap).filter(d => d.count > 0);

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: Record<string, unknown> }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border rounded p-3 shadow-lg z-50">
                    <p className="font-bold text-sm text-gray-800">Box {data.boxNumber}</p>
                    <p className="text-sm text-gray-600 mt-1">Jumlah ASN: <span className="font-bold text-indigo-600">{data.count}</span></p>
                </div>
            );
        }
        return null;
    };

    if (employees.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6 mt-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-6 border-b pb-2">Demografi ASN</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Golongan Chart */}
                    <div className="w-full">
                        <h4 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 text-center">Distribusi Golongan</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={golonganData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => percent > 0.05 ? `${name}` : ''}
                                        outerRadius={90}
                                        innerRadius={50}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {golonganData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} Pegawai`, 'Jumlah']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Eselon Chart */}
                    <div className="w-full">
                        <h4 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 text-center">Tingkat Jabatan (Eselon)</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eselonData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#6b7280'}} />
                                    <Tooltip formatter={(value) => [`${value} Pegawai`, 'Jumlah']} cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Masa Kerja Chart */}
                    <div className="w-full mt-4">
                        <h4 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 text-center">Distribusi Masa Kerja</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={masaKerjaData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} />
                                    <YAxis tick={{fill: '#6b7280', fontSize: 12}} />
                                    <Tooltip formatter={(value) => [`${value} Pegawai`, 'Jumlah']} cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Kuadran Talenta (9-Box Grid) */}
                    <div className="w-full mt-4">
                        <h4 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 text-center">Pemetaan Talenta (9-Box Grid)</h4>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                                    <XAxis type="number" dataKey="performance" name="Kinerja" ticks={[1, 2, 3]} domain={[0.5, 3.5]} tickFormatter={(val) => val === 1 ? 'Kurang' : val === 2 ? 'Sesuai' : 'Lebih'} tick={{fontSize: 12}} />
                                    <YAxis type="number" dataKey="potential" name="Potensial" ticks={[1, 2, 3]} domain={[0.5, 3.5]} tickFormatter={(val) => val === 1 ? 'Rendah' : val === 2 ? 'Menengah' : 'Tinggi'} tick={{fontSize: 12}} />
                                    <ZAxis type="number" dataKey="count" range={[500, 1500]} name="ASN" />
                                    
                                    {/* 9 Box Areas */}
                                    {/* Bottom Row */}
                                    <ReferenceArea x1={0.5} x2={1.5} y1={0.5} y2={1.5} {...({ fill: '#fca5a5', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '1', position: 'insideTopLeft', fill: '#ef4444', fontSize: '10px' }} />
                                    <ReferenceArea x1={1.5} x2={2.5} y1={0.5} y2={1.5} {...({ fill: '#fdba74', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '2', position: 'insideTopLeft', fill: '#f97316', fontSize: '10px' }} />
                                    <ReferenceArea x1={2.5} x2={3.5} y1={0.5} y2={1.5} {...({ fill: '#93c5fd', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '4', position: 'insideTopLeft', fill: '#3b82f6', fontSize: '10px' }} />
                                    
                                    {/* Middle Row */}
                                    <ReferenceArea x1={0.5} x2={1.5} y1={1.5} y2={2.5} {...({ fill: '#fdba74', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '3', position: 'insideTopLeft', fill: '#f97316', fontSize: '10px' }} />
                                    <ReferenceArea x1={1.5} x2={2.5} y1={1.5} y2={2.5} {...({ fill: '#93c5fd', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '5', position: 'insideTopLeft', fill: '#3b82f6', fontSize: '10px' }} />
                                    <ReferenceArea x1={2.5} x2={3.5} y1={1.5} y2={2.5} {...({ fill: '#86efac', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '7', position: 'insideTopLeft', fill: '#22c55e', fontSize: '10px' }} />
                                    
                                    {/* Top Row */}
                                    <ReferenceArea x1={0.5} x2={1.5} y1={2.5} y2={3.5} {...({ fill: '#fde047', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '6', position: 'insideTopLeft', fill: '#eab308', fontSize: '10px' }} />
                                    <ReferenceArea x1={1.5} x2={2.5} y1={2.5} y2={3.5} {...({ fill: '#86efac', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '8', position: 'insideTopLeft', fill: '#22c55e', fontSize: '10px' }} />
                                    <ReferenceArea x1={2.5} x2={3.5} y1={2.5} y2={3.5} {...({ fill: '#4ade80', fillOpacity: 0.7, stroke: '#fff', strokeWidth: 1 } as any)} label={{ value: '9', position: 'insideTopLeft', fill: '#16a34a', fontSize: '10px' }} />

                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                    <Scatter name="Kandidat" data={quadrantData}>
                                        {quadrantData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#1f2937" />
                                        ))}
                                        {/* Tampilkan count di tengah dot */}
                                        <LabelList dataKey="count" position="center" fill="#ffffff" fontWeight="bold" fontSize={12} />
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
