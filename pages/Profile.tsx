import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getJourney } from '../lib/storage';
import { Sprout, Eye, ArrowUpRight, Sparkles, ArrowUp } from 'lucide-react';

export default function Profile() {
  const { code } = useParams();
  const journey = code ? getJourney(code) : null;

  const getBadgeIcon = (level?: string) => {
    if (!level) return <Eye size={12} />;
    if (level === "Just Discovered") return <Sprout size={12} />;
    if (level === "Seeing Results") return <Sparkles size={12} />;
    if (level === "Staying Consistent") return <ArrowUp size={12} />;
    if (level === "Feeling the Shift") return <Eye size={12} />;
    if (level === "Ready to Act") return <ArrowUpRight size={12} />;
    return <Eye size={12} />;
  }

  if (!journey) {
    return (
      <div className="flex-grow flex flex-col p-8 bg-cream text-charcoal justify-center items-center text-center">
        <h1 className="text-2xl font-bold mb-4">Code Not Found</h1>
        <p className="text-sm text-gray-600 mb-8">We couldn't find a scalp journey with that code.</p>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest bg-charcoal text-white px-8 py-3 rounded-full hover:bg-black transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const p1 = journey.phase1;
  const p2 = journey.phase2;
  const p1Date = new Date(p1.date).toLocaleDateString();
  const p2Date = p2 ? new Date(p2.date).toLocaleDateString() : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-grow flex flex-col p-8 bg-cream/30"
    >
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-light leading-tight mb-2">
            Your Scalp <span className="font-bold italic text-gold">Journey</span>
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
            {journey.code}
          </p>
        </div>

        <div className="relative border-l border-gold/30 ml-4 pl-8 pb-8 space-y-12">
          {/* Node 1 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-gold shadow-[0_0_0_4px_rgba(201,168,76,0.2)]"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{p1Date}</p>
            <h3 className="text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">Initial Diagnosis</h3>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-lg font-bold text-gold leading-tight">{p1.profileTitle}</p>
                {p1.awarenessLevel && (
                  <div className="flex items-center gap-1.5 bg-gold/10 text-gold px-2 py-1 rounded-sm border border-gold/20 shrink-0">
                    {getBadgeIcon(p1.awarenessLevel)}
                    <span className="text-[8px] font-bold uppercase tracking-widest">{p1.awarenessLevel}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{p1.description}</p>
            </div>
          </div>

          {/* Node 2: Week 1 */}
          <div className="relative">
            <div className={`absolute -left-[37px] top-0 w-4 h-4 rounded-full border-2 bg-white ${p2 ? 'border-gold bg-gold' : 'border-gray-300'}`}></div>
            {p2 ? (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{p2Date}</p>
                <h3 className="text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">Week 1 Check-in</h3>
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-gold/20 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
                   
                   <div className="flex items-center justify-between gap-2 mb-3">
                     <p className="text-[11px] font-bold text-charcoal uppercase tracking-widest">Your Progress</p>
                     {p2.awarenessLevel && (
                        <div className="flex items-center gap-1.5 bg-gold/10 text-gold px-2 py-1 rounded-sm border border-gold/20 shrink-0">
                          {getBadgeIcon(p2.awarenessLevel)}
                          <span className="text-[8px] font-bold uppercase tracking-widest">{p2.awarenessLevel}</span>
                        </div>
                     )}
                   </div>
                   
                   <p className="text-xs text-charcoal/80 leading-relaxed mb-4 italic pb-4 border-b border-gold/10">
                     "{p2.resultText}"
                   </p>
                   <div className="mt-4 flex flex-col gap-1 items-center text-center">
                     <p className="text-[9px] uppercase tracking-widest font-bold text-gold">#FixTheRoot #ScalpFokus</p>
                     <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-1 mb-4">Your journey, start at the root.</p>
                     <button className="text-[10px] uppercase font-bold tracking-widest border-b border-gold pb-0.5 text-charcoal hover:text-gold transition-colors block mx-auto">
                       Visit a Scalp Pop-up for your full re-scan &rarr;
                     </button>
                   </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-charcoal mb-2 uppercase tracking-wide">Week 1 Check-in</h3>
                <p className="text-xs text-gray-500 mb-4">See how your scalp is responding after 1 week of treating your roots.</p>
                <Link to={`/check-in/${journey.code}`} className="inline-block px-6 py-3 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors shadow-md">
                  Start Check-in &rarr;
                </Link>
              </>
            )}
          </div>

          {/* Node 3: Week 2 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-cream border-2 border-gray-200"></div>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Week 2 Check-in</h3>
            <p className="text-xs text-gray-500 italic">Unlocks next week. Keep applying your tonic directly on your scalp.</p>
          </div>
          
          {/* Node 4: Week 3 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-cream border-2 border-gray-200"></div>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Week 3 Check-in</h3>
            <p className="text-xs text-gray-500 italic">Unlocks in two weeks. Consistency is key.</p>
          </div>
          
          {/* Node 5: Week 4 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-cream border-2 border-gray-200"></div>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Week 4 - Final Scan</h3>
            <p className="text-xs text-gray-500 italic">The target. Prepare for your clinic re-scan to see the difference.</p>
          </div>
        </div>

        {/* Shareable Journey Card */}
        {p2 && (
          <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
            <h4 className="text-[10px] uppercase font-bold text-gold tracking-widest mb-4">My Scalp Journey</h4>
            <p className="text-xl font-bold text-charcoal mb-4">{p1.profileTitle}</p>
            <p className="text-xs text-gray-600 italic mb-6">"{p2.resultText}"</p>
            <div className="flex flex-col items-center gap-1 mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal">#FixTheRoot</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal">#ScalpFokus</span>
            </div>
            <p className="text-xl font-poppins font-bold text-charcoal/20 uppercase tracking-tight">Dove</p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest w-full">
          <span>Share journey &rarr;</span>
          <button className="border-b border-gray-400 hover:text-gold hover:border-gold transition-colors pb-0.5">IG Stories</button>
          <button className="border-b border-gray-400 hover:text-gold hover:border-gold transition-colors pb-0.5">Copy Link</button>
        </div>
      </div>
    </motion.div>
  );
}
