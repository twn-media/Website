/**
 * TWN Media - Interactive High-Motion Wave Engine
 * Feine, lebendige Vektor-Wellen mit deutlicher Bewegung,
 * intensiver Mausreaktivität und flüssigem GSAP ScrollTrigger Scrubbing.
 * Leitmotiv: "Wir bringen Ihr Business auf die nächste Welle."
 */

(function () {
  'use strict';

  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Animation & Dynamic State
  const waveState = {
    scrollProgress: 0,
    topRotation: 0,
    topMorph: 0,
    bottomRotation: 0,
    bottomMorph: 0,
    globalFlow: 0,
    
    // Maus-Tracking mit hoher Elastizität & spürbarer Auslenkung
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    mouseVelocity: 0,
    lastMouseX: 0,
    lastMouseY: 0,
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Aktive Mauserfassung mit Geschwindigkeitsberechnung
  window.addEventListener('mousemove', (e) => {
    // Relative Verschiebung (-1 bis +1)
    const normX = (e.clientX / width - 0.5) * 2;
    const normY = (e.clientY / height - 0.5) * 2;
    
    waveState.targetMouseX = normX * 80; // Deutliche Auslenkung
    waveState.targetMouseY = normY * 80;

    const dx = e.clientX - waveState.lastMouseX;
    const dy = e.clientY - waveState.lastMouseY;
    waveState.mouseVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, 30);
    waveState.lastMouseX = e.clientX;
    waveState.lastMouseY = e.clientY;
  }, { passive: true });

  /**
   * Top-Left Corner Guilloché Wave Cluster
   * Deutlich sichtbare, fließende Schwingung mit Moire-Interferenz
   */
  function drawTopLeftWave(progress, time, mx, my, vel) {
    ctx.save();
    
    // Ankerpunkt reagiert spürbar auf Mausposition
    const originX = -40 + mx * 0.45;
    const originY = -40 + my * 0.45;
    ctx.translate(originX, originY);
    
    // Rotation aus Scrollen + lebendigem Schwingen
    const rot = -0.15 + waveState.topRotation + Math.sin(time * 0.6) * 0.06;
    ctx.rotate(rot);

    const lineCount = 30;
    const baseRadius = Math.min(width, height) * 0.52;
    const morph = waveState.topMorph;

    for (let i = 0; i < lineCount; i++) {
      const t = i / lineCount;
      // Deutlichere Sichtbarkeit (0.1 bis 0.45)
      const alpha = 0.08 + Math.sin(t * Math.PI) * 0.32;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      const p0x = 0;
      const p0y = i * 5;

      // Schwingende Kontrollpunkte mit Mausbeschleunigung
      const waveOffset1 = Math.cos(time * 1.2 + i * 0.12) * (20 + vel * 0.8);
      const waveOffset2 = Math.sin(time * 0.9 + i * 0.15) * (30 + vel * 0.6);

      const cp1x = (baseRadius * 0.45 + i * 9) + waveOffset1;
      const cp1y = (baseRadius * 0.12 - i * 3) + waveOffset2;

      const cp2x = (baseRadius * 0.85 - i * 5) + Math.sin(progress * Math.PI + i * 0.14) * (60 + morph * 40);
      const cp2y = (baseRadius * 0.75 + i * 14) + Math.cos(time * 0.8 + i * 0.1) * 28;

      const p3x = baseRadius * 1.35 + i * 14;
      const p3y = baseRadius * 0.38 + i * 9 + morph * 60;

      ctx.moveTo(p0x, p0y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p3x, p3y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Bottom-Right Corner Undulating Wave Cluster
   * Kräftiges, wellenförmiges Aufbäumen
   */
  function drawBottomRightWave(progress, time, mx, my, vel) {
    ctx.save();
    const originX = width + 40 + mx * 0.6;
    const originY = height + 40 + my * 0.6;
    ctx.translate(originX, originY);

    const rot = -0.22 + waveState.bottomRotation + Math.cos(time * 0.5) * 0.05;
    ctx.rotate(rot);

    const lineCount = 34;
    const baseSpan = Math.min(width, height) * 0.78;
    const morph = waveState.bottomMorph;

    for (let i = 0; i < lineCount; i++) {
      const t = i / lineCount;
      const alpha = 0.07 + Math.sin(t * Math.PI) * 0.35;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      const p0x = -baseSpan * 1.1 + i * 7;
      const p0y = -i * 9;

      const pulse1 = Math.sin(time * 1.1 + i * 0.14) * (26 + vel * 0.9);
      const pulse2 = Math.cos(progress * 4 + time * 0.8 + i * 0.1) * (36 + morph * 30);

      const cp1x = -baseSpan * 0.74 + i * 5 + pulse1;
      const cp1y = -baseSpan * 0.54 - i * 11 + pulse2;

      const cp2x = -baseSpan * 0.34 + i * 9 + Math.cos(time * 0.7 + i * 0.12) * 26;
      const cp2y = -baseSpan * 0.24 + i * 15 + Math.sin(progress * 3 + time * 0.9 + i * 0.1) * 38;

      const p3x = 40 + i * 11;
      const p3y = -baseSpan * 0.65 - i * 7;

      ctx.moveTo(p0x, p0y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p3x, p3y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Floating Dynamic S-Curve Ribbon (Verbindet Seitenabschnitte)
   * Wellen strömen dynamisch von links nach rechts
   */
  function drawFloatingRibbon(progress, time, mx, my) {
    ctx.save();
    const count = 15;
    const centerY = height * 0.5 + (progress - 0.5) * height * 0.45 + my * 0.5;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const alpha = 0.03 + Math.sin(t * Math.PI) * 0.18;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.9;

      ctx.beginPath();
      const startX = -100;
      const startY = centerY + Math.sin(time * 0.9 + i * 0.22) * 50;

      const cp1x = width * 0.25 + mx * 0.4;
      const cp1y = centerY - 150 + i * 14 + Math.cos(time * 0.8 + progress * 4.5 + i * 0.12) * 60;

      const cp2x = width * 0.72 - mx * 0.4;
      const cp2y = centerY + 150 - i * 10 + Math.sin(time * 0.9 - progress * 4 + i * 0.14) * 65;

      const endX = width + 100;
      const endY = centerY - 70 + Math.cos(time * 1.1 + i * 0.18) * 45;

      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Kontinuierliche 60fps Render-Schleife mit flüssiger Bewegung
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Zeit schreitet kontinuierlich voran für stetige Bewegung
    waveState.globalFlow += 0.018;

    // Sanfte Dämpfung der Mauskoordinaten für organische Trägheit
    waveState.currentMouseX += (waveState.targetMouseX - waveState.currentMouseX) * 0.08;
    waveState.currentMouseY += (waveState.targetMouseY - waveState.currentMouseY) * 0.08;
    waveState.mouseVelocity *= 0.94; // Schnelles Abklingen der Geschwindigkeit

    const t = waveState.globalFlow;
    const p = waveState.scrollProgress;
    const mx = waveState.currentMouseX;
    const my = waveState.currentMouseY;
    const vel = waveState.mouseVelocity;

    drawTopLeftWave(p, t, mx, my, vel);
    drawBottomRightWave(p, t, mx, my, vel);
    drawFloatingRibbon(p, t, mx, my);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  /**
   * GSAP ScrollTrigger Anbindung
   * Beim Scrollen verformen, rotieren und spreizen sich die Wellen kräftig
   */
  function initGSAPScrollWave() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAPScrollWave, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(waveState, {
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
      scrollProgress: 1,
      topRotation: 0.75,     // Ausgeprägte Rotation
      topMorph: 1.8,         // Starke Verformung
      bottomRotation: -0.85, // Gegenläufige Drehung
      bottomMorph: 2.1,
      ease: 'none',
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPScrollWave);
  } else {
    initGSAPScrollWave();
  }
})();
