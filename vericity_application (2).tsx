import React, { useState, useEffect } from 'react';
import { 
  Building2, UserCheck, ShieldCheck, Camera, MapPin, Search, AlertTriangle, 
  CheckCircle2, Clock, ChevronRight, ArrowLeft, RefreshCw, FileText, Send, 
  Filter, Bell, LogOut, ChevronDown, Check, X, Shield, Eye, ThumbsUp, HelpCircle,
  BarChart3, Users, LayoutDashboard, Layers, AlertCircle, ArrowUpRight, Upload,
  Briefcase, CheckSquare, Sparkles, Navigation, Smartphone, Monitor
} from 'lucide-react';

const INITIAL_COMPLAINTS = [
  {
    id: "VC-2026-1842",
    category: "Roads & Drainage",
    title: "Hazardous Deep Pothole on Main Arterial Road",
    description: "Large deep pothole causing severe traffic congestion and dangerous swerving near Sector 4 intersection.",
    location: "Sector 4, Main Outer Ring Road, Delhi",
    coordinates: "28.6139° N, 77.2090° E",
    date: "2026-09-10 09:30 AM",
    status: "In Progress", // Complaint Registered -> Officer Assigned -> Inspection Done -> Verification Pending -> Resolved
    timelineStep: 3, // 0 to 6
    beforeImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImage: null,
    officer: "Rajesh Kumar (Senior Infra Engineer)",
    department: "Public Works Dept (PWD)",
    priority: "High",
    officerRemark: "Site inspected on Sept 11. Material dispatched for asphalt cold patching and leveling.",
    officerRemarkDate: "2026-09-11 02:15 PM",
    isDuplicate: false,
    blockchainHash: "0x8f9a...3b21c9a40e782d"
  },
  {
    id: "VC-2026-0941",
    category: "Street Lighting",
    title: "Broken Streetlight Solar Panel & Dead Bulb",
    description: "Dark patch of 200m near public park making it unsafe for pedestrians after 7 PM.",
    location: "Block C, Green Park Extension, Delhi",
    coordinates: "28.5588° N, 77.2028° E",
    date: "2026-09-08 11:15 AM",
    status: "Verification Pending",
    timelineStep: 5,
    beforeImage: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    officer: "Amit Shah (Electrical Division)",
    department: "Municipal Electricity Board",
    priority: "Medium",
    officerRemark: "Replaced 120W LED fixture and upgraded wiring harness. Photo uploaded.",
    officerRemarkDate: "2026-09-12 10:45 AM",
    isDuplicate: false,
    blockchainHash: "0x3c2a...9d71a55f812e11"
  },
  {
    id: "VC-2026-0312",
    category: "Waste Management",
    title: "Overflowing Garbage Dumpster near Market",
    description: "Garbage accumulating outside designated bins for 3 days. Poses sanitation hazard.",
    location: "Central Market Arcade, Lajpat Nagar",
    coordinates: "28.5700° N, 77.2400° E",
    date: "2026-09-05 04:20 PM",
    status: "Resolved",
    timelineStep: 6,
    beforeImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    officer: "Sunita Verma (Sanitation Inspector)",
    department: "Municipal Solid Waste Management",
    priority: "High",
    officerRemark: "Special clearance drive completed. Bin disinfected and extra dumpsters placed.",
    officerRemarkDate: "2026-09-06 01:00 PM",
    isDuplicate: false,
    blockchainHash: "0x11b9...7a44f290d19e08"
  }
];

