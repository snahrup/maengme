import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { useFirstRun } from '../hooks/useFirstRun';

interface CoachMarkStep {
  target: 'start' | 'ring' | 'log';
  title: string;
  description: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

const steps: CoachMarkStep[] = [
  {
    target: 'start',
    title: 'Start Your Session',
    description: 'Tap the START button to begin tracking',
    position: { bottom: '200px', left: '50%' }
  },
  {
    target: 'ring',
    title: 'Track Intensity',
    description: 'Drag the ring to log how you\'re feeling. Long-press for detailed entry.',
    position: { top: '300px', left: '50%' }
  },
  {
    target: 'log',
    title: 'Quick Actions',
    description: 'Use these buttons to log effects, hydration, and notes',
    position: { bottom: '280px', left: '50%' }
  }
];

interface SessionCoachMarksProps {
  onComplete: () => void;
  isVisible: boolean;
}

export const SessionCoachMarks: React.FC<SessionCoachMarksProps> = ({ 
  onComplete, 
  isVisible 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { markSeen } = useFirstRun();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markSeen('hasSeenSessionCoach');
      onComplete();
    }
  };

  const handleSkip = () => {
    markSeen('hasSeenSessionCoach');
    onComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      >
        {/* Spotlight */}
        <motion.div
          animate={{
            ...step.position,
            transform: 'translate(-50%, -50%)'
          }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 70%)',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.8)'
          }}
        />

        {/* Coach mark card */}
        <motion.div
          animate={{
            ...step.position,
            transform: 'translateX(-50%)'
          }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="absolute bg-white rounded-2xl p-6 shadow-2xl max-w-xs"
          style={{ marginTop: step.position.top ? '150px' : '-200px' }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Done' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};