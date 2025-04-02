import { useEffect, useState } from 'react';
import { getTimeRemaining, getDeliveryTime } from '@/lib/utils';

const CountdownSection = () => {
  const [timeRemaining, setTimeRemaining] = useState({ hours: '00', minutes: '00', seconds: '00' });
  
  useEffect(() => {
    const cutoffTime = getDeliveryTime();
    
    const updateCountdown = () => {
      setTimeRemaining(getTimeRemaining(cutoffTime));
    };
    
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="bg-[#F9F5F0] py-6 md:py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block bg-primary text-white px-4 py-2 text-sm font-medium md:text-base">
          Order by 4PM today for next-day delivery
        </div>
        
        <div className="countdown-timer font-medium text-xl md:text-2xl mt-2 font-mono">
          {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
