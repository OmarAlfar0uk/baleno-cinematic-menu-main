import { useEffect } from "react";
import { motion } from "framer-motion";
import balenoLogo from "@/assets/baleno-logo.png";

interface OpeningCurtainProps {
  onComplete: () => void;
}

const OpeningCurtain = ({ onComplete }: OpeningCurtainProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(3px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 z-[120] pointer-events-none overflow-hidden bg-[#110803]"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.35, duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <motion.div
          initial={{ x: 0, scaleX: 1 }}
          animate={{ x: "-103%", scaleX: 0.985 }}
          transition={{ delay: 1.0, duration: 1.55, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(120deg, #1a0c05 0%, #2c1308 35%, #140903 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 10px)" }} />
        </motion.div>

        <motion.div
          initial={{ x: 0, scaleX: 1 }}
          animate={{ x: "103%", scaleX: 0.985 }}
          transition={{ delay: 1.0, duration: 1.55, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background:
              "linear-gradient(240deg, #1a0c05 0%, #2c1308 35%, #140903 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 10px)" }} />
        </motion.div>

        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#d9b468] to-transparent opacity-80" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
        transition={{ duration: 2.8, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      >
        <motion.img
          src={balenoLogo}
          alt="Baleno logo"
          className="w-24 h-24 object-contain"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <h1 className="text-[#d9b468] font-heading text-3xl md:text-5xl tracking-[0.2em] uppercase">
          Baleno
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default OpeningCurtain;
