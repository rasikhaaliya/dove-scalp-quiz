import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sprout, Eye, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { savePhase1 } from '../lib/storage';

const QUESTIONS = [
  {
    question: "How would you describe your daily activity?",
    options: [
      "I work out regularly or wear hijab daily — my scalp sweats a lot",
      "I'm mostly at a desk — high stress, low movement",
      "My routine is mostly about looking good — styling, products, getting ready"
    ]
  },
  {
    question: "How often do you wash your hair?",
    options: [
      "Every day or after every workout",
      "Every 2-3 days",
      "Once a week or less"
    ]
  },
  {
    question: "What does your daily hair styling look like?",
    options: [
      "Minimal — I tie it up or leave it natural",
      "Occasional heat — straightener or curler a few times a week",
      "Daily heat styling — catok or curler every single morning"
    ]
  },
  {
    question: "How would you describe your stress level over the past few months?",
    options: [
      "Low — pretty balanced",
      "Medium — busy but manageable",
      "High — deadlines, late nights, a lot on my plate"
    ]
  },
  {
    question: "When you think about your scalp, what does it feel like most of the time?",
    options: [
      "Tight and dry — sometimes itchy",
      "Oily or heavy — especially by end of day",
      "Normal — I don't really notice it",
      "Sensitive — easily irritated or flaky"
    ]
  },
  {
    question: "Have you ever looked at or thought about the condition of your scalp?",
    options: [
      "Never — I just focus on my hair",
      "Sometimes — when something feels off",
      "I've noticed something but ignored it",
      "Yes — I've been meaning to do something about it"
    ]
  },
  {
    question: "How much hair fall are you noticing?",
    options: [
      "A little — normal shedding",
      "More than usual — I notice it on my pillow or in the shower",
      "A lot — it's been bothering me for a while"
    ]
  },
  {
    question: "What does your current scalp care routine look like?",
    options: [
      "Shampoo only",
      "Shampoo and conditioner",
      "Shampoo, conditioner, and maybe a hair mask sometimes",
      "I use hair tonic or scalp treatment already"
    ]
  }
];

const PROFILES = {
  OILY: {
    title: "Oily Scalp",
    headline: "Excess sebum is suffocating your hair roots.",
    description: "Your active lifestyle or frequent sweating leads to excess oil buildup. This congestion weakens your hair follicles over time, leading to premature hair fall.",
    science: "Sebum buildup disrupts the scalp microbiome and blocks follicles, preventing healthy hair growth.",
    recommendation: "Dove Micellar Shampoo + Dove Micellar Conditioner + Dove Micellar Hair Tonic"
  },
  DRY: {
    title: "Dry Scalp",
    headline: "Your scalp barrier is dehydrated and stressed.",
    description: "Lack of moisture and high stress levels have weakened your scalp's protective barrier. This dehydration causes your roots to loosen their grip.",
    science: "A compromised scalp barrier leads to moisture loss and inflammation, directly impacting hair anchorage.",
    recommendation: "Dove Biotin Shampoo + Dove Biotin Conditioner + Dove Biotin Hair Mask + Dove Biotin Hair Tonic"
  },
  HEAT: {
    title: "Heat-Stressed Scalp",
    headline: "You do everything for your hair. Your scalp has been waiting.",
    description: "Frequent heat styling and product layering are taking a toll. While your strands may look good, your scalp environment has become sensitive and vulnerable.",
    science: "Thermal stress from frequent styling weakens the scalp environment, making it sensitive and impacting the root's ability to hold onto strands.",
    recommendation: "Dove Hyaluron Shampoo + Dove Hyaluron Conditioner + Dove Biotin Hair Tonic"
  },
  OILY_HEAT: {
    title: "Oily & Heat-Stressed Scalp",
    headline: "Your scalp is fighting both congestion and thermal stress.",
    description: "A combination of frequent heat styling and active sebum production creates a challenging environment. Your follicles are both blocked by oil and prone to dandruff.",
    science: "The combination of excess sebum and heat damage severely weakens follicle anchorage.",
    recommendation: "Dove Niacinamide Shampoo + Dove Niacinamide Conditioner + Dove Micellar Hair Tonic"
  },
  DRY_HEAT: {
    title: "Dry & Heat-Stressed Scalp",
    headline: "Your scalp is deeply dehydrated and heat damaged.",
    description: "Frequent styling on top of an already dry scalp barrier accelerates root weakening. Your scalp needs intense hydration and structural support.",
    science: "Extreme moisture loss combined with thermal stress leads to significant compromised root health.",
    recommendation: "Dove Biotin Shampoo + Dove Biotin Conditioner + Dove Biotin Hair Mask + Dove Biotin Hair Tonic"
  }
};

