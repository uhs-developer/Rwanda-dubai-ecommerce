import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashSalePopupProps {
  onClose: () => void;
  onShopNow: () => void;
}

export function FlashSalePopup({ onClose, onShopNow }: FlashSalePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  // Show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auto close after 20 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleShopNow = () => {
    onShopNow();
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 pointer-events-none"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50 w-80 pointer-events-auto"
          >
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 text-white hover:bg-white/20 z-10"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header */}
              <div className="p-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-white/20 rounded-full">
                    <Zap className="h-4 w-4" />
                  </div>
                  <Badge className="bg-yellow-400 text-yellow-900">
                    FLASH SALE
                  </Badge>
                </div>
                <h3 className="font-bold text-lg leading-tight">
                  🔥 Up to 50% OFF
                </h3>
                <p className="text-white/90 text-sm">
                  Limited time offer on electronics!
                </p>
              </div>

              {/* Countdown */}
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>Ends in:</span>
                  <div className="flex gap-1">
                    <span className="bg-white/20 px-1 rounded font-mono">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="bg-white/20 px-1 rounded font-mono">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="bg-white/20 px-1 rounded font-mono">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-white text-red-600 hover:bg-white/90"
                  onClick={handleShopNow}
                >
                  Shop Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleClose}
                >
                  Maybe Later
                </Button>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-xl pointer-events-none">
                <motion.div
                  className="absolute inset-0 border-2 border-white/30 rounded-xl"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}