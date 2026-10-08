'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './LiquidGlassWidget.css';

export default function LiquidGlassWidget() {
  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        className="fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
      >
        <div className="glass-container glass-container--rounded glass-container--large">
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>
          
          <div className="glass-content glass-content--inline pointer-events-none">
            <div className="player">
              <div className="player__thumb">
                <img 
                  className="player__img" 
                  src="https://images.unsplash.com/photo-1619983081593-e2ba5b543168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDk1NzAwNDV8&ixlib=rb-4.1.0&q=80&w=400" 
                  alt="" 
                />
                <div className="player__legend">
                  <h3 className="player__legend__title">Liquid Glass</h3>
                  <span className="player__legend__sub-title">Test Component</span>
                </div>
              </div>

              <div className="player__controls">
                <div className="player__controls__play">
                  <svg viewBox="0 0 448 512" width="24" title="play">
                    <path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                  </svg>
                </div>

                <div className="player__controls__ff">
                  <svg viewBox="0 0 448 512" width="24" title="play" style={{ marginRight: '-4px' }}>
                    <path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                  </svg>
                  <svg viewBox="0 0 448 512" width="24" title="play">
                    <path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SVG Filter Definition */}
      <svg style={{ display: 'none' }}>
        <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}