export default function Home() {
  const [view, setView] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [journeyCode, setJourneyCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const navigate = useNavigate();

  const calculateResult = (ans: number[]) => {
    let oily = 0;
    let dry = 0;
    let heat = 0;

    if (ans[0] === 0) oily += 1;
    else if (ans[0] === 1) dry += 1;
    else if (ans[0] === 2) heat += 1;

    if (ans[1] === 0) oily += 1;
    else if (ans[1] === 1) dry += 1;
    else if (ans[1] === 2) dry += 1;

    if (ans[2] === 1) heat += 1;
    else if (ans[2] === 2) heat += 2;

    if (ans[3] === 1) dry += 1;
    else if (ans[3] === 2) { dry += 2; oily += 1; }

    if (ans[4] === 0) dry += 2;
    else if (ans[4] === 1) oily += 2;
    else if (ans[4] === 3) heat += 1;

    let resultObj;
    let isDry = false, isOily = false;

    if (oily > 0 && heat > 0 && oily >= dry) {
      resultObj = PROFILES.OILY_HEAT; isOily = true;
    } else if (dry > 0 && heat > 0) {
      resultObj = PROFILES.DRY_HEAT; isDry = true;
    } else if (heat >= oily && heat >= dry) {
      resultObj = PROFILES.HEAT;
    } else if (oily >= dry) {
      resultObj = PROFILES.OILY; isOily = true;
    } else {
      resultObj = PROFILES.DRY; isDry = true;
    }

    const awarenessAns = ans[5];
    let perceptionText = "";
    if (isDry) {
      if (awarenessAns < 2) perceptionText = "You've never had to think about your scalp before — and that's exactly why it's been quietly struggling. The good news: now you know where to start.";
      else perceptionText = "You've had a feeling something was off. You were right — and now you know exactly what to do about it.";
    } else if (isOily) {
      if (awarenessAns < 2) perceptionText = "Hair fall from stress is one of the most common things women experience — and one of the least talked about. You're not imagining it. Your scalp has been carrying it.";
      else perceptionText = "You already sensed something wasn't right. Stress has a way of showing up in the last place we think to look — your scalp.";
    } else {
      if (awarenessAns < 2) perceptionText = "You've put so much thought into your hair. It just never occurred to anyone to look underneath. That changes now.";
      else perceptionText = "You've noticed. You've wondered. Now you have the answer — and it's simpler than you thought. One step. Your scalp. That's it.";
    }

    let awarenessLevel = "Starting to Notice";
    if (awarenessAns === 0) awarenessLevel = "Just Discovered";
    else if (awarenessAns === 3) awarenessLevel = "Ready to Act";

    return {
      resultObj: {
        ...resultObj,
        description: `${resultObj.description} ${perceptionText}`
      },
      awarenessLevel
    };
  };

  const handleNext = () => {
    if (selected === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selected;
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const { resultObj, awarenessLevel } = calculateResult(newAnswers);

      const code = savePhase1({
        profileTitle: resultObj.title,
        profileHeadline: resultObj.headline,
        description: resultObj.description,
        awarenessLevel,
        date: new Date().toISOString()
      });
      setJourneyCode(code);
      setView('result');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim().length > 0) {
      navigate(`/profile/${codeInput.trim().toUpperCase()}`);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setSelected(answers[prevIdx] ?? null);
    } else {
      setView('start');
      setSelected(null);
    }
  };

  if (view === 'start') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex-grow flex flex-col justify-center p-8 bg-cream text-charcoal h-full relative"
      >
        <div className="max-w-sm w-full mx-auto relative z-10 flex flex-col gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-light leading-tight">
              Your scalp is the <br/>
              <span className="font-bold italic text-gold">skin</span> you've been <br/>
              ignoring.
            </h1>
            <p className="text-gray-600 leading-relaxed text-sm">
              Answer quick questions to find out what's actually happening on yours.
            </p>
          </div>
          
          <div className="space-y-4 mt-4">
            <button 
              onClick={() => setView('quiz')}
              className="w-full py-4 bg-charcoal text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-colors"
            >
              Discover your scalp condition &rarr;
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">
              Initial Diagnosis &bull; Takes less than 2 minutes 
            </p>
            
            <form onSubmit={handleCodeSubmit} className="mt-10 p-5 bg-white border border-gray-200 rounded-2xl relative z-10 flex flex-col gap-3 shadow-sm">
              <p className="text-xs font-bold text-charcoal text-center">Already have a Scalp Code?</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="SCALP-XXXXX" 
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-gold transition-colors text-charcoal uppercase"
                />
                <button type="submit" className="px-6 py-3 bg-gold text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#b5953f] transition-colors whitespace-nowrap">
                  Track &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  const getBadgeIcon = (level: string) => {
    if (level === "Just Discovered") return <Sprout size={14} />;
    if (level === "Starting to Notice") return <Eye size={14} />;
    return <ArrowUpRight size={14} />;
  }

  if (view === 'result') {
    const { resultObj: result, awarenessLevel } = calculateResult(answers);
    
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex-grow flex flex-col bg-cream/30"
      >
        <div className="p-8 pt-8 pb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full flex-col flex items-center"
          >
            {/* Shareable Result Card Preview */}
            <div className="relative w-[340px] max-w-full mb-10">
              <div className="absolute -top-3 -left-3 text-[9px] uppercase tracking-widest font-bold bg-gold text-white px-3 py-1 rounded-full z-10 shadow-sm">
                Result Preview
              </div>
              <div className="w-full bg-white border border-gold/30 p-8 shadow-xl rounded-sm text-center relative overflow-hidden">
                {/* Decorative Gold Lines */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-gold/20 -mr-12 -mt-12 rounded-full"></div>
                
                <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-gold block mb-2">The Diagnosis</span>
                <h3 className="text-2xl font-bold text-charcoal mb-4 tracking-tight">{result.title}</h3>
                
                <div className="w-12 h-[1px] bg-gold mx-auto mb-6"></div>
                
                <p className="text-xs text-gray-500 leading-relaxed italic mb-8">
                  "{result.headline}"
                </p>
                
                {/* Highlighted Product Recommendation */}
                <div className="bg-charcoal text-white p-6 rounded-xl mb-6 text-left relative overflow-hidden shadow-xl border border-gold/40 transform transition-transform hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -translate-x-1/2 translate-y-1/2"></div>
                  
                  <div className="relative z-10">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-gold mb-4 flex items-center gap-1.5 border-b border-gold/20 pb-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Recommended Scalp Routine
                    </span>
                    
                    <div className="space-y-3">
                      {result.recommendation.split(' + ').map((product, idx) => {
                        const isTonic = product.toLowerCase().includes('tonic');
                        return (
                          <div key={idx} className={`p-4 rounded-lg border backdrop-blur-sm ${isTonic ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/10'}`}>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[#e8d28c] mb-1">
                              Step {idx + 1} {isTonic && '— The Root Fix'}
                            </p>
                            <h4 className="text-sm font-bold text-white font-poppins tracking-tight">{product}</h4>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-left">
                  <div>
                    <span className="text-[14px] font-bold italic text-charcoal tracking-tight font-poppins">Dove</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-gold">#ScalpFokus</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unique Scalp Code Element */}
            {journeyCode && (
              <div className="w-full max-w-sm mb-10 p-6 bg-charcoal text-white rounded-2xl shadow-lg relative overflow-hidden flex flex-col items-center">
                <div className="absolute top-0 right-0 w-24 h-24 border-t-[10px] border-r-[10px] border-gold/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">Your Scalp Code</h3>
                <p className="text-3xl font-poppins font-bold tracking-widest mb-3">{journeyCode}</p>
                <div className="w-full h-px bg-white/20 mb-4"></div>
                <p className="text-xs text-center text-white/80 leading-relaxed">
                  Screenshot it &mdash; you'll need it to track your weekly progress.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-sm text-center">
              {result.description}
            </p>

            <div className="flex flex-col items-center mb-10 w-full max-w-sm space-y-2">
              <div className="flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full border border-gold/20">
                {getBadgeIcon(awarenessLevel)}
                <span className="text-[10px] font-bold uppercase tracking-widest">{awarenessLevel}</span>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                Your #ScalpFokus level — this will change as you progress.
              </p>
            </div>
            
            <div className="pl-4 border-l-2 border-gold/30 mb-10 py-1 max-w-sm w-full mx-auto">
              <p className="text-xs italic text-gray-500 leading-relaxed">
                <span className="font-bold text-charcoal block mb-1">Science Fact:</span>
                {result.science}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-10 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <span>Share Result &rarr;</span>
              <button className="border-b border-gray-400 hover:text-gold hover:border-gold transition-colors pb-0.5">IG Stories</button>
              <button className="border-b border-gray-400 hover:text-gold hover:border-gold transition-colors pb-0.5">Copy Link</button>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Link to={`/profile/${journeyCode}`} className="w-full bg-charcoal text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full shadow-lg hover:bg-black transition-colors block text-center">
                Go to personal profile &rarr;
              </Link>
              <button className="w-full bg-white text-charcoal border border-gray-200 font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-gray-50 transition-colors">
                Find Diagnostic Pop-up &rarr;
              </button>
            </div>
            
            <div className="mt-8 text-center flex flex-col gap-2">
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Campaign</span>
               <Link to="/about" className="text-[11px] font-bold border-b border-gold pb-0.5 hover:text-gold transition-colors text-charcoal w-max mx-auto">
                 Why Biotin? &rarr;
               </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const q = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  return (
    <div className="flex-grow flex flex-col bg-cream relative overflow-hidden">
      <div className="w-full flex-grow flex flex-col overflow-y-auto px-8 pt-8 pb-12 relative z-10">
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Diagnosis &bull; Q0{currentIdx + 1} of 0{QUESTIONS.length}</span>
            <span className="text-[10px] text-gray-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-white rounded-full">
            <motion.div 
              className="h-full bg-gold rounded-full"
              initial={{ width: `${(currentIdx / QUESTIONS.length) * 100}%` }}
              animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col flex-grow"
          >
            <button 
              onClick={handleBack} 
              className="text-gold text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1 w-max opacity-80 hover:opacity-100 transition-opacity"
            >
              &larr; Back
            </button>
            <h2 className="text-xl font-semibold leading-snug mb-8 text-charcoal">
              {q.question}
            </h2>
            
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const optParts = opt.split(" — ");
                const title = optParts[0];
                const subtitle = optParts[1] || "";

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`text-left w-full p-4 rounded-2xl transition-all duration-200 
                      ${isSelected 
                        ? 'border-2 border-gold bg-gold/5 shadow-sm' 
                        : 'border border-gray-200 bg-white hover:border-gold/50'}`}
                  >
                    <p className={`text-xs font-semibold ${isSelected ? 'text-charcoal' : 'text-gray-800'}`}>
                      {title}
                    </p>
                    {subtitle && (
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                        {subtitle}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8">
              <AnimatePresence>
                {selected !== null && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    onClick={handleNext}
                    className="w-full py-4 bg-charcoal text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-colors"
                  >
                    {currentIdx === QUESTIONS.length - 1 ? 'Get My Result \u2192' : 'Next Question \u2192'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
