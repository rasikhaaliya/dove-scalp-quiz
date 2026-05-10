import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-grow flex flex-col p-8 pb-12 bg-cream text-charcoal"
    >
      <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-4xl font-light leading-tight mb-8">
          Why <br/>
          <span className="font-bold italic text-gold">#ScalpFokus?</span>
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          81% of Indonesian Gen Y have hair fall, only 31% treat the scalp. 
          The gap is not effort &#8212; it's awareness. 
        </p>

        <p className="text-sm text-gray-600 mb-10 leading-relaxed">
          Dove Biotin Hair Tonic is <span className="font-bold text-gold">Step 4</span>: 
          the missing piece of a routine you already have.
        </p>
        
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal">#FixTheRoot</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal">#ScalpFokus</span>
        </div>

        <Link 
          to="/" 
          className="bg-charcoal text-white text-center text-xs font-bold uppercase tracking-widest w-full py-4 rounded-full shadow-lg hover:bg-black transition-colors"
        >
          Return to Quiz &rarr;
        </Link>
      </div>
    </motion.div>
  );
}
