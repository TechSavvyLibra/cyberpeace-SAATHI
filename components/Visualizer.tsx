
import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isActive: boolean;
  isModelSpeaking: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isActive, isModelSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.8;

      // Draw pulsating circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const pulse = isActive ? Math.sin(Date.now() / 200 - i * 0.5) * 5 : 0;
        const color = isModelSpeaking ? 'rgba(59, 130, 246, 0.2)' : 'rgba(20, 184, 166, 0.2)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.arc(centerX, centerY, (maxRadius * (i + 1) / 3) + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw "waves"
      if (isActive) {
        ctx.beginPath();
        ctx.strokeStyle = isModelSpeaking ? '#3b82f6' : '#14b8a6';
        ctx.lineWidth = 3;
        for (let x = 0; x < canvas.width; x++) {
          const relativeX = (x - centerX) / maxRadius;
          const amp = Math.exp(-relativeX * relativeX * 2) * (isModelSpeaking ? 30 : 15);
          const y = centerY + Math.sin(x * 0.05 + offset) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        offset += isModelSpeaking ? 0.2 : 0.1;
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, isModelSpeaking]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={200} 
      className="w-full h-48 md:h-64 rounded-full"
    />
  );
};

export default Visualizer;
