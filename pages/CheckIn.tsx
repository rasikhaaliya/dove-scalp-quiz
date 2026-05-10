import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJourney, savePhase2 } from '../lib/storage';

const QUESTIONS = [
  {
    question: "Compared to when you started, how is your hair fall?",
    options: ["Noticeably better — less on my brush and pillow", "Slightly better — still improving", "About the same — still figuring it out"]
  },
  {
    question: "How does your scalp feel after using the tonic?",
    options: ["Refreshed, lighter, less itchy", "Starting to feel different — still adjusting", "Not sure yet — need more time"]
  },
  {
    question: "How does your scalp feel compared to when you first started?",
    options: ["Noticeably different — lighter, less tight or oily", "Slightly different — hard to tell but something shifted", "About the same — not sure yet"]
  },
  {
    question: "How consistently have you been applying the tonic directly on your scalp?",
    options: ["Every day — it's part of my routine now", "Most days — still building the habit", "Inconsistently — I keep forgetting"]
  }
];

export default function CheckIn() {
  const { code } = useParams();
  const navigate = useNavigate();
  const journey = code ? getJourney(code) : null;
  
  const [view, setView] = useState<'start' | 'quiz'>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!journey && code) {
      navigate('/');
    }
  }, [journey, code, navigate]);

  if (!journey) return null;

  const handleNext = () => {
    if (selected === null || !code) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selected;
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let aCount = 0;
      let cCount = 0;
      newAnswers.forEach(ans => {
        if (ans === 0) aCount++;
        if (ans === 2) cCount++;
      });

      let resultText = "";
      let resultType: 'A' | 'B' | 'C' = 'B';
      
      if (aCount === 4) {
        resultText = "Your scalp is genuinely responding. What you're feeling is real — and it's just the beginning. Come in for a full re-scan at the nearest Dove Scalp Pop-up to see the difference on screen.";
        resultType = 'A';
      } else if (cCount >= 3) {
        resultText = "It's okay. Habits take time and scalp changes take weeks, not days. Try applying the tonic right after your shower — make it Step 4, every single time. Your scalp is ready when you are.";
        resultType = 'C';
      } else {
        resultText = "Progress isn't always dramatic at first — but the shift is happening. Stay consistent. Your scalp is adjusting to being taken care of for the first time.";
        resultType = 'B';
      }

      const perceptionAns = newAnswers[2];
      let p2Awareness = "Staying Consistent";
      if (perceptionAns === 0) p2Awareness = "Seeing Results";
      else if (perceptionAns === 1) p2Awareness = "Feeling the Shift";

      savePhase2(code, {
        resultText,
        resultType,
        awarenessLevel: p2Awareness,
        date: new Date().toISOString()
      });

      navigate(`/profile/${code}`);
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
        className="flex-grow flex flex-col p-8 bg-cream text-charcoal justify-center relative"
      >
        <div className="max-w-sm mx-auto w-full flex flex-col items-center text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Week 1 Progress Check</p>
          <h1 className="text-4xl font-light leading-tight mb-4">
            Welcome <span className="font-bold italic text-gold">back.</span>
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Let's see how your scalp has been responding since you started treating your <span className="font-bold text-gray-800">{journey.phase1.profileTitle}</span> on {new Date(journey.phase1.date).toLocaleDateString()}.
          </p>
          <button 
            onClick={() => setView('quiz')}
            className="w-full bg-charcoal text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full shadow-lg hover:bg-black transition-colors"
          >
            Start Check-in &rarr;
          </button>
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
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Week 1 &bull; Q0{currentIdx + 1} of 0{QUESTIONS.length}</span>
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

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
                      {opt.split(" — ")[0]}
                    </p>
                    {opt.split(" — ")[1] && (
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                        {opt.split(" — ")[1]}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleNext}
                    className="w-full bg-charcoal text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-colors"
                  >
                    {currentIdx === QUESTIONS.length - 1 ? 'See Result \u2192' : 'Next \u2192'}
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
