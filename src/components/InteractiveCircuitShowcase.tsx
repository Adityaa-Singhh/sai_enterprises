import React, { useState } from 'react';
import {
  Zap,
  ToggleLeft,
  ShieldCheck,
  Lightbulb,
  Sun,
  Eye,
  Activity,
  CheckCircle,
  Gauge,
  Cpu,
  Power,
  Fan
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';

const Icons = {
  Zap,
  ToggleLeft,
  ShieldCheck,
  Lightbulb,
  Sun,
  Eye,
  Activity,
  CheckCircle,
  Gauge,
  Cpu,
  Power,
  Fan
};

const CIRCUIT_ICONS: Record<string, any> = {
  Power,
  Sun,
  Fan,
  ShieldCheck
};

export const InteractiveCircuitShowcase: React.FC = () => {
  // State for modular switches
  const [switches, setSwitches] = useState({
    main: true,
    lighting: true,
    hvac: false,
    surge: true,
  });

  // State for lighting color temperature (CCT in Kelvin)
  const [cct, setCct] = useState<number>(4000);
  const [dimming, setDimming] = useState<number>(85);

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute live electrical telemetry
  const isMasterOn = switches.main;
  const lightingActive = isMasterOn && switches.lighting;
  const hvacActive = isMasterOn && switches.hvac;
  const surgeActive = switches.surge;

  const totalWattage = (
    (lightingActive ? Math.round((dimming / 100) * 180) : 0) +
    (hvacActive ? 2200 : 0) +
    (isMasterOn ? 45 : 0)
  );

  const currentAmps = isMasterOn ? (totalWattage / 230).toFixed(2) : '0.00';
  const voltage = isMasterOn ? (230 + Math.sin(Date.now() / 1000) * 1.2).toFixed(1) : '0.0';

  // Compute color temperature hex for luminaire
  const getCctColor = (temp: number) => {
    if (temp <= 3000) return '#ffaa44'; // Warm Amber
    if (temp <= 4500) return '#fff3e0'; // Natural Daylight
    return '#cceeff'; // Cool White
  };

  const cctColor = getCctColor(cct);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 text-volt text-xs font-bold uppercase tracking-wider mb-3">
            <Icons.Zap className="w-3.5 h-3.5" />
            <span>Interactive Hardware Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Test Real-Time Circuit Dynamics
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 font-normal leading-relaxed">
            Interact with simulated modular switches, tune commercial LED color temperatures, and inspect live load telemetry powered by Sai Enterprises distribution components.
          </p>
        </div>

        {/* Master Power Status */}
        <div className="flex items-center gap-3 p-2 px-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-300">System Bus:</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
            isMasterOn 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMasterOn ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {isMasterOn ? '230V ENERGIZED' : 'BUS OFFLINE'}
          </span>
        </div>
      </div>

      {/* Bento Grid Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Physical Modular Switch Bank (5 cols) */}
        <SpotlightCard className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-volt/15 border border-volt/30 flex items-center justify-center text-volt">
                  <Icons.ToggleLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Modular Switchboard</h3>
                  <span className="text-xs text-slate-400">Tactile Rocker Controls (16AX Rated)</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-volt bg-volt/10 px-2 py-0.5 rounded border border-volt/20">
                IS 3854
              </span>
            </div>

            {/* Switch Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'main', label: 'Main Bus 32A', desc: 'Master Line Isolator', icon: 'Power' },
                { key: 'lighting', label: 'LED Luminaire', desc: 'CCT Tunable Circuit', icon: 'Sun' },
                { key: 'hvac', label: 'Heavy Load / HVAC', desc: '2.2 kW Motor Circuit', icon: 'Fan' },
                { key: 'surge', label: 'Surge Varistor', desc: 'SPD Class II Protection', icon: 'ShieldCheck' },
              ].map(item => {
                const isOn = switches[item.key as keyof typeof switches];
                const IconComponent = CIRCUIT_ICONS[item.icon] || Zap;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleSwitch(item.key as keyof typeof switches)}
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                      isOn
                        ? 'bg-gradient-to-b from-white/15 to-white/5 border-volt/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                        : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    {/* Rocker Switch Top Indicator */}
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isOn ? 'bg-volt text-dark-0 shadow-md' : 'bg-white/10 text-slate-400'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isOn 
                          ? 'bg-emerald-400 shadow-[0_0_8px_#4ade80]' 
                          : 'bg-slate-600'
                      }`} />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-volt transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        {item.desc}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                      <span className="font-mono text-slate-400">STATE:</span>
                      <span className={`font-bold ${isOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isOn ? 'ENGAGED [ON]' : 'DISENGAGED [OFF]'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-400" />
              Silver Inlay Contacts (100,000 Clicks)
            </span>
            <span className="text-volt font-semibold">10-Year Warranty</span>
          </div>
        </SpotlightCard>

        {/* Card 2: Interactive CCT Lighting Tuner (7 cols) */}
        <SpotlightCard className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Luminaire Light Glow */}
          <AnimatePresence>
            {lightingActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: dimming / 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl mix-blend-screen transition-colors duration-500"
                style={{ backgroundColor: cctColor }}
              />
            )}
          </AnimatePresence>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Icons.Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smart CCT Luminaire Tuner</h3>
                  <span className="text-xs text-slate-400">Continuous Color Temperature (2700K – 6500K)</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                lightingActive 
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' 
                  : 'bg-white/5 text-slate-500 border border-white/5'
              }`}>
                <span className={`w-2 h-2 rounded-full ${lightingActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                {lightingActive ? `${dimming}% LUMENS ACTIVE` : 'LIGHTING OFF'}
              </span>
            </div>

            {/* Luminaire Visual Preview Box */}
            <div className="relative rounded-2xl p-6 border border-white/10 mb-6 transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{
                background: lightingActive
                  ? `radial-gradient(circle at center, ${cctColor}22 0%, rgba(17,17,24,0.6) 80%)`
                  : 'rgba(0,0,0,0.2)',
              }}
            >
              {/* Virtual Luminaire Bulb Representation */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl"
                  style={{
                    backgroundColor: lightingActive ? cctColor : '#1e293b',
                    borderColor: lightingActive ? cctColor : 'rgba(255,255,255,0.1)',
                    boxShadow: lightingActive ? `0 0 35px ${cctColor}88` : 'none',
                  }}
                >
                  <Icons.Sun
                    className="w-8 h-8 transition-colors duration-500"
                    style={{ color: lightingActive ? '#0a0a0f' : '#64748b' }}
                  />
                </div>

                <div>
                  <span className="text-lg font-extrabold text-white block">
                    {cct <= 3000 ? 'Warm Ambient (2700K)' : cct <= 4500 ? 'Natural Daylight (4000K)' : 'Cool Precision (6500K)'}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    High CRI 95+ Commercial COB Downlight
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-volt block">{cct}K</span>
                <span className="text-[11px] text-slate-400 font-mono">COLOR SPECTRUM</span>
              </div>
            </div>

            {/* CCT & Dimming Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Color Temperature (CCT)</span>
                  <span className="text-volt font-bold">{cct} Kelvin</span>
                </div>
                <input
                  type="range"
                  min="2700"
                  max="6500"
                  step="100"
                  disabled={!lightingActive}
                  value={cct}
                  onChange={(e) => setCct(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-amber-400 via-orange-100 to-sky-300 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>2700K (Warm)</span>
                  <span>4000K (Daylight)</span>
                  <span>6500K (Cool)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>PWM Dimming Level</span>
                  <span className="text-cyan-400 font-bold">{dimming}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  disabled={!lightingActive}
                  value={dimming}
                  onChange={(e) => setDimming(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Icons.Eye className="w-4 h-4 text-volt" />
              Flicker-Free Driver • THD &lt; 10%
            </span>
            <span className="text-xs font-bold text-emerald-400">
              Energy Efficiency: A++
            </span>
          </div>
        </SpotlightCard>

        {/* Card 3: Live Electrical Bus Telemetry (12 cols) */}
        <SpotlightCard className="lg:col-span-12 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
                <span>Active Total Power</span>
                <Icons.Activity className="w-4 h-4 text-volt" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalWattage}</span>
                <span className="text-xs font-bold text-volt ml-1">Watts</span>
              </div>
              <span className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                <Icons.CheckCircle className="w-3 h-3" /> Real-time Metering
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
                <span>Line Current</span>
                <Icons.Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{currentAmps}</span>
                <span className="text-xs font-bold text-cyan-400 ml-1">Amps</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                Line Voltage: {voltage}V
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
                <span>Surge Protection (SPD)</span>
                <Icons.ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className={`text-lg sm:text-xl font-bold ${surgeActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {surgeActive ? 'Protected (40kA)' : 'UNGUARDED'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2">
                Response &lt; 25ns
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
                <span>System Health</span>
                <Icons.Cpu className="w-4 h-4 text-volt" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                  Optimal (50.0 Hz)
                </span>
              </div>
              <span className="text-[11px] text-volt mt-2 font-medium">
                Power Factor: 0.98 pf
              </span>
            </div>

          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};
