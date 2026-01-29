
import React, { useState, useEffect, useMemo } from 'react';
import { Section, Student, AppConfig, AllMarks } from './types';
import { INITIAL_CONFIG, SUBJECT_LIST, CLASS_LIST, ADMIN_PASSWORD, BLOOD_GROUPS } from './constants';

// --- Helper Components ---

const Header = ({ config, session }: { config: AppConfig, session: string }) => (
  <header className="bg-white border-t-[6px] border-[#003366] py-6 px-4 shadow-md relative no-print">
    <div className="absolute top-2 left-4 bg-[#003366] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">স্থাপিত: ১৯২৭ ইং</div>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <img src={config.logo} className="h-24 md:h-32 drop-shadow-lg" alt="Logo" />
      <div className="text-center md:text-left flex-1">
        <h1 className="text-2xl md:text-4xl font-black text-slate-800 mb-1">নড়িয়াল দারুল হাদীস ইসলামিয়া মাদ্রাসা</h1>
        <p className="text-[#003366] font-bold text-lg">সেশন: {session}</p>
        <p className="text-slate-500 text-sm italic font-semibold">নড়িয়াল, তানোর, রাজশাহী।</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-3 bg-slate-50 p-2 pr-6 border border-slate-200 rounded-full shadow-sm">
          <img src={config.headImg} className="w-12 h-12 rounded-full border-2 border-[#003366] object-cover" alt="Principal" />
          <div className="text-left leading-tight">
            <div className="text-[10px] text-slate-500 font-bold uppercase">প্রধান শিক্ষক</div>
            <div className="text-sm font-bold text-[#003366]">{config.headName}</div>
            <div className="text-xs text-slate-600">{config.headNum}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Nav = ({ current, onNav }: { current: Section, onNav: (s: Section) => void }) => {
  const links = [
    { id: Section.Home, label: 'মূল পাতা', icon: 'fa-home' },
    { id: Section.Admission, label: 'অনলাইন ভর্তি', icon: 'fa-user-plus' },
    { id: Section.ManualEntry, label: 'ভর্তি এন্ট্রি', icon: 'fa-file-signature' },
    { id: Section.IDCard, label: 'আইডি কার্ড', icon: 'fa-id-badge' },
    { id: Section.Tracking, label: 'আবেদনের অবস্থা', icon: 'fa-search' },
    { id: Section.AdmitCard, label: 'প্রবেশপত্র', icon: 'fa-id-card' },
    { id: Section.Result, label: 'ফলাফল', icon: 'fa-file-invoice' },
    { id: Section.Admin, label: 'এডমিন', icon: 'fa-lock' },
  ];

  return (
    <nav className="bg-[#003366] sticky top-0 z-50 shadow-lg no-print overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="max-w-6xl mx-auto flex justify-center">
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => onNav(l.id)}
            className={`px-4 py-4 text-sm font-bold transition-all border-r border-white/10 flex items-center gap-2
              ${current === l.id ? 'bg-[#fbc02d] text-[#003366]' : 'text-white hover:bg-[#fbc02d]/20'}`}
          >
            <i className={`fas ${l.icon}`}></i> {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [section, setSection] = useState<Section>(Section.Home);
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [marks, setMarks] = useState<AllMarks>({});
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isManualAuth, setIsManualAuth] = useState(false);

  useEffect(() => {
    const savedStudents = localStorage.getItem('mad_students');
    const savedConfig = localStorage.getItem('mad_config');
    const savedMarks = localStorage.getItem('mad_marks');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedMarks) setMarks(JSON.parse(savedMarks));
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('mad_students', JSON.stringify(newStudents));
  };

  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('mad_config', JSON.stringify(newConfig));
  };

  const saveAllMarks = (newMarks: AllMarks) => {
    setMarks(newMarks);
    localStorage.setItem('mad_marks', JSON.stringify(newMarks));
  };

  const sessionStr = useMemo(() => {
    const year = new Date().getFullYear();
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }, []);

  const handleAdmissionSubmit = (data: Partial<Student>) => {
    const newRoll = students.length > 0 ? Math.max(...students.map(s => s.roll)) + 1 : 10001;
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      roll: newRoll,
      status: 'Pending',
      session: sessionStr,
      date: new Date().toLocaleDateString('bn-BD'),
      ...data as Student
    };
    saveStudents([...students, newStudent]);
    return newRoll;
  };

  const deleteStudent = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?")) {
        const next = students.filter(s => s.id !== id);
        saveStudents(next);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} session={sessionStr} />
      <Nav current={section} onNav={setSection} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {section === Section.Home && <HomeSection notice={config.notice} />}
        {section === Section.Admission && <AdmissionSection onComplete={handleAdmissionSubmit} session={sessionStr} logo={config.logo} />}
        {section === Section.ManualEntry && (
          <ManualEntrySection 
            isAuth={isManualAuth} 
            onAuth={() => setIsManualAuth(true)}
            onSave={(stu) => {
                const existingIndex = students.findIndex(s => s.roll === stu.roll);
                if (existingIndex > -1) {
                    const next = [...students];
                    next[existingIndex] = { ...next[existingIndex], ...stu };
                    saveStudents(next);
                } else {
                    saveStudents([...students, { ...stu, id: Math.random().toString(36).substr(2, 9), status: 'Verified', session: sessionStr, date: new Date().toLocaleDateString('bn-BD') }]);
                }
            }}
            students={students}
            session={sessionStr}
          />
        )}
        {section === Section.IDCard && <IDCardSection students={students} logo={config.logo} />}
        {section === Section.Tracking && <TrackingSection students={students} />}
        {section === Section.AdmitCard && <AdmitCardSection students={students} logo={config.logo} />}
        {section === Section.Result && <ResultSection students={students} marks={marks} logo={config.logo} />}
        {section === Section.Admin && (
          <AdminSection 
            isLoggedIn={isAdminLoggedIn} 
            onLogin={() => setIsAdminLoggedIn(true)}
            onLogout={() => setIsAdminLoggedIn(false)}
            config={config}
            onUpdateConfig={saveConfig}
            students={students}
            onVerify={(id) => saveStudents(students.map(s => s.id === id ? {...s, status: 'Verified'} : s))}
            onDelete={deleteStudent}
            marks={marks}
            onSaveMarks={saveAllMarks}
          />
        )}
      </main>

      <footer className="bg-slate-800 text-white text-center py-6 no-print text-sm">
        <p>© ১৯২৭ - ২০২৫ নড়িয়াল দারুল হাদীস ইসলামিয়া মাদ্রাসা | সর্বস্বত্ব সংরক্ষিত</p>
        <p className="mt-2 text-slate-400">Professional Education Management System - Rajshahi</p>
      </footer>
    </div>
  );
};