export default function VeriCityApp() {
  // Top Level State
  const [currentRole, setCurrentRole] = useState('selection'); // 'selection', 'citizen', 'authority'
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  
  // Quick switcher notification modal state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // CITIZEN STATE
  // ---------------------------------------------------------------------------
  const [citizenScreen, setCitizenScreen] = useState('welcome'); 
  // 'welcome', 'mobile_num', 'otp', 'home', 'report_photo', 'report_details', 'report_review', 
  // 'report_duplicate', 'report_submitted', 'track_search', 'track_timeline', 'officer_remark', 
  // 'verification_done', 'final_verification', 'report_resolved', 'my_reports'
  
  const [mobileNum, setMobileNum] = useState('');
  const [otpVal, setOtpVal] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [selectedComplaintId, setSelectedComplaintId] = useState('VC-2026-1842');
  
  // New Report Draft State
  const [reportCategory, setReportCategory] = useState('Roads & Drainage');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPhoto, setReportPhoto] = useState(null);
  const [reportLocation, setReportLocation] = useState('Sector 4, Main Outer Ring Road, Delhi');
  const [simulateDuplicate, setSimulateDuplicate] = useState(false);
  const [submittedReportData, setSubmittedReportData] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [showQueryInput, setShowQueryInput] = useState(false);
  const [myReportsFilter, setMyReportsFilter] = useState('All');

  // OTP Countdown timer effect
  useEffect(() => {
    let timer;
    if (citizenScreen === 'otp' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [citizenScreen, otpTimer]);

  // Selected complaint object accessor helper
  const activeComplaint = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  // ---------------------------------------------------------------------------
  // AUTHORITY STATE
  // ---------------------------------------------------------------------------
  const [authorityLoggedIn, setAuthorityLoggedIn] = useState(false);
  const [govId, setGovId] = useState('OFFICER-DL-4029');
  const [govPassword, setGovPassword] = useState('••••••••••••');
  const [authActiveTab, setAuthActiveTab] = useState('Dashboard'); // Dashboard, Complaints, Analytics, Officers
  const [selectedAuthComplaint, setSelectedAuthComplaint] = useState(null);
  const [authFilterStatus, setAuthFilterStatus] = useState('All');

  // Authority Form inputs for updating a complaint
  const [editOfficer, setEditOfficer] = useState('');
  const [editRemark, setEditRemark] = useState('');
  const [editAfterPhoto, setEditAfterPhoto] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const openAuthComplaintModal = (comp) => {
    setSelectedAuthComplaint(comp);
    setEditOfficer(comp.officer || 'Rajesh Kumar (Senior Infra Engineer)');
    setEditRemark(comp.officerRemark || '');
    setEditAfterPhoto(comp.afterImage || '');
    setEditStatus(comp.status);
  };

  const handleUpdateComplaintFromAuthority = () => {
    if (!selectedAuthComplaint) return;
    
    let newTimelineStep = selectedAuthComplaint.timelineStep;
    if (editStatus === 'Officer Assigned' && newTimelineStep < 1) newTimelineStep = 1;
    if (editStatus === 'In Progress' && newTimelineStep < 2) newTimelineStep = 2;
    if (editStatus === 'Verification Pending') newTimelineStep = 5;
    if (editStatus === 'Resolved') newTimelineStep = 6;

    const updated = complaints.map(c => {
      if (c.id === selectedAuthComplaint.id) {
        return {
          ...c,
          status: editStatus,
          officer: editOfficer,
          officerRemark: editRemark,
          afterImage: editAfterPhoto || c.afterImage,
          timelineStep: newTimelineStep,
          officerRemarkDate: editRemark ? new Date().toLocaleString() : c.officerRemarkDate
        };
      }
      return c;
    });

    setComplaints(updated);
    setSelectedAuthComplaint(null);
    showToast(`Complaint ${selectedAuthComplaint.id} updated successfully!`);
  };

  // Helper submit new complaint from Citizen
  const handleFinalSubmitComplaint = () => {
    const newId = `VC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newId,
      category: reportCategory,
      title: `${reportCategory} Issue reported by Citizen`,
      description: reportDescription || "No detailed description provided.",
      location: reportLocation,
      coordinates: "28.6140° N, 77.2091° E",
      date: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      status: "In Progress",
      timelineStep: 0,
      beforeImage: reportPhoto || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      afterImage: null,
      officer: "Unassigned (Auto-Routing)",
      department: "Municipal Civil Division",
      priority: "Medium",
      officerRemark: "",
      officerRemarkDate: "",
      isDuplicate: false,
      blockchainHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 8)}`
    };

    setComplaints([newEntry, ...complaints]);
    setSubmittedReportData(newEntry);
    setSelectedComplaintId(newId);
    setCitizenScreen('report_submitted');
    
    // Reset form draft
    setReportDescription('');
    setReportPhoto(null);
    setSimulateDuplicate(false);
  };

  if (currentRole === 'selection') {
    return (
      <div className="min-h-screen bg-[#f4f8f5] text-[#1b4332] font-sans flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
        {/* Background Decorative SVG City Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10 pointer-events-none flex justify-center items-end">
          <svg className="w-full max-w-7xl h-full" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200V140H40V200H0ZM50 200V80H110V200H50ZM120 200V110H170V200H120ZM180 200V40H260V200H180ZM270 200V130H320V200H270ZM330 200V90H410V200H330ZM420 200V20H520V200H420ZM530 200V100H600V200H530ZM610 200V60H710V200H610ZM720 200V120H780V200H720ZM790 200V70H880V200H790ZM890 200V130H950V200H890ZM960 200V50H1060V200H960ZM1070 200V110H1200V200H1070Z" fill="#1b4332"/>
          </svg>
        </div>

        {/* Top Header Logo */}
        <header className="max-w-4xl mx-auto w-full pt-4 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] flex items-center justify-center text-[#52b788] shadow-lg shadow-[#1b4332]/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1b4332]">VeriCity</h1>
              <p className="text-xs font-semibold text-[#2d6a4f] tracking-widest uppercase">Civic Accountability Platform</p>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-2xl mx-auto w-full my-auto py-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef4f0] border border-[#2d6a4f]/20 text-[#2d6a4f] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#52b788]" />
            <span>Hackathon Interactive Prototype Demo</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-[#1b4332] tracking-tight leading-tight mb-4">
            From Complaint to Accountability.
          </h2>
          <p className="text-base md:text-lg text-[#2d6a4f] max-w-xl mx-auto mb-10 leading-relaxed">
            VeriCity bridges the gap between citizens and local governance. Report civic issues anonymously and track full life-cycle resolution with tamper-proof clarity.
          </p>

          {/* Selection Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d6a4f]/80">Continue as</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* Citizen Card */}
              <div 
                onClick={() => setCurrentRole('citizen')}
                className="group relative bg-white border-2 border-[#52b788]/30 hover:border-[#1b4332] rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#eef4f0] group-hover:bg-[#1b4332] text-[#1b4332] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1b4332]">Citizen Experience</h4>
                  <p className="text-xs text-[#2d6a4f] mt-1 leading-relaxed">
                    Mobile-first app for anonymous reporting, duplicate detection, and automated tracking.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#1b4332]">
                  <span>Launch Mobile App</span>
                  <div className="w-8 h-8 rounded-full bg-[#eef4f0] group-hover:bg-[#52b788] text-[#1b4332] flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Government Body Card */}
              <div 
                onClick={() => setCurrentRole('authority')}
                className="group relative bg-white border-2 border-[#52b788]/30 hover:border-[#1b4332] rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#eef4f0] group-hover:bg-[#1b4332] text-[#1b4332] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1b4332]">Government Body</h4>
                  <p className="text-xs text-[#2d6a4f] mt-1 leading-relaxed">
                    Desktop portal for municipal officers, SLA tracking, task dispatch, & evidence upload.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#1b4332]">
                  <span>Launch Authority Portal</span>
                  <div className="w-8 h-8 rounded-full bg-[#eef4f0] group-hover:bg-[#52b788] text-[#1b4332] flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="max-w-4xl mx-auto w-full text-center text-xs text-[#2d6a4f]/70 py-4 border-t border-[#2d6a4f]/10">
          <p>© 2026 VeriCity Framework. Transparent, Anonymous, Accountable.</p>
        </footer>
      </div>
    );
  }

  const HeaderQuickSwitcher = () => (
    <div className="bg-[#1b4332] text-white py-2 px-4 shadow-md flex items-center justify-between border-b border-[#52b788]/30 text-xs font-medium z-50">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
        <span>VeriCity Demo Controller</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentRole('selection')}
          aria-label="Return to Role Selection"
          className="hover:underline text-[#52b788] font-bold"
        >
          ← Role Switcher
        </button>
        <div className="bg-[#081c15] p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setCurrentRole('citizen')}
            aria-label="Switch to Citizen Mobile Interface"
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentRole === 'citizen' ? 'bg-[#52b788] text-[#081c15]' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Citizen App
          </button>
          <button
            onClick={() => setCurrentRole('authority')}
            aria-label="Switch to Authority Desktop Portal"
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentRole === 'authority' ? 'bg-[#52b788] text-[#081c15]' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Authority Desktop
          </button>
        </div>
      </div>
    </div>
  );

  if (currentRole === 'citizen') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans">
        <HeaderQuickSwitcher />
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-14 z-50 bg-[#1b4332] text-white px-4 py-2 rounded-xl shadow-xl border border-[#52b788] text-xs font-medium animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Outer Phone Shell Frame */}
        <div className="w-full max-w-[410px] h-[100vh] sm:h-[840px] bg-[#f4f8f5] sm:rounded-[40px] shadow-2xl border-0 sm:border-[8px] border-slate-800 flex flex-col relative overflow-hidden my-auto">
          
          {/* Mobile Top Status Bar */}
          <div className="bg-[#1b4332] text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold shrink-0">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black/40 rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-3 h-2 bg-[#52b788] rounded-sm"></div>
            </div>
          </div>

          {/* CITIZEN SCREEN ROUTER */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#f4f8f5] text-[#1b4332]">

            {/* SCREEN 1: CITIZEN WELCOME */}
            {citizenScreen === 'welcome' && (
              <div className="flex-1 flex flex-col justify-between p-6 relative">
                <div className="space-y-4 pt-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-[#1b4332] text-[#52b788] flex items-center justify-center mx-auto shadow-xl shadow-[#1b4332]/20">
                    <Building2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#1b4332] tracking-tight">VeriCity</h2>
                  <p className="text-sm font-bold text-[#2d6a4f] tracking-wide uppercase">From Complaint to Accountability.</p>
                  <p className="text-xs text-[#2d6a4f] leading-relaxed px-4">
                    For a Cleaner, Safer, and More Transparent City. Empowering citizens with real-time tracking & verified action.
                  </p>
                </div>

                {/* Flat Cityscape SVG */}
                <div className="my-6 flex justify-center opacity-80">
                  <svg className="w-full h-36" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 150V90H50V150H10ZM60 150V50H120V150H60ZM130 150V100H180V150H130ZM190 150V30H270V150H190ZM280 150V80H330V150H280ZM340 150V110H390V150H340Z" fill="#2d6a4f" fillOpacity="0.2"/>
                    <circle cx="200" cy="40" r="20" fill="#52b788" fillOpacity="0.3"/>
                  </svg>
                </div>

                <div className="space-y-3 pb-4">
                  <button
                    onClick={() => setCitizenScreen('mobile_num')}
                    aria-label="Get Started with Citizen App"
                    className="w-full py-4 bg-[#1b4332] hover:bg-[#081c15] text-white font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => setCitizenScreen('mobile_num')}
                    aria-label="Sign In to Citizen App"
                    className="w-full py-3.5 bg-white border border-[#2d6a4f]/30 text-[#1b4332] font-semibold text-sm rounded-2xl shadow-sm hover:bg-[#eef4f0] transition-all"
                  >
                    Sign In
                  </button>
                  <p className="text-[10px] text-center text-[#2d6a4f]/70 px-4 mt-4">
                    By continuing, you agree to our Terms & Conditions and Privacy Policy.
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 2: ENTER MOBILE NUMBER */}
            {citizenScreen === 'mobile_num' && (
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <button 
                    onClick={() => setCitizenScreen('welcome')} 
                    aria-label="Back to Welcome Screen"
                    className="w-10 h-10 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm mb-6"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider mb-2">
                    <Shield className="w-4 h-4 text-[#52b788]" />
                    <span>Secure Sign In</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1b4332] mb-2">Enter your mobile number</h2>
                  <p className="text-xs text-[#2d6a4f] mb-8 leading-relaxed">
                    We use your phone number exclusively for authentic OTP validation. Your identity will remain strictly anonymous on public complaints.
                  </p>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#1b4332]">Mobile Phone Number</label>
                    <div className="flex gap-2">
                      <div className="bg-white border border-[#2d6a4f]/30 rounded-2xl px-3 py-3.5 flex items-center text-xs font-bold text-[#1b4332]">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        className="flex-1 bg-white border border-[#2d6a4f]/30 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pb-4">
                  <button
                    onClick={() => setCitizenScreen('otp')}
                    aria-label="Send OTP Verification Code"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Send OTP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: OTP VERIFICATION */}
            {citizenScreen === 'otp' && (
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <button 
                    onClick={() => setCitizenScreen('mobile_num')} 
                    aria-label="Back to Mobile Number Screen"
                    className="w-10 h-10 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm mb-6"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-black text-[#1b4332] mb-1">Verify OTP</h2>
                  <p className="text-xs text-[#2d6a4f] mb-6">
                    Enter the 6-digit code sent to <span className="font-bold text-[#1b4332]">+91 {mobileNum || '9876543210'}</span>
                  </p>

                  {/* 6 OTP Boxes */}
                  <div className="flex gap-2 justify-between mb-6">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        value={otpVal[idx]}
                        onChange={(e) => {
                          const newOtp = [...otpVal];
                          newOtp[idx] = e.target.value;
                          setOtpVal(newOtp);
                        }}
                        className="w-11 h-12 bg-white border-2 border-[#2d6a4f]/20 focus:border-[#1b4332] rounded-xl text-center text-lg font-black text-[#1b4332] focus:outline-none"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#2d6a4f] mb-8 font-medium">
                    <span>Resend OTP in <strong className="text-[#1b4332]">{otpTimer}s</strong></span>
                    <button 
                      disabled={otpTimer > 0} 
                      onClick={() => setOtpTimer(30)}
                      aria-label="Resend OTP code"
                      className="text-[#1b4332] font-bold disabled:opacity-40 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>

                  {/* Privacy & Security Card */}
                  <div className="bg-white border border-[#52b788]/40 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-[#1b4332] text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                      <span>Anonymity & Blockchain Security</span>
                    </div>
                    <ul className="text-[11px] text-[#2d6a4f] space-y-1.5 pl-5 list-disc leading-tight">
                      <li>Your ID is personal and secure. Identity remains confidential.</li>
                      <li>Complaints are anonymous and your ID will not be revealed to officers.</li>
                      <li>Blockchain hashing protects complaint logs against tampering.</li>
                      <li>Every issue receives a cryptographic Complaint ID.</li>
                    </ul>
                  </div>
                </div>

                <div className="pb-4">
                  <button
                    onClick={() => setCitizenScreen('home')}
                    aria-label="Verify OTP Code"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all active:scale-95"
                  >
                    Verify & Continue
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4: CITIZEN HOME DASHBOARD */}
            {citizenScreen === 'home' && (
              <div className="flex-1 flex flex-col justify-between bg-[#f4f8f5]">
                <div className="p-5 space-y-5">
                  {/* Top Bar */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-[#52b788] flex items-center justify-center font-bold">
                        VC
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#1b4332]">Hello, Resident</h3>
                        <p className="text-[11px] text-[#2d6a4f]">Sector 4, New Delhi</p>
                      </div>
                    </div>
                    <button aria-label="Notifications" className="w-9 h-9 rounded-xl bg-white border border-[#2d6a4f]/20 flex items-center justify-center text-[#1b4332] shadow-sm">
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Prominent Action Banner */}
                  <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full text-[#52b788]">Fast Civic Report</span>
                    <h3 className="text-xl font-black leading-tight mt-2 mb-1">Encountered a Civic Problem?</h3>
                    <p className="text-xs text-[#eef4f0] opacity-90 mb-4">Snap a picture and trigger accountable municipal action immediately.</p>
                    
                    <button
                      onClick={() => setCitizenScreen('report_photo')}
                      aria-label="Report a New Complaint"
                      className="w-full py-3.5 bg-[#52b788] hover:bg-[#40966d] text-[#081c15] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Report a New Complaint</span>
                    </button>
                  </div>

                  {/* Secondary Quick Action & Counters */}
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      onClick={() => { setCitizenScreen('my_reports'); setMyReportsFilter('All'); }}
                      className="bg-white border border-[#2d6a4f]/15 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-[#1b4332]"
                    >
                      <span className="text-lg font-black text-[#1b4332]">{complaints.length}</span>
                      <p className="text-[10px] text-[#2d6a4f] font-semibold">Total Reports</p>
                    </div>
                    <div 
                      onClick={() => { setCitizenScreen('my_reports'); setMyReportsFilter('In Progress'); }}
                      className="bg-white border border-[#2d6a4f]/15 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-[#1b4332]"
                    >
                      <span className="text-lg font-black text-amber-600">
                        {complaints.filter(c => c.status === 'In Progress' || c.status === 'Verification Pending').length}
                      </span>
                      <p className="text-[10px] text-[#2d6a4f] font-semibold">In Progress</p>
                    </div>
                    <div 
                      onClick={() => { setCitizenScreen('my_reports'); setMyReportsFilter('Resolved'); }}
                      className="bg-white border border-[#2d6a4f]/15 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-[#1b4332]"
                    >
                      <span className="text-lg font-black text-[#52b788]">
                        {complaints.filter(c => c.status === 'Resolved').length}
                      </span>
                      <p className="text-[10px] text-[#2d6a4f] font-semibold">Resolved</p>
                    </div>
                  </div>

                  {/* Track By ID Direct Action */}
                  <button
                    onClick={() => setCitizenScreen('track_search')}
                    aria-label="Track Complaint by ID"
                    className="w-full py-3 bg-white border border-[#2d6a4f]/25 rounded-2xl text-xs font-bold text-[#1b4332] shadow-sm flex items-center justify-center gap-2 hover:bg-[#eef4f0]"
                  >
                    <Search className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>Track Complaint by ID</span>
                  </button>

                  {/* Recent Complaints Feed */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#1b4332]">Recent City Reports</h4>
                      <button 
                        onClick={() => setCitizenScreen('my_reports')}
                        aria-label="View All Reports"
                        className="text-[11px] font-bold text-[#2d6a4f] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {complaints.slice(0, 3).map((comp) => (
                        <div
                          key={comp.id}
                          onClick={() => {
                            setSelectedComplaintId(comp.id);
                            setCitizenScreen('track_timeline');
                          }}
                          className="bg-white border border-[#2d6a4f]/15 rounded-2xl p-3.5 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              <img src={comp.beforeImage} alt="Issue" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-[#2d6a4f] px-1.5 py-0.5 rounded bg-[#eef4f0]">
                                  {comp.id}
                                </span>
                                <span className="text-[10px] text-gray-400">• {comp.date.split(' ')[0]}</span>
                              </div>
                              <h5 className="text-xs font-bold text-[#1b4332] line-clamp-1 mt-0.5">{comp.title}</h5>
                              <p className="text-[10px] text-gray-500">{comp.location}</p>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full ${
                              comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                              comp.status === 'Verification Pending' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {comp.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Mobile Nav */}
                <div className="bg-white border-t border-[#2d6a4f]/15 px-6 py-3 flex justify-around items-center shrink-0">
                  <button 
                    onClick={() => setCitizenScreen('home')}
                    aria-label="Home Tab"
                    className="flex flex-col items-center gap-1 text-[#1b4332]"
                  >
                    <Building2 className="w-5 h-5 text-[#1b4332]" />
                    <span className="text-[10px] font-bold">Home</span>
                  </button>
                  <button 
                    onClick={() => { setCitizenScreen('my_reports'); setMyReportsFilter('All'); }}
                    aria-label="My Reports Tab"
                    className="flex flex-col items-center gap-1 text-[#2d6a4f]/60 hover:text-[#1b4332]"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px] font-bold">My Reports</span>
                  </button>
                  <button 
                    onClick={() => setCitizenScreen('welcome')}
                    aria-label="Profile Tab"
                    className="flex flex-col items-center gap-1 text-[#2d6a4f]/60 hover:text-[#1b4332]"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: REPORT FLOW - PHOTO / SCANNER */}
            {citizenScreen === 'report_photo' && (
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('home')} 
                      aria-label="Back to Home Dashboard"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Report a New Complaint</h3>
                    <div className="w-9"></div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between px-6 mb-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center">1</div>
                      <span className="text-[10px] font-bold text-[#1b4332]">Photo</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gray-300 mx-2"></div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">2</div>
                      <span className="text-[10px] text-gray-400">Details</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gray-300 mx-2"></div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">3</div>
                      <span className="text-[10px] text-gray-400">Review</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-[#1b4332] mb-1">Capture the Issue</h4>
                  <p className="text-xs text-[#2d6a4f] mb-4">Take a clear picture of the damaged road, waste dump, or faulty infrastructure.</p>

                  {/* Camera Viewfinder Box */}
                  <div className="relative w-full h-64 bg-slate-800 rounded-3xl overflow-hidden shadow-inner border-2 border-[#52b788] flex flex-col items-center justify-center text-white p-4">
                    {reportPhoto ? (
                      <div className="relative w-full h-full">
                        <img src={reportPhoto} alt="Captured preview" className="w-full h-full object-cover rounded-2xl" />
                        <button 
                          onClick={() => setReportPhoto(null)}
                          aria-label="Retake photo"
                          className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 animate-pulse">
                          <Camera className="w-8 h-8 text-[#52b788]" />
                        </div>
                        <p className="text-xs font-semibold text-gray-300">Live Viewfinder Ready</p>
                        <p className="text-[10px] text-gray-400">Position the civic hazard within frame</p>
                      </>
                    )}
                  </div>

                  {/* Mock Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => setReportPhoto("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80")}
                      aria-label="Simulate photo capture"
                      className="py-3 bg-white border border-[#2d6a4f]/30 rounded-2xl text-xs font-bold text-[#1b4332] shadow-sm flex items-center justify-center gap-2 hover:bg-[#eef4f0]"
                    >
                      <Camera className="w-4 h-4 text-[#2d6a4f]" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={() => setReportPhoto("https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80")}
                      aria-label="Choose photo from gallery"
                      className="py-3 bg-white border border-[#2d6a4f]/30 rounded-2xl text-xs font-bold text-[#1b4332] shadow-sm flex items-center justify-center gap-2 hover:bg-[#eef4f0]"
                    >
                      <Upload className="w-4 h-4 text-[#2d6a4f]" />
                      <span>From Gallery</span>
                    </button>
                  </div>
                </div>

                <div className="pb-2">
                  <button
                    disabled={!reportPhoto}
                    onClick={() => setCitizenScreen('report_details')}
                    aria-label="Proceed to Next Step"
                    className="w-full py-4 bg-[#1b4332] disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all"
                  >
                    Next: Add Details
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: REPORT FLOW - LOCATION & DETAILS */}
            {citizenScreen === 'report_details' && (
              <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('report_photo')} 
                      aria-label="Back to Photo Capture Step"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Add More Details</h3>
                    <div className="w-9"></div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between px-6 mb-5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#52b788] text-white text-xs font-bold flex items-center justify-center"><Check className="w-4 h-4" /></div>
                      <span className="text-[10px] font-bold text-[#52b788]">Photo</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-[#52b788] mx-2"></div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center">2</div>
                      <span className="text-[10px] font-bold text-[#1b4332]">Details</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gray-300 mx-2"></div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">3</div>
                      <span className="text-[10px] text-gray-400">Review</span>
                    </div>
                  </div>

                  {/* Location Box */}
                  <div className="bg-white border border-[#2d6a4f]/20 rounded-2xl p-3.5 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332] mb-1">
                      <MapPin className="w-4 h-4 text-[#52b788]" />
                      <span>Detected Location</span>
                    </div>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      className="w-full text-xs text-[#2d6a4f] bg-[#eef4f0] p-2 rounded-xl border-none font-medium focus:outline-none"
                    />
                    <div className="mt-2 h-16 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-semibold">
                      [ Interactive GPS Geofence Mock: 28.6139° N, 77.2090° E ]
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5 mb-4">
                    <label className="block text-xs font-bold text-[#1b4332]">Issue Type Category</label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      className="w-full bg-white border border-[#2d6a4f]/30 rounded-2xl p-3 text-xs font-bold text-[#1b4332] focus:outline-none"
                    >
                      <option>Roads & Drainage</option>
                      <option>Waste Management</option>
                      <option>Water Supply</option>
                      <option>Street Lighting</option>
                      <option>Public Infrastructure</option>
                    </select>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-xs font-bold text-[#1b4332]">
                      <label>Detailed Description</label>
                      <span className="text-[10px] text-gray-400">{reportDescription.length}/300</span>
                    </div>
                    <textarea
                      rows="3"
                      maxLength={300}
                      placeholder="Describe severity, landmarks, or danger to pedestrians..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      className="w-full bg-white border border-[#2d6a4f]/30 rounded-2xl p-3 text-xs text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    ></textarea>
                  </div>

                  {/* Demo Simulation Toggle */}
                  <div className="bg-[#eef4f0] p-3 rounded-2xl border border-[#52b788]/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#1b4332]">Simulate Duplicate Detection</span>
                      <p className="text-[10px] text-[#2d6a4f]">Test duplicate AI match modal in step 3</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={simulateDuplicate}
                      onChange={(e) => setSimulateDuplicate(e.target.checked)}
                      className="w-5 h-5 accent-[#1b4332] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => setCitizenScreen('report_review')}
                    aria-label="Proceed to Review Step"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all"
                  >
                    Next: Review Report
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 7: REPORT FLOW - REVIEW & DUPLICATE MODAL */}
            {citizenScreen === 'report_review' && (
              <div className="flex-1 flex flex-col justify-between p-5 relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('report_details')} 
                      aria-label="Back to Details Step"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Review Your Report</h3>
                    <div className="w-9"></div>
                  </div>

                  <div className="bg-white border border-[#2d6a4f]/20 rounded-3xl p-4 shadow-sm space-y-3">
                    <div className="h-36 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={reportPhoto || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"} alt="Captured preview" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#2d6a4f] bg-[#eef4f0] px-2 py-0.5 rounded">
                        {reportCategory}
                      </span>
                      <h4 className="text-sm font-bold text-[#1b4332]">{reportDescription || "Civic hazard reported by citizen."}</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                        {reportLocation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Anonymity Protection: <strong className="text-emerald-700">Active</strong></span>
                      <span>Timestamp: <strong>Just Now</strong></span>
                    </div>
                  </div>
                </div>

                {/* DUPLICATE COMPLAINT DETECTED OVERLAY / MODAL */}
                {simulateDuplicate ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center z-40">
                    <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-w-sm text-center border-2 border-amber-400 animate-in fade-in zoom-in duration-200">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#1b4332]">This complaint already exists!</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          A similar complaint was reported 2 hours ago by another resident within 15 meters of this location.
                        </p>
                      </div>

                      <div className="bg-[#eef4f0] p-3 rounded-2xl text-left border border-[#52b788]/20">
                        <div className="flex justify-between items-center text-xs font-bold text-[#1b4332]">
                          <span>ID: VC-2026-1842</span>
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">In Progress</span>
                        </div>
                        <p className="text-[11px] text-[#2d6a4f] mt-1 line-clamp-1">Hazardous Deep Pothole on Main Arterial Road</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => {
                            setSelectedComplaintId('VC-2026-1842');
                            setCitizenScreen('track_timeline');
                          }}
                          aria-label="Track Existing Complaint VC-2026-1842"
                          className="w-full py-3 bg-[#1b4332] text-white font-bold text-xs rounded-xl shadow-md"
                        >
                          Track Existing Complaint (VC-2026-1842)
                        </button>
                        <button
                          onClick={handleFinalSubmitComplaint}
                          aria-label="Confirm as new unique issue"
                          className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-200"
                        >
                          I confirm this is a separate distinct issue
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="pb-2">
                  <button
                    onClick={handleFinalSubmitComplaint}
                    aria-label="Submit Final Complaint Report"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#52b788]" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 8: REPORT SUBMITTED SUCCESS */}
            {citizenScreen === 'report_submitted' && (
              <div className="flex-1 flex flex-col justify-between p-6 text-center">
                <div className="my-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#52b788] flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1b4332]">Report Submitted!</h2>
                  <p className="text-xs text-[#2d6a4f] max-w-xs mx-auto">
                    Your civic complaint has been cryptographically recorded on the municipal audit ledger.
                  </p>

                  <div className="bg-white border border-[#2d6a4f]/20 rounded-2xl p-4 text-left space-y-2 shadow-sm">
                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <span className="text-gray-500">Complaint ID</span>
                      <span className="font-extrabold text-[#1b4332]">{activeComplaint.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <span className="text-gray-500">Category</span>
                      <span className="font-semibold text-[#1b4332]">{activeComplaint.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <span className="text-gray-500">Blockchain Hash</span>
                      <span className="font-mono text-[10px] text-[#2d6a4f]">{activeComplaint.blockchainHash}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1">
                      <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                      <span>Submitted Anonymously • Personal Identity Protected</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pb-4">
                  <button
                    onClick={() => setCitizenScreen('track_timeline')}
                    aria-label="Track Your Report Progress"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all"
                  >
                    Track Your Report
                  </button>
                  <button
                    onClick={() => setCitizenScreen('home')}
                    aria-label="Return to Home Dashboard"
                    className="w-full py-3 bg-white border border-[#2d6a4f]/25 text-[#1b4332] font-semibold text-xs rounded-2xl hover:bg-[#eef4f0]"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 9: TRACK YOUR REPORT SEARCH */}
            {citizenScreen === 'track_search' && (
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('home')} 
                      aria-label="Back to Home Dashboard"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Track Your Report</h3>
                    <div className="w-9"></div>
                  </div>

                  <p className="text-xs text-[#2d6a4f] mb-4">
                    Enter any 11-digit cryptographic VeriCity Complaint ID to view live officer assignment & verification progress.
                  </p>

                  <div className="bg-white border border-[#2d6a4f]/30 rounded-2xl p-3 shadow-sm flex items-center gap-2 mb-6">
                    <Search className="w-5 h-5 text-[#2d6a4f]" />
                    <input
                      type="text"
                      placeholder="e.g. VC-2026-1842"
                      value={selectedComplaintId}
                      onChange={(e) => setSelectedComplaintId(e.target.value)}
                      className="flex-1 text-sm font-bold text-[#1b4332] focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#eef4f0] rounded-2xl p-4 border border-[#52b788]/20 space-y-2 text-center">
                    <Building2 className="w-8 h-8 text-[#1b4332] mx-auto opacity-70" />
                    <h4 className="text-xs font-bold text-[#1b4332]">Transparent Municipal Accountability</h4>
                    <p className="text-[11px] text-[#2d6a4f] leading-relaxed">
                      Every complaint audit log includes automated SLA timers, inspection notes, and citizen verification windows.
                    </p>
                  </div>
                </div>

                <div className="pb-2">
                  <button
                    onClick={() => setCitizenScreen('track_timeline')}
                    aria-label="Search and Track Complaint"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all"
                  >
                    Track Progress
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 10: COMPLAINT STATUS TIMELINE */}
            {citizenScreen === 'track_timeline' && (
              <div className="flex-1 flex flex-col bg-[#f4f8f5] p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setCitizenScreen('home')} 
                    aria-label="Back to Home Dashboard"
                    className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-sm font-black text-[#1b4332]">Complaint Lifecycle</h3>
                  <button 
                    onClick={() => showToast('Refreshed tracking data')} 
                    aria-label="Refresh Complaint Data"
                    className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Complaint Summary Header Card */}
                <div className="bg-white border border-[#2d6a4f]/20 rounded-2xl p-4 mb-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[#1b4332]">{activeComplaint.id}</span>
                    <span className="text-[10px] font-bold text-[#2d6a4f] bg-[#eef4f0] px-2 py-0.5 rounded">
                      {activeComplaint.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1b4332] leading-snug">{activeComplaint.title}</h4>
                  <p className="text-[11px] text-gray-500">{activeComplaint.location}</p>
                </div>

                {/* VERTICAL TIMELINE */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-300">
                  
                  {/* Step 0 */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#1b4332] border-2 border-white flex items-center justify-center text-white text-[9px]">✓</div>
                    <h5 className="text-xs font-bold text-[#1b4332]">Complaint Registered</h5>
                    <p className="text-[10px] text-gray-500">{activeComplaint.date}</p>
                  </div>

                  {/* Step 1 */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${activeComplaint.timelineStep >= 1 ? 'bg-[#1b4332]' : 'bg-gray-300'}`}>
                      {activeComplaint.timelineStep >= 1 ? '✓' : ''}
                    </div>
                    <h5 className="text-xs font-bold text-[#1b4332]">Officer Assigned</h5>
                    <p className="text-[10px] text-gray-500">{activeComplaint.officer}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${activeComplaint.timelineStep >= 2 ? 'bg-[#1b4332]' : 'bg-gray-300'}`}>
                      {activeComplaint.timelineStep >= 2 ? '✓' : ''}
                    </div>
                    <h5 className="text-xs font-bold text-[#1b4332]">Inspection Pending / In Progress</h5>
                    <p className="text-[10px] text-gray-500">Department SLA target: 24 Hours</p>
                  </div>

                  {/* Step 3 - CLICKABLE REMARK */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${activeComplaint.timelineStep >= 3 ? 'bg-[#1b4332]' : 'bg-gray-300'}`}>
                      {activeComplaint.timelineStep >= 3 ? '✓' : ''}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-[#1b4332]">Inspection Done</h5>
                        <p className="text-[10px] text-gray-500">Site verified by designated engineer</p>
                      </div>
                      <button
                        onClick={() => setCitizenScreen('officer_remark')}
                        aria-label="View Officer Remark"
                        className="text-[10px] font-bold text-[#2d6a4f] bg-[#eef4f0] hover:bg-[#52b788]/20 px-2 py-1 rounded-lg border border-[#2d6a4f]/20 flex items-center gap-1"
                      >
                        <span>View Remarks</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${activeComplaint.timelineStep >= 4 ? 'bg-[#1b4332]' : 'bg-gray-300'}`}>
                      {activeComplaint.timelineStep >= 4 ? '✓' : ''}
                    </div>
                    <h5 className="text-xs font-bold text-[#1b4332]">Verification Pending</h5>
                    <p className="text-[10px] text-gray-500">Awaiting citizen resolution validation</p>
                  </div>

                  {/* Step 5 - CLICKABLE VERIFICATION DONE */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] ${activeComplaint.timelineStep >= 5 ? 'bg-[#52b788]' : 'bg-gray-300'}`}>
                      {activeComplaint.timelineStep >= 5 ? '✓' : ''}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-[#1b4332]">Verification Action Ready</h5>
                        <p className="text-[10px] text-gray-500">Officer submitted repair evidence</p>
                      </div>
                      <button
                        onClick={() => setCitizenScreen('verification_done')}
                        aria-label="Inspect After Photo and Action Verification"
                        className="text-[10px] font-bold text-white bg-[#1b4332] hover:bg-[#081c15] px-2.5 py-1 rounded-lg shadow flex items-center gap-1"
                      >
                        <span>Verify Fix</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 11: OFFICER REMARK VIEW */}
            {citizenScreen === 'officer_remark' && (
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('track_timeline')} 
                      aria-label="Back to Complaint Status Timeline"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Officer Remark</h3>
                    <div className="w-9"></div>
                  </div>

                  <div className="bg-white border border-[#2d6a4f]/20 rounded-3xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1b4332] text-white font-bold flex items-center justify-center text-xs">
                        RK
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1b4332]">{activeComplaint.officer}</h4>
                        <p className="text-[10px] text-gray-500">{activeComplaint.department}</p>
                      </div>
                    </div>

                    <div className="bg-[#eef4f0] p-3 rounded-2xl border border-[#52b788]/20">
                      <span className="text-[10px] font-bold text-gray-400 block mb-1">OFFICIAL REMARK LOG:</span>
                      <p className="text-xs text-[#1b4332] font-medium leading-relaxed">
                        "{activeComplaint.officerRemark || "The issue has been verified on site. Repair machinery dispatched for execution."}"
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-2 text-right">{activeComplaint.officerRemarkDate || "2026-09-11 02:15 PM"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500">Inspection Site Snapshot</span>
                      <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                        <img src={activeComplaint.beforeImage} alt="Site Inspection" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pb-2">
                  <button
                    onClick={() => setCitizenScreen('track_timeline')}
                    aria-label="Back to Track Screen"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg"
                  >
                    Back to Track
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 12: VERIFICATION COMPLETED NOTICE */}
            {citizenScreen === 'verification_done' && (
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('track_timeline')} 
                      aria-label="Back to Complaint Status Timeline"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Verification Ready</h3>
                    <div className="w-9"></div>
                  </div>

                  <div className="bg-white border border-[#52b788]/40 rounded-3xl p-5 shadow-sm text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#52b788] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-[#1b4332]">Officer Completed Work!</h4>
                    <p className="text-xs text-gray-600">
                      The assigned officer marked this issue as resolved and submitted photo evidence.
                    </p>

                    <div className="bg-[#eef4f0] p-3 rounded-2xl border border-[#2d6a4f]/20 text-left space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-[#1b4332]">
                        <span>Verified by:</span>
                        <span>{activeComplaint.officer}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Notice Window:</span>
                        <span className="font-bold text-amber-700">4 Days Remaining</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#2d6a4f] italic">
                      "You have 4 days to confirm the resolution. If no action is taken within 4 days, it will be automatically verified."
                    </p>
                  </div>
                </div>

                <div className="pb-2 space-y-2">
                  <button
                    onClick={() => setCitizenScreen('final_verification')}
                    aria-label="View After Photo & Verify Resolution"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[#52b788]" />
                    <span>View After Photo & Verify</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 13: BEFORE & AFTER COMPARISON / FINAL VERIFICATION */}
            {citizenScreen === 'final_verification' && (
              <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('verification_done')} 
                      aria-label="Back to Verification Notice Screen"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">Before & After Verification</h3>
                    <div className="w-9"></div>
                  </div>

                  <p className="text-xs text-[#2d6a4f] mb-3">Compare original report against officer evidence upload.</p>

                  {/* Side-by-Side Photo Comparison */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">BEFORE PHOTO</span>
                      <div className="h-32 rounded-2xl overflow-hidden bg-slate-200 border border-red-200">
                        <img src={activeComplaint.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">AFTER PHOTO</span>
                      <div className="h-32 rounded-2xl overflow-hidden bg-slate-200 border border-emerald-200">
                        <img 
                          src={activeComplaint.afterImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"} 
                          alt="After" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Query Input Modal / Section */}
                  {showQueryInput ? (
                    <div className="bg-white border-2 border-amber-400 rounded-2xl p-3 mb-4 space-y-2">
                      <h4 className="text-xs font-bold text-[#1b4332]">Write your query or challenge:</h4>
                      <textarea
                        rows="2"
                        placeholder="Explain why this resolution is incomplete..."
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        className="w-full text-xs p-2 bg-gray-50 border rounded-xl focus:outline-none"
                      ></textarea>
                      <button
                        onClick={() => {
                          showToast('Query submitted to Municipal Supervisor!');
                          setShowQueryInput(false);
                          setCitizenScreen('home');
                        }}
                        aria-label="Submit Citizen Query"
                        className="w-full py-2 bg-amber-600 text-white font-bold text-xs rounded-xl"
                      >
                        Submit Query to Supervisor
                      </button>
                    </div>
                  ) : null}

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center mb-4">
                    <p className="text-[10px] text-amber-900 font-semibold">
                      Auto-verification trigger active: 4 days remaining before auto-close.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pb-2">
                  <button
                    onClick={() => {
                      const updated = complaints.map(c => c.id === activeComplaint.id ? { ...c, status: 'Resolved', timelineStep: 6 } : c);
                      setComplaints(updated);
                      setCitizenScreen('report_resolved');
                    }}
                    aria-label="Confirm Resolution as Fixed"
                    className="w-full py-3.5 bg-[#52b788] hover:bg-[#40966d] text-[#081c15] font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes, It's Fixed</span>
                  </button>
                  <button
                    onClick={() => setShowQueryInput(true)}
                    aria-label="Raise a Query or Challenge Fix"
                    className="w-full py-3 bg-white border border-[#2d6a4f]/30 text-[#1b4332] font-semibold text-xs rounded-2xl hover:bg-[#eef4f0]"
                  >
                    Raise a Query / Challenge Fix
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 14: REPORT RESOLVED SUCCESS */}
            {citizenScreen === 'report_resolved' && (
              <div className="flex-1 flex flex-col justify-between p-6 text-center">
                <div className="my-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#52b788] flex items-center justify-center mx-auto shadow-2xl">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1b4332]">Report Resolved!</h2>
                  <p className="text-xs text-[#2d6a4f] max-w-xs mx-auto">
                    Thank you for helping make your city cleaner and safer through VeriCity transparent reporting.
                  </p>

                  <div className="bg-white border border-[#2d6a4f]/20 rounded-2xl p-4 text-left space-y-2 shadow-sm">
                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <span className="text-gray-500">Complaint ID</span>
                      <span className="font-extrabold text-[#1b4332]">{activeComplaint.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <span className="text-gray-500">Resolution Date</span>
                      <span className="font-semibold text-[#1b4332]">2026-09-13</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Final Status</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified Resolved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pb-4">
                  <button
                    onClick={() => setCitizenScreen('home')}
                    aria-label="Return to Home Dashboard"
                    className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-[#081c15] transition-all"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 15: MY REPORTS LIST TAB */}
            {citizenScreen === 'my_reports' && (
              <div className="flex-1 flex flex-col bg-[#f4f8f5]">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCitizenScreen('home')} 
                      aria-label="Back to Home Dashboard"
                      className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center border border-[#2d6a4f]/20 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-black text-[#1b4332]">My Reports</h3>
                    <div className="w-9"></div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2 mb-4">
                    {['All', 'In Progress', 'Resolved'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMyReportsFilter(filter)}
                        aria-label={`Filter reports by ${filter}`}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          myReportsFilter === filter 
                            ? 'bg-[#1b4332] text-white shadow-md' 
                            : 'bg-white text-[#2d6a4f] border border-[#2d6a4f]/20'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Complaint Cards Feed */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {complaints
                      .filter(c => myReportsFilter === 'All' ? true : c.status === myReportsFilter || (myReportsFilter === 'In Progress' && c.status === 'Verification Pending'))
                      .map((comp) => (
                        <div
                          key={comp.id}
                          onClick={() => {
                            setSelectedComplaintId(comp.id);
                            setCitizenScreen('track_timeline');
                          }}
                          className="bg-white border border-[#2d6a4f]/20 rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-[#1b4332]">{comp.id}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                              comp.status === 'Verification Pending' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {comp.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#1b4332]">{comp.title}</h4>
                          <p className="text-[11px] text-gray-500">{comp.location}</p>
                          <div className="flex justify-between items-center pt-2 border-t text-[10px] text-gray-400">
                            <span>{comp.date}</span>
                            <span className="text-[#2d6a4f] font-bold flex items-center gap-1">
                              Track Life-cycle <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Mobile Nav */}
                <div className="bg-white border-t border-[#2d6a4f]/15 px-6 py-3 flex justify-around items-center shrink-0">
                  <button 
                    onClick={() => setCitizenScreen('home')}
                    aria-label="Home Tab"
                    className="flex flex-col items-center gap-1 text-[#2d6a4f]/60 hover:text-[#1b4332]"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Home</span>
                  </button>
                  <button 
                    onClick={() => setCitizenScreen('my_reports')}
                    aria-label="My Reports Tab"
                    className="flex flex-col items-center gap-1 text-[#1b4332]"
                  >
                    <FileText className="w-5 h-5 text-[#1b4332]" />
                    <span className="text-[10px] font-bold">My Reports</span>
                  </button>
                  <button 
                    onClick={() => setCitizenScreen('welcome')}
                    aria-label="Profile Tab"
                    className="flex flex-col items-center gap-1 text-[#2d6a4f]/60 hover:text-[#1b4332]"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Profile</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (currentRole === 'authority') {
    return (
      <div className="min-h-screen bg-[#f4f8f5] font-sans flex flex-col text-[#1b4332]">
        <HeaderQuickSwitcher />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-14 right-8 z-50 bg-[#1b4332] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#52b788] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* AUTHORITY LOGIN SCREEN */}
        {!authorityLoggedIn ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-40px)]">
            {/* Left Side Branding */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#1b4332] via-[#081c15] to-[#2d6a4f] text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#52b788] text-[#081c15] flex items-center justify-center font-black">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">VeriCity</h2>
                  <p className="text-xs text-[#52b788] font-bold tracking-widest uppercase">Municipal Governance Portal</p>
                </div>
              </div>

              <div className="my-12 space-y-6 max-w-lg">
                <h3 className="text-4xl md:text-5xl font-black leading-tight">
                  Transparent Cities. Stronger Communities.
                </h3>
                <p className="text-sm text-[#eef4f0] opacity-90 leading-relaxed">
                  VeriCity Authority Portal equips department heads, field engineers, and civic inspectors with real-time complaint routing, SLA accountability, and tamper-proof evidence validation.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-[#52b788] mb-2" />
                    <h4 className="text-xs font-bold">Verified Records</h4>
                    <p className="text-[10px] opacity-80 mt-1">Immutable audit logs</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <UserCheck className="w-6 h-6 text-[#52b788] mb-2" />
                    <h4 className="text-xs font-bold">Accountable Officials</h4>
                    <p className="text-[10px] opacity-80 mt-1">SLA-bound officer routing</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <BarChart3 className="w-6 h-6 text-[#52b788] mb-2" />
                    <h4 className="text-xs font-bold">Infrastructure GIS</h4>
                    <p className="text-[10px] opacity-80 mt-1">Live civic hotspot maps</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#52b788]/80">Official Municipal Portal • Government of NCT Delhi Branch</p>
            </div>

            {/* Right Side Credentials Form */}
            <div className="lg:col-span-6 bg-white p-8 md:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#2d6a4f] uppercase tracking-wider">Government Authorization</span>
                  <h3 className="text-3xl font-black text-[#1b4332] mt-1">Authority Portal Sign In</h3>
                  <p className="text-xs text-gray-500 mt-1">Enter your municipal officer credentials to access department complaints.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1b4332] mb-1.5">Government Employee ID</label>
                    <input
                      type="text"
                      value={govId}
                      onChange={(e) => setGovId(e.target.value)}
                      className="w-full bg-[#f4f8f5] border border-[#2d6a4f]/20 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1b4332] mb-1.5">Security Password</label>
                    <input
                      type="password"
                      value={govPassword}
                      onChange={(e) => setGovPassword(e.target.value)}
                      className="w-full bg-[#f4f8f5] border border-[#2d6a4f]/20 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-semibold">
                      <input type="checkbox" defaultChecked className="rounded accent-[#1b4332]" />
                      <span>Remember Officer Session</span>
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast("Password reset link dispatched to official email"); }} className="text-[#2d6a4f] font-bold hover:underline">Forgot Credentials?</a>
                  </div>
                </div>

                <button
                  onClick={() => setAuthorityLoggedIn(true)}
                  aria-label="Login to Municipal Authority Dashboard"
                  className="w-full py-4 bg-[#1b4332] hover:bg-[#081c15] text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all"
                >
                  Access Authority Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHORITY DESKTOP MAIN DASHBOARD */
          <div className="flex-1 flex min-h-[calc(100vh-40px)]">
            
            {/* FIXED LEFT SIDEBAR */}
            <aside className="w-64 bg-[#1b4332] text-white p-5 flex flex-col justify-between shrink-0 border-r border-[#52b788]/20">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-xl bg-[#52b788] text-[#081c15] flex items-center justify-center font-black">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black leading-tight">VeriCity</h3>
                    <p className="text-[10px] text-[#52b788] font-bold uppercase tracking-widest">Authority Portal</p>
                  </div>
                </div>

                {/* Department Selector */}
                <div className="bg-[#081c15] p-3 rounded-2xl border border-[#52b788]/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Active Department</span>
                  <select className="w-full bg-transparent text-xs font-bold text-[#52b788] focus:outline-none cursor-pointer">
                    <option>Public Works Dept (PWD)</option>
                    <option>Waste Management Board</option>
                    <option>Water & Sewage Board</option>
                  </select>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {[
                    { label: 'Dashboard', icon: LayoutDashboard },
                    { label: 'Complaints', icon: FileText, count: complaints.length },
                    { label: 'Assigned to Me', icon: Briefcase, count: 2 },
                    { label: 'Pending Actions', icon: Clock, count: 1 },
                    { label: 'Resolved', icon: CheckSquare, count: complaints.filter(c => c.status === 'Resolved').length },
                    { label: 'Analytics', icon: BarChart3 },
                    { label: 'Officers', icon: Users },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setAuthActiveTab(item.label)}
                      aria-label={`Navigate to ${item.label}`}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        authActiveTab === item.label ? 'bg-[#52b788] text-[#081c15] font-extrabold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          authActiveTab === item.label ? 'bg-[#081c15] text-white' : 'bg-white/10 text-gray-300'
                        }`}>
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#52b788] text-[#081c15] font-black flex items-center justify-center text-xs">
                    RK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Rajesh Kumar</p>
                    <p className="text-[10px] text-gray-400">Chief Engineer</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAuthorityLoggedIn(false)}
                  aria-label="Logout of Authority Portal"
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#2d6a4f]/15 shadow-sm">
                <div>
                  <h3 className="text-xl font-black text-[#1b4332]">Good morning, Chief Engineer</h3>
                  <p className="text-xs text-gray-500">NCT Delhi Central Zone • Municipal Infrastructure Operations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search ID, location..."
                      className="pl-9 pr-4 py-2 bg-[#f4f8f5] border border-[#2d6a4f]/20 rounded-xl text-xs font-semibold text-[#1b4332] focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => showToast('Syncing municipal database...')}
                    aria-label="Sync Database"
                    className="p-2.5 bg-[#eef4f0] border border-[#2d6a4f]/20 rounded-xl text-[#1b4332] hover:bg-[#52b788]/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-[#2d6a4f]/15 p-4 rounded-3xl shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Logged</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-[#1b4332]">{complaints.length}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+100% live</span>
                  </div>
                </div>
                <div className="bg-white border border-[#2d6a4f]/15 p-4 rounded-3xl shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Pending Action</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-amber-600">
                      {complaints.filter(c => c.status === 'In Progress').length}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">SLA Active</span>
                  </div>
                </div>
                <div className="bg-white border border-[#2d6a4f]/15 p-4 rounded-3xl shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Verification Pending</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-indigo-600">
                      {complaints.filter(c => c.status === 'Verification Pending').length}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Awaiting Citizen</span>
                  </div>
                </div>
                <div className="bg-white border border-[#2d6a4f]/15 p-4 rounded-3xl shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Resolved</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-600">
                      {complaints.filter(c => c.status === 'Resolved').length}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Audited</span>
                  </div>
                </div>
                <div className="bg-white border border-[#2d6a4f]/15 p-4 rounded-3xl shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Citizen Challenged</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-red-600">0</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">0 Escalated</span>
                  </div>
                </div>
              </div>

              {/* ACCOUNTABILITY PIPELINE VISUALIZATION */}
              <div className="bg-white border border-[#2d6a4f]/15 p-5 rounded-3xl shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1b4332]">Municipal Accountability Pipeline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                  {['Registered', 'Officer Assigned', 'Inspected', 'Action Initiated', 'Evidence Upload', 'Verification Sent', 'Final Resolved'].map((stage, idx) => (
                    <div key={stage} className="bg-[#f4f8f5] p-2.5 rounded-2xl border border-[#52b788]/20 flex flex-col justify-between h-20">
                      <span className="text-[10px] font-bold text-gray-400">0{idx + 1}</span>
                      <span className="text-[11px] font-extrabold text-[#1b4332] leading-tight">{stage}</span>
                      <div className="w-full h-1 bg-[#52b788] rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN COMPLAINTS MANAGEMENT TABLE */}
              <div className="bg-white border border-[#2d6a4f]/15 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-[#1b4332]">Priority Complaints Ledger</h4>
                    <p className="text-xs text-gray-500">Manage officer dispatch, site inspection remarks, & resolution photos.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {['All', 'In Progress', 'Verification Pending', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setAuthFilterStatus(st)}
                        aria-label={`Filter complaints by status ${st}`}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          authFilterStatus === st ? 'bg-[#1b4332] text-white' : 'bg-[#eef4f0] text-[#2d6a4f]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-[#2d6a4f] font-extrabold uppercase text-[10px]">
                        <th className="py-3 px-3">Complaint ID</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Location</th>
                        <th className="py-3 px-3">Assigned Officer</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold">
                      {complaints
                        .filter(c => authFilterStatus === 'All' ? true : c.status === authFilterStatus)
                        .map((comp) => (
                          <tr key={comp.id} className="hover:bg-[#f4f8f5]/60 transition-colors">
                            <td className="py-3.5 px-3">
                              <span className="font-extrabold text-[#1b4332]">{comp.id}</span>
                              <span className="text-[10px] text-gray-400 block font-mono">{comp.blockchainHash}</span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="bg-[#eef4f0] text-[#2d6a4f] px-2 py-0.5 rounded font-bold text-[10px]">
                                {comp.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-gray-600 max-w-xs truncate">{comp.location}</td>
                            <td className="py-3.5 px-3 text-[#1b4332] font-bold">{comp.officer}</td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                                comp.status === 'Verification Pending' ? 'bg-indigo-100 text-indigo-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {comp.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={() => openAuthComplaintModal(comp)}
                                aria-label={`Inspect and Edit Complaint ${comp.id}`}
                                className="px-3 py-1.5 bg-[#1b4332] hover:bg-[#081c15] text-white font-bold text-xs rounded-xl shadow transition-all"
                              >
                                Manage / Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>

            {/* AUTHORITY COMPLAINT EDIT MODAL / DRAWER */}
            {selectedAuthComplaint && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-[#1b4332]">{selectedAuthComplaint.id}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Anonymous Citizen ID
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{selectedAuthComplaint.location}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedAuthComplaint(null)} 
                      aria-label="Close details modal"
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Citizen Uploaded Image & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Citizen Photo Evidence</span>
                      <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 border">
                        <img src={selectedAuthComplaint.beforeImage} alt="Citizen Evidence" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-[#1b4332] block">Description:</span>
                        <p className="text-gray-600 bg-gray-50 p-2.5 rounded-xl border">{selectedAuthComplaint.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#1b4332] block">GPS Coordinates:</span>
                        <p className="text-gray-500 font-mono">{selectedAuthComplaint.coordinates}</p>
                      </div>
                    </div>
                  </div>

                  {/* Officer Controls Form */}
                  <div className="bg-[#f4f8f5] p-4 rounded-2xl border border-[#52b788]/20 space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#1b4332]">Municipal Dispatch Controls</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1b4332] mb-1">Assign Engineer / Officer</label>
                        <input
                          type="text"
                          value={editOfficer}
                          onChange={(e) => setEditOfficer(e.target.value)}
                          className="w-full bg-white border rounded-xl p-2.5 text-xs font-bold text-[#1b4332]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1b4332] mb-1">Update Pipeline Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-white border rounded-xl p-2.5 text-xs font-bold text-[#1b4332]"
                        >
                          <option>In Progress</option>
                          <option>Verification Pending</option>
                          <option>Resolved</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1b4332] mb-1">Inspection & Action Remark</label>
                      <textarea
                        rows="2"
                        value={editRemark}
                        onChange={(e) => setEditRemark(e.target.value)}
                        placeholder="Log inspection observations..."
                        className="w-full bg-white border rounded-xl p-2.5 text-xs text-[#1b4332]"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1b4332] mb-1">Upload Resolved "After" Photo URL</label>
                      <input
                        type="text"
                        value={editAfterPhoto}
                        onChange={(e) => setEditAfterPhoto(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border rounded-xl p-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setSelectedAuthComplaint(null)}
                      aria-label="Cancel Modal Changes"
                      className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateComplaintFromAuthority}
                      aria-label="Save Authority Complaint Updates"
                      className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#081c15] text-white font-extrabold text-xs rounded-xl shadow-md"
                    >
                      Save & Broadcast Status
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    );
  }

  return null;
}