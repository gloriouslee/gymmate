'use client';

import dynamic from 'next/dynamic';

const MainAppContent = dynamic(() => import('@/components/MainAppContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#00F19F] border-t-transparent animate-spin mx-auto shadow-[0_0_20px_rgba(0,241,159,0.3)]" />
        <div className="text-xs font-black tracking-widest text-[#00F19F] uppercase">
          GYM<span className="text-white">MATE</span> PRO LOADING...
        </div>
      </div>
    </div>
  )
});

export default function Page() {
  return <MainAppContent />;
}