// --- Section Components ---

const HomeSection = ({ notice }: { notice: string }) => (
  <div className="space-y-8 animate-fadeIn">
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-4">
      <span className="bg-red-600 text-white px-3 py-1 rounded font-bold animate-pulse text-xs shrink-0 uppercase tracking-tighter">নোটিশ:</span>
      <marquee className="text-slate-700 font-bold">{notice}</marquee>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#003366] text-white px-6 py-3 font-bold flex items-center gap-2">
                <i className="fas fa-info-circle"></i> আমাদের পরিচিতি
            </div>
            <div className="p-6 md:p-8 text-justify leading-relaxed text-slate-600 space-y-4">
                <p>শিক্ষা মানব সমাজের সবচেয়ে মূল্যবান সম্পদ। নড়িয়াল দারুল হাদীস ইসলামিয়া মাদ্রাসা ১৯২৭ সালে প্রতিষ্ঠিত হয়ে দীর্ঘ দিন যাবৎ ইসলামের শুদ্ধ আকীদা ও আদর্শ প্রচার করে আসছে। আমরা শিক্ষার্থীদের আধুনিক ও দ্বীনি শিক্ষার সমন্বয়ে আদর্শ মানুষ হিসেবে গড়ে তুলতে অঙ্গীকারবদ্ধ।</p>
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                    <span className="text-slate-400 text-sm italic font-bold">নড়িয়াল, তানোর, রাজশাহী।</span>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
            <div className="bg-[#fbc02d] text-[#003366] px-6 py-3 font-bold flex items-center gap-2">
                <i className="fas fa-calendar-alt"></i> ইভেন্ট ক্যালেন্ডার
            </div>
            <div className="p-4 divide-y">
                {[
                    {date: '১৫ মার্চ', event: 'রমজান মাস শুরু'},
                    {date: '২০ মে', event: 'অর্ধবার্ষিক পরীক্ষা শুরু'},
                    {date: '২৫ জুন', event: 'ফলাফল প্রকাশ'}
                ].map((e, idx) => (
                    <div key={idx} className="py-3 flex gap-4 items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-[#003366] uppercase">{e.date.split(' ')[1]}</span>
                            <span className="text-sm font-black">{e.date.split(' ')[0]}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">{e.event}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  </div>
);

const AdmissionSection = ({ onComplete, session, logo }: { onComplete: (s: Partial<Student>) => number, session: string, logo: string }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Student>>({ class: '', branch: 'বালক শাখা' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [successRoll, setSuccessRoll] = useState<number | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData(prev => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.nameBN || !formData.nameEN || !formData.class || !formData.photo || !formData.reg || !formData.fName || !formData.mName) {
        alert("সবগুলো তারকা চিহ্নিত (*) তথ্য প্রদান করুন!");
        return;
      }
    }
    setStep(step + 1);
  };

  const submit = () => {
    if (!formData.payMethod || !formData.trx) {
      alert("পেমেন্ট তথ্য সঠিক ভাবে দিন!");
      return;
    }
    const roll = onComplete(formData);
    setSuccessRoll(roll);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="no-print bg-white p-6 md:p-8 rounded-xl shadow-md border border-slate-200 mb-8">
        <div className="flex justify-between mb-8 overflow-hidden rounded-full bg-slate-100 border p-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex-1 text-center py-2 text-sm font-bold rounded-full transition-all
              ${step === i ? 'bg-[#003366] text-white shadow-md' : step > i ? 'text-green-600' : 'text-slate-400'}`}>
              {i === 1 ? '১. শিক্ষার্থীর তথ্য' : i === 2 ? '২. পেমেন্ট' : '৩. আবেদনপত্র'}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <section>
              <h3 className="text-[#003366] font-bold border-b pb-2 mb-4 flex items-center gap-2"><i className="fas fa-user"></i> ব্যক্তিগত তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="নাম (বাংলা) *" onChange={v => setFormData({...formData, nameBN: v})} />
                <InputField label="Name (English) *" onChange={v => setFormData({...formData, nameEN: v})} />
                <InputField label="জন্ম নিবন্ধন নং *" type="number" onChange={v => setFormData({...formData, reg: v})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">রক্তের গ্রুপ</label>
                  <select className="w-full border p-2 rounded outline-[#003366]" onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">নির্বাচন করুন</option>
                    {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">শ্রেণি নির্বাচন *</label>
                  <select className="w-full border p-2 rounded outline-[#003366]" onChange={e => setFormData({...formData, class: e.target.value})}>
                    <option value="">নির্বাচন করুন</option>
                    {CLASS_LIST.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">শাখা</label>
                    <select className="w-full border p-2 rounded outline-[#003366]" onChange={e => setFormData({...formData, branch: e.target.value})}>
                        <option>বালক শাখা</option>
                        <option>বালিকা শাখা</option>
                    </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[#003366] font-bold border-b pb-2 mb-4 flex items-center gap-2"><i className="fas fa-users"></i> অভিভাবকের তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="পিতার নাম *" onChange={v => setFormData({...formData, fName: v})} />
                <InputField label="পিতার পেশা" onChange={v => setFormData({...formData, fOcc: v})} />
                <InputField label="পিতার মোবাইল নং *" type="number" onChange={v => setFormData({...formData, fPhone: v})} />
                <InputField label="মাতার নাম *" onChange={v => setFormData({...formData, mName: v})} />
                <InputField label="মাতার পেশা" onChange={v => setFormData({...formData, mOcc: v})} />
              </div>
            </section>

            <section>
              <h3 className="text-[#003366] font-bold border-b pb-2 mb-4 flex items-center gap-2"><i className="fas fa-map-marker-alt"></i> বর্তমান ঠিকানা</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField label="গ্রাম" onChange={v => setFormData({...formData, village: v})} />
                <InputField label="ডাকঘর" onChange={v => setFormData({...formData, postOffice: v})} />
                <InputField label="উপজেলা" onChange={v => setFormData({...formData, upazila: v})} />
                <InputField label="জেলা" onChange={v => setFormData({...formData, district: v})} />
              </div>
            </section>

            <section>
              <h3 className="text-[#003366] font-bold border-b pb-2 mb-4 flex items-center gap-2"><i className="fas fa-camera"></i> শিক্ষার্থীর ছবি</h3>
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-lg border-2 border-dashed">
                <div className="w-32 h-40 bg-white border flex items-center justify-center overflow-hidden">
                   {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <i className="fas fa-user-circle text-4xl text-slate-200"></i>}
                </div>
                <div className="space-y-2">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
                  <p className="text-xs text-slate-500">৩০০x৩০০ পিক্সেল এবং ১০০কিবির নিচে হওয়া বাঞ্ছনীয়</p>
                </div>
              </div>
            </section>

            <button onClick={nextStep} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all text-lg">আবেদন ফি পরিশোধের ধাপে যান</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-center animate-fadeIn max-w-lg mx-auto py-8">
            <div className="bg-gradient-to-br from-[#003366] to-[#004c99] p-8 rounded-2xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-2">ভর্তি আবেদন ফি: ৩০০.০০ টাকা</h3>
              <p className="text-sm opacity-80 mb-6">নিচের মার্চেন্ট নাম্বারে পেমেন্ট করে ট্রানজেকশন আইডি নিশ্চিত করুন।</p>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                 <p className="text-xs uppercase font-bold tracking-widest opacity-60">বিকাশ/নগদ (পার্সোনাল)</p>
                 <div className="text-2xl font-mono font-bold mt-1 tracking-wider">01340-666396</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                  <select className="flex-1 border p-4 rounded-xl outline-[#003366] font-bold" onChange={e => setFormData({...formData, payMethod: e.target.value})}>
                    <option value="">পেমেন্ট মেথড</option>
                    <option>বিকাশ</option>
                    <option>নগদ</option>
                    <option>রকেট</option>
                  </select>
                  <input type="text" placeholder="Transaction ID (TrxID)" className="flex-1 border p-4 rounded-xl outline-[#003366] uppercase font-mono font-bold" 
                    onChange={e => setFormData({...formData, trx: e.target.value})} />
              </div>
              <button onClick={submit} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all text-lg">আবেদন সম্পন্ন করুন</button>
            </div>
          </div>
        )}
      </div>

      {(step === 3 || successRoll) && (
        <div className="animate-fadeIn">
          <div className="no-print bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center mb-8">
             <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl mb-4 shadow-lg"><i className="fas fa-check"></i></div>
             <h2 className="text-2xl font-black text-slate-800">আবেদন সফলভাবে গৃহীত হয়েছে!</h2>
             <p className="text-slate-600 mt-2">আপনার রোল নম্বর: <span className="font-black text-[#003366]">{successRoll}</span></p>
             <button onClick={() => window.print()} className="mt-6 bg-[#003366] text-white px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">আবেদন ফরম প্রিন্ট করুন</button>
          </div>
          
          <div className="print-only bg-white p-12 border-[12px] border-double border-[#003366] min-h-[1050px]">
            <div className="flex items-center justify-between border-b-4 border-[#003366] pb-6 mb-8">
              <img src={logo} className="h-32" />
              <div className="text-right">
                <h1 className="text-3xl font-black text-slate-800">নড়িয়াল দারুল হাদীস ইসলামিয়া মাদ্রাসা</h1>
                <p className="text-lg font-bold text-[#003366]">ভর্তি আবেদন ফরম - সেশন {session}</p>
                <p className="text-sm font-semibold italic">নড়িয়াল, তানোর, রাজশাহী। | মোবাইল: 01340-666396</p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <p className="text-xl font-bold">আবেদন আইডি: <span className="font-mono">{successRoll}</span></p>
                    <p className="text-slate-500">তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
                    <div className="mt-4 bg-[#003366] text-white inline-block px-4 py-1 rounded text-sm font-bold uppercase">শাখা: {formData.branch}</div>
                </div>
                <div className="w-32 h-40 border-4 border-[#003366] rounded overflow-hidden shadow-md">
                    <img src={formData.photo} className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <table className="w-full border-collapse border border-slate-300">
                    <tbody>
                        <TableRow label="শিক্ষার্থীর নাম (বাংলা)" value={formData.nameBN} />
                        <TableRow label="Student Name (English)" value={formData.nameEN?.toUpperCase()} />
                        <TableRow label="জন্ম নিবন্ধন নং" value={formData.reg} />
                        <TableRow label="রক্তের গ্রুপ" value={formData.bloodGroup} />
                        <TableRow label="শ্রেণি" value={formData.class} />
                        <TableRow label="পিতার নাম" value={formData.fName} />
                        <TableRow label="পিতার পেশা" value={formData.fOcc} />
                        <TableRow label="মাতার নাম" value={formData.mName} />
                        <TableRow label="অভিভাবকের মোবাইল" value={formData.fPhone} />
                        <TableRow label="ঠিকানা" value={`${formData.village}, ${formData.postOffice}, ${formData.upazila}, ${formData.district}`} />
                    </tbody>
                </table>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                    <h4 className="font-bold border-b mb-2 pb-1 text-[#003366]">পেমেন্ট তথ্য (অফিস কপি)</h4>
                    <p className="text-sm">মেথড: {formData.payMethod} | ট্রানজেকশন আইডি: <span className="font-mono font-bold uppercase">{formData.trx}</span></p>
                    <p className="text-xs text-slate-500 mt-1 italic">নোট: এই ফরমটি সংগ্রহ করুন এবং ভর্তির সময় অফিস কক্ষে জমা দিন।</p>
                </div>
            </div>

            <div className="mt-24 flex justify-between items-end">
                <div className="text-center w-48 border-t-2 border-slate-400 pt-1 text-sm font-bold">অভিভাবকের স্বাক্ষর</div>
                <div className="text-center w-48 border-t-2 border-slate-400 pt-1 text-sm font-bold">অফিস সহকারী</div>
                <div className="text-center w-48 border-t-2 border-slate-400 pt-1 text-sm font-bold">অধ্যক্ষের স্বাক্ষর</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, onChange, type = "text" }: { label: string, onChange: (v: string) => void, type?: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
    <input type={type} className="w-full border p-2 rounded outline-[#003366] focus:ring-2 ring-[#003366]/20 transition-all" onChange={e => onChange(e.target.value)} />
  </div>
);

const TableRow = ({ label, value }: { label: string, value: any }) => (
  <tr>
    <td className="border border-slate-300 p-2 bg-slate-50 font-bold text-sm w-1/3">{label}</td>
    <td className="border border-slate-300 p-2 text-sm">{value || '---'}</td>
  </tr>
);

const ManualEntrySection = ({ isAuth, onAuth, onSave, students, session }: { isAuth: boolean, onAuth: () => void, onSave: (s: Partial<Student>) => void, students: Student[], session: string }) => {
    const [pass, setPass] = useState('');
    const [formData, setFormData] = useState<Partial<Student>>({ class: '', branch: 'বালক শাখা' });
    const [photo, setPhoto] = useState<string | null>(null);

    if (!isAuth) {
        return (
            <div className="max-w-xs mx-auto mt-20 text-center space-y-4 animate-fadeIn">
                <i className="fas fa-lock text-4xl text-[#003366]"></i>
                <h2 className="font-bold text-slate-700 text-xl uppercase tracking-tighter">কর্তৃপক্ষ লগইন</h2>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="পাসওয়ার্ড দিন" className="w-full border p-4 rounded-xl shadow-inner focus:ring-2 ring-[#003366]/20 outline-none" />
                <button onClick={() => pass === ADMIN_PASSWORD ? onAuth() : alert('ভুল পাসওয়ার্ড')} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#002244] transition-all">প্রবেশ করুন</button>
            </div>
        );
    }

    const handleSave = () => {
        if (!formData.roll || !formData.nameBN || !formData.class) return alert("রোল, নাম এবং শ্রেণি আবশ্যক!");
        onSave({...formData, photo: photo || ''});
        alert("সংরক্ষিত হয়েছে!");
        setFormData({ class: '', branch: 'বালক শাখা' });
        setPhoto(null);
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border shadow-lg">
                <h2 className="text-2xl font-black text-[#003366] mb-8 flex items-center gap-3">
                    <i className="fas fa-file-signature"></i> সরাসরি শিক্ষার্থী এন্ট্রি
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField label="রোল নম্বর" type="number" onChange={v => setFormData({...formData, roll: parseInt(v)})} />
                    <InputField label="নাম (বাংলা)" onChange={v => setFormData({...formData, nameBN: v})} />
                    <InputField label="Name (English)" onChange={v => setFormData({...formData, nameEN: v})} />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">শ্রেণি</label>
                      <select className="w-full border p-2 rounded outline-[#003366]" onChange={e => setFormData({...formData, class: e.target.value})}>
                          <option value="">শ্রেণি নির্বাচন করুন</option>
                          {CLASS_LIST.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <InputField label="জন্ম নিবন্ধন নং" type="number" onChange={v => setFormData({...formData, reg: v})} />
                    <InputField label="পিতার নাম" onChange={v => setFormData({...formData, fName: v})} />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">ছবি</label>
                      <input type="file" className="text-xs" onChange={e => {
                          const r = new FileReader();
                          r.onload = () => setPhoto(r.result as string);
                          if(e.target.files?.[0]) r.readAsDataURL(e.target.files[0]);
                      }} />
                    </div>
                    <button onClick={handleSave} className="bg-green-600 text-white p-4 rounded-xl font-bold md:col-span-1 lg:col-span-3 mt-4 hover:shadow-lg transition-all">সংরক্ষণ করুন</button>
                </div>
            </div>
        </div>
    );
};

const IDCardSection = ({ students, logo }: { students: Student[], logo: string }) => {
    const [reg, setReg] = useState('');
    const [selected, setSelected] = useState<Student | null>(null);

    const find = () => {
        const s = students.find(x => x.reg === reg);
        if (s) setSelected(s);
        else alert("সঠিক জন্ম নিবন্ধন নম্বর খুঁজে পাওয়া যায়নি!");
    };

    return (
        <div className="max-w-md mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border shadow-lg text-center no-print">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#003366] text-2xl">
                    <i className="fas fa-id-badge"></i>
                </div>
                <h2 className="text-xl font-black mb-1">ডিজিটাল আইডি কার্ড</h2>
                <p className="text-slate-500 text-xs mb-6 italic uppercase tracking-widest">ভর্তি নিশ্চিত হলে এখান থেকে কার্ড সংগ্রহ করুন</p>
                <div className="space-y-4">
                    <input type="number" placeholder="১৭ ডিজিটের জন্ম নিবন্ধন নং" className="w-full border p-4 rounded-xl shadow-inner outline-[#003366] font-bold text-center tracking-widest" value={reg} onChange={e => setReg(e.target.value)} />
                    <button onClick={find} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">কার্ড দেখুন</button>
                </div>
            </div>

            {selected && (
                <div className="space-y-6">
                    <div id="printable-id" className="w-[3.375in] h-[5.375in] bg-white border-4 border-[#003366] rounded-3xl mx-auto overflow-hidden shadow-2xl flex flex-col items-center relative print:shadow-none print:border-8">
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#003366] to-[#004c99] -skew-y-6 -translate-y-12"></div>
                        
                        <div className="z-10 mt-6 flex flex-col items-center text-center">
                            <img src={logo} className="h-16 mb-2 drop-shadow-md" />
                            <h4 className="text-[10px] font-black text-white leading-tight px-4 uppercase tracking-tighter">নড়িয়াল দারুল হাদীস ইসলামিয়া মাদ্রাসা</h4>
                        </div>

                        <div className="z-10 mt-6 w-32 h-40 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-xl">
                            <img src={selected.photo} className="w-full h-full object-cover" />
                        </div>

                        <div className="z-10 mt-6 text-center px-4 w-full">
                            <h3 className="text-xl font-black text-[#003366] leading-tight mb-1">{selected.nameBN}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selected.nameEN}</p>
                        </div>

                        <div className="z-10 mt-6 w-full px-6 space-y-2">
                            <div className="flex justify-between items-center text-sm border-b pb-1">
                                <span className="font-bold text-slate-400 text-[10px] uppercase">রোল নম্বর</span>
                                <span className="font-black text-[#003366] font-mono">{selected.roll}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-1">
                                <span className="font-bold text-slate-400 text-[10px] uppercase">শ্রেণি</span>
                                <span className="font-bold">{selected.class}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-1">
                                <span className="font-bold text-slate-400 text-[10px] uppercase">রক্তের গ্রুপ</span>
                                <span className="font-bold text-red-600">{selected.bloodGroup || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-auto mb-6 w-full flex justify-center items-center gap-2">
                           <div className="flex flex-col items-center">
                              <div className="h-8 flex items-end"><span className="text-slate-300 font-mono text-[8px]">Seal & Sign</span></div>
                              <p className="text-[8px] font-bold text-slate-500 border-t pt-1 w-24 text-center uppercase">Principal Signature</p>
                           </div>
                        </div>

                        <div className="absolute bottom-0 w-full h-2 bg-[#fbc02d]"></div>
                    </div>
                    <button onClick={() => window.print()} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold no-print shadow-lg"><i className="fas fa-print mr-2"></i>প্রিন্ট আইডি কার্ড</button>
                </div>
            )}
        </div>
    );
};

const TrackingSection = ({ students }: { students: Student[] }) => {
    const [roll, setRoll] = useState('');
    const [res, setRes] = useState<Student | null>(null);

    return (
        <div className="max-w-md mx-auto text-center space-y-8 animate-fadeIn py-10">
            <h2 className="text-2xl font-black text-[#003366] uppercase tracking-tighter">আবেদনের বর্তমান অবস্থা</h2>
            <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-md border">
                <input type="number" placeholder="রোল নম্বর দিন" className="flex-1 p-4 rounded-xl outline-none font-bold" value={roll} onChange={e => setRoll(e.target.value)} />
                <button onClick={() => setRes(students.find(s => s.roll === parseInt(roll)) || null)} className="bg-[#003366] text-white px-8 rounded-xl font-bold shadow-md">খুঁজুন</button>
            </div>
            {res ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl border-l-[10px] border-[#003366] text-left animate-slideUp">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">শিক্ষার্থীর নাম</p>
                    <p className="text-xl font-black text-slate-800">{res.nameBN}</p>
                    <div className="mt-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ভেরিফিকেশন অবস্থা</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black text-white ${res.status === 'Verified' ? 'bg-green-600 shadow-green-200 shadow-lg' : 'bg-amber-600 animate-pulse shadow-amber-200 shadow-lg'}`}>
                                {res.status === 'Verified' ? 'ভেরিফাইড (অনুমোদিত)' : 'পেন্ডিং (যাচাই চলছে)'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : roll !== '' && <p className="text-red-500 font-bold">দুঃখিত! এই রোলে কোনো তথ্য পাওয়া যায়নি।</p>}
        </div>
    );
};

const AdmitCardSection = ({ students, logo }: { students: Student[], logo: string }) => {
    const [roll, setRoll] = useState('');
    const [exam, setExam] = useState<'অর্ধবার্ষিক' | 'বার্ষিক'>('বার্ষিক');
    const [stu, setStu] = useState<Student | null>(null);

    const generate = () => {
        const found = students.find(s => s.roll === parseInt(roll));
        if (!found) return alert("রোল খুঁজে পাওয়া যায়নি!");
        if (found.status !== 'Verified') return alert("আবেদন এখনও ভেরিফাই হয়নি!");
        setStu(found);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border shadow-lg text-center no-print">
                <h2 className="text-xl font-black mb-6 uppercase">প্রবেশপত্র সংগ্রহ</h2>
                <div className="space-y-4">
                    <input type="number" placeholder="আপনার রোল নম্বর" className="w-full border p-4 rounded-xl outline-[#003366] font-bold text-center" value={roll} onChange={e => setRoll(e.target.value)} />
                    <select className="w-full border p-4 rounded-xl font-bold outline-[#003366]" onChange={e => setExam(e.target.value as any)}>
                        <option>বার্ষিক</option>
                        <option>অর্ধবার্ষিক</option>
                    </select>
                    <button onClick={generate} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">প্রবেশপত্র দেখুন</button>
                </div>
            </div>

            {stu && (
                <div className="animate-fadeIn">
                    <div className="bg-white border-[12px] border-double border-[#003366] p-8 relative">
                        <div className="flex items-center gap-4 mb-8 border-b-2 pb-4">
                            <img src={logo} className="h-20" />
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 leading-tight">নড়িয়াল মাদ্রাসা</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase">প্রবেশপত্র: {exam} পরীক্ষা - ২০২৫</p>
                            </div>
                        </div>
                        <img src={stu.photo} className="absolute top-8 right-8 w-28 h-32 border-4 border-slate-100 object-cover shadow-sm" />
                        
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">নাম</p>
                                <p className="font-black text-lg text-slate-800">{stu.nameBN}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">রোল নম্বর</p>
                                <p className="font-mono text-xl font-black text-[#003366]">{stu.roll}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">শ্রেণি</p>
                                <p className="font-bold">{stu.class}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">সেশন</p>
                                <p className="font-bold">{stu.session}</p>
                            </div>
                        </div>

                        <div className="mt-20 flex justify-between">
                            <div className="text-center w-32 border-t pt-1 text-[8px] font-bold uppercase">Candidate Signature</div>
                            <div className="text-center w-32 border-t pt-1 text-[8px] font-bold uppercase">Principal Signature</div>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="w-full mt-6 bg-slate-800 text-white py-4 rounded-xl font-bold no-print shadow-lg"><i className="fas fa-print mr-2"></i>প্রিন্ট প্রবেশপত্র</button>
                </div>
            )}
        </div>
    );
};

const ResultSection = ({ students, marks, logo }: { students: Student[], marks: AllMarks, logo: string }) => {
    const [roll, setRoll] = useState('');
    const [res, setRes] = useState<{ stu: Student, m: Record<string, string> } | null>(null);

    const check = () => {
        const s = students.find(x => x.roll === parseInt(roll));
        if (!s) return alert("রোল নেই!");
        const m = marks[`${s.roll}_${s.session}`];
        if (!m) return alert("ফলাফল এখনও প্রকাশ হয়নি!");
        setRes({ stu: s, m });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border shadow-lg flex flex-col md:flex-row gap-4 no-print items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">রোল নম্বর প্রদান করুন</label>
                    <input type="number" placeholder="উদা: ১০০০১" className="w-full border p-4 rounded-xl outline-[#003366] font-bold mt-1" value={roll} onChange={e => setRoll(e.target.value)} />
                </div>
                <button onClick={check} className="bg-[#003366] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all w-full md:w-auto">ফলাফল দেখুন</button>
            </div>

            {res && (
                <div className="animate-fadeIn">
                    <div className="bg-white p-12 border-2 border-slate-300 rounded-xl relative overflow-hidden shadow-2xl">
                        <img src={logo} className="absolute inset-0 m-auto w-[500px] opacity-[0.03] pointer-events-none rotate-12" />

                        <div className="flex flex-col items-center mb-10 text-center relative z-10">
                            <img src={logo} className="h-28 mb-4" />
                            <h2 className="text-4xl font-black text-slate-800">নড়িয়াল মাদ্রাসা</h2>
                            <p className="text-lg font-bold text-[#003366] border-b-2 border-[#003366] px-6 py-1 mt-2 uppercase tracking-widest">একাডেমিক ট্রান্সক্রিপ্ট (মার্কশিট)</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl mb-10 border relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">নাম</p>
                                <p className="font-bold text-slate-700">{res.stu.nameBN}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">রোল নম্বর</p>
                                <p className="font-black text-slate-700 font-mono">{res.stu.roll}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">শ্রেণি</p>
                                <p className="font-bold text-slate-700">{res.stu.class}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">সেশন</p>
                                <p className="font-bold text-slate-700">{res.stu.session}</p>
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-slate-300 relative z-10 shadow-sm">
                            <thead>
                                <tr className="bg-[#003366] text-white">
                                    <th className="border border-slate-300 p-4 text-left uppercase text-xs tracking-widest">বিষয়</th>
                                    <th className="border border-slate-300 p-4 text-center w-32 uppercase text-xs tracking-widest">পূর্ণমান</th>
                                    <th className="border border-slate-300 p-4 text-center w-32 uppercase text-xs tracking-widest">প্রাপ্ত নম্বর</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SUBJECT_LIST.map((sub, idx) => (
                                    <tr key={sub} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                        <td className="border border-slate-300 p-4 text-sm font-bold text-slate-700">{sub}</td>
                                        <td className="border border-slate-300 p-4 text-center text-sm font-mono text-slate-400">১০০</td>
                                        <td className="border border-slate-300 p-4 text-center font-black text-lg font-mono text-[#003366]">{res.m[sub] || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-24 flex justify-between items-end relative z-10 px-8">
                            <div className="text-center">
                                <p className="border-t border-slate-300 pt-1 text-[10px] font-bold uppercase text-slate-500">Principal Signature</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="w-full mt-8 bg-slate-800 text-white py-4 rounded-xl font-bold no-print shadow-lg hover:scale-[1.02] transition-transform"><i className="fas fa-print mr-2"></i>ট্রান্সক্রিপ্ট প্রিন্ট করুন</button>
                </div>
            )}
        </div>
    );
};

const AdminSection = ({ isLoggedIn, onLogin, onLogout, config, onUpdateConfig, students, onVerify, onDelete, marks, onSaveMarks }: { 
    isLoggedIn: boolean, 
    onLogin: () => void, 
    onLogout: () => void, 
    config: AppConfig, 
    onUpdateConfig: (c: AppConfig) => void,
    students: Student[],
    onVerify: (id: string) => void,
    onDelete: (id: string) => void,
    marks: AllMarks,
    onSaveMarks: (m: AllMarks) => void
}) => {
    const [pass, setPass] = useState('');
    const [activeTab, setActiveTab] = useState<'applicants' | 'marks' | 'config'>('applicants');
    const [editConfig, setEditConfig] = useState(config);

    const [markRoll, setMarkRoll] = useState('');
    const [currentMarks, setCurrentMarks] = useState<Record<string, string>>({});

    if (!isLoggedIn) {
        return (
            <div className="max-w-xs mx-auto mt-20 text-center space-y-4 animate-fadeIn">
                <i className="fas fa-user-shield text-4xl text-[#003366]"></i>
                <h2 className="font-black text-slate-700 text-2xl uppercase tracking-tighter">এডমিন ড্যাশবোর্ড</h2>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="পাসওয়ার্ড দিন" className="w-full border p-4 rounded-xl shadow-inner focus:ring-2 ring-[#003366]/20 outline-none text-center" />
                <button onClick={() => pass === ADMIN_PASSWORD ? onLogin() : alert('ভুল পাসওয়ার্ড')} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#002244] transition-all">লগইন করুন</button>
            </div>
        );
    }

    const loadForMarks = () => {
        const s = students.find(x => x.roll === parseInt(markRoll));
        if(!s) return alert("রোল নেই!");
        const existing = marks[`${s.roll}_${s.session}`] || {};
        setCurrentMarks(existing);
    };

    const saveMarks = () => {
        const s = students.find(x => x.roll === parseInt(markRoll));
        if(!s) return;
        onSaveMarks({ ...marks, [`${s.roll}_${s.session}`]: currentMarks });
        alert("মার্কস সেভ হয়েছে!");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'headImg' | 'presImg' | 'logo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditConfig(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadBackup = () => {
        const data = { students, config, marks };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `madrasa_portal_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-black text-[#003366] uppercase tracking-tighter">সিস্টেম ম্যানেজমেন্ট</h2>
                <button onClick={onLogout} className="bg-red-500 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-red-600 transition-all">নিরাপদ প্রস্থান</button>
            </div>

            <div className="flex gap-4 border-b no-print overflow-x-auto">
                <button onClick={() => setActiveTab('applicants')} className={`px-6 py-3 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'applicants' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}>আবেদন ব্যবস্থাপনা</button>
                <button onClick={() => setActiveTab('marks')} className={`px-6 py-3 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'marks' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}>ফলাফল ব্যবস্থাপনা</button>
                <button onClick={() => setActiveTab('config')} className={`px-6 py-3 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'config' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}>পোর্টাল সেটিংস</button>
            </div>

            {activeTab === 'applicants' && (
                <div className="bg-white rounded-2xl border shadow-lg overflow-hidden animate-fadeIn">
                    <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                       <h3 className="font-bold text-slate-700">আবেদনকারীর তালিকা ({students.length})</h3>
                       <button onClick={() => window.print()} className="bg-white border px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all"><i className="fas fa-print mr-1"></i>তালিকা প্রিন্ট</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 text-left">রোল</th>
                                    <th className="p-4 text-left">নাম</th>
                                    <th className="p-4 text-left">শ্রেণি</th>
                                    <th className="p-4 text-left">অবস্থা</th>
                                    <th className="p-4 text-center">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? <tr><td colSpan={5} className="p-16 text-center text-slate-400 italic">কোনো আবেদন এখন পর্যন্ত জমা পড়েনি</td></tr> :
                                students.sort((a, b) => b.roll - a.roll).map(s => (
                                    <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono font-bold">{s.roll}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={s.photo} className="w-10 h-10 rounded object-cover shadow-sm border" />
                                                <span className="font-bold text-slate-700">{s.nameBN}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold">{s.class}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${s.status === 'Verified' ? 'bg-green-600' : 'bg-amber-600'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                {s.status === 'Pending' && (
                                                    <button onClick={() => onVerify(s.id)} className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-lg font-black shadow hover:shadow-lg transition-all">Approve</button>
                                                )}
                                                <button onClick={() => onDelete(s.id)} className="text-red-500 hover:text-red-700 transition-all" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'marks' && (
                <div className="bg-white p-8 rounded-2xl border shadow-lg space-y-8 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-4 items-end max-w-lg">
                        <div className="flex-1 w-full">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">রোল দিয়ে খুঁজুন</label>
                            <input type="number" className="w-full border p-4 rounded-xl outline-[#003366] font-bold mt-1" value={markRoll} onChange={e => setMarkRoll(e.target.value)} />
                        </div>
                        <button onClick={loadForMarks} className="bg-[#003366] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all w-full md:w-auto">ডাটা লোড</button>
                    </div>
                    {markRoll && students.find(s => s.roll === parseInt(markRoll)) && (
                        <div className="animate-slideUp space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {SUBJECT_LIST.map(sub => (
                                    <div key={sub} className="flex flex-col p-3 border rounded-xl bg-white hover:border-[#003366] transition-all">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">{sub}</label>
                                        <input type="number" className="p-2 bg-slate-50 rounded font-bold text-[#003366] outline-none" placeholder="নম্বর" value={currentMarks[sub] || ''} onChange={e => setCurrentMarks({...currentMarks, [sub]: e.target.value})} />
                                    </div>
                                ))}
                            </div>
                            <button onClick={saveMarks} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-green-700 transition-all text-lg">ফলাফল আপডেট করুন</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'config' && (
                <div className="bg-white p-8 rounded-2xl border shadow-lg space-y-8 animate-fadeIn">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div>
                            <h3 className="font-bold text-[#003366]">সিস্টেম ব্যাকআপ</h3>
                            <p className="text-xs text-slate-500">সমস্ত তথ্য একটি ফাইল আকারে ডাউনলোড করুন।</p>
                        </div>
                        <button onClick={downloadBackup} className="bg-[#003366] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-[#002244] transition-all">
                            <i className="fas fa-download mr-2"></i>ডাউনলোড ডাটা
                        </button>
                    </div>

                    <div className="p-6 border-2 border-dashed rounded-2xl bg-slate-50/50 flex flex-col md:flex-row items-center gap-8">
                         <div className="w-40 h-40 bg-white border rounded-2xl shadow-md flex items-center justify-center overflow-hidden p-2">
                            <img src={editConfig.logo} className="w-full h-full object-contain" />
                         </div>
                         <div className="space-y-4 flex-1 w-full">
                            <h3 className="font-black text-[#003366] uppercase tracking-tighter">মাদ্রাসার লগো পরিবর্তন</h3>
                            <input type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#003366] file:text-white hover:file:bg-[#002244]" onChange={e => handleImageChange(e, 'logo')} />
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6 p-6 border rounded-2xl bg-white shadow-sm border-t-[8px] border-t-[#003366]">
                            <h3 className="font-black text-[#003366] border-b pb-2 flex items-center gap-2 uppercase tracking-tighter">প্রধান শিক্ষক তথ্য</h3>
                            <InputField label="নাম" onChange={v => setEditConfig({...editConfig, headName: v})} />
                            <InputField label="মোবাইল" onChange={v => setEditConfig({...editConfig, headNum: v})} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">স্বাক্ষর বা ছবি</label>
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border">
                                    <img src={editConfig.headImg} className="w-16 h-16 rounded-full border-2 object-cover border-white shadow-md" />
                                    <input type="file" className="text-[10px]" onChange={e => handleImageChange(e, 'headImg')} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6 border rounded-2xl bg-white shadow-sm border-t-[8px] border-t-[#fbc02d]">
                            <h3 className="font-black text-[#003366] border-b pb-2 flex items-center gap-2 uppercase tracking-tighter">সভাপতি তথ্য</h3>
                            <InputField label="নাম" onChange={v => setEditConfig({...editConfig, presName: v})} />
                            <InputField label="মোবাইল" onChange={v => setEditConfig({...editConfig, presNum: v})} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">স্বাক্ষর বা ছবি</label>
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border">
                                    <img src={editConfig.presImg} className="w-16 h-16 rounded-full border-2 object-cover border-white shadow-md" />
                                    <input type="file" className="text-[10px]" onChange={e => handleImageChange(e, 'presImg')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => { onUpdateConfig(editConfig); alert('সিস্টেম সেটিংস সংরক্ষিত হয়েছে!'); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black shadow-2xl hover:scale-[1.01] transition-all text-xl uppercase tracking-tighter">সেটিংস সেভ করুন</button>
                </div>
            )}
        </div>
    );
};

export default App;
