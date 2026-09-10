"use client";

import { Component, lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const GridDistortion = lazy(() => import('./GridDistortion'));
// User explicitly requested this effect even with reduced motion enabled.
const motionQuery = '(any-hover: hover) and (any-pointer: fine)';
function subscribeMotion(callback) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function getMotionSnapshot() { return window.matchMedia(motionQuery).matches; }
function getServerSnapshot() { return false; }

// Keep the CSS photograph visible if WebGL or the lazy module cannot load.
class BackgroundFallback extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function LarHeroBackground({ enabled = true }) {
  const layerRef = useRef(null);
  const motionAllowed = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getServerSnapshot);
  const [visible, setVisible] = useState(false);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !window.ResizeObserver || !window.IntersectionObserver) return;
    // Match CSS background-size: cover without stretching the real photograph.
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const photoAspect = 929 / 619;
      const coverWidth = Math.max(width, height * photoAspect);
      setCover({ width: coverWidth, height: coverWidth / photoAspect });
    });
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    resize.observe(layer);
    intersection.observe(layer);
    return () => { resize.disconnect(); intersection.disconnect(); };
  }, []);

  return <div ref={layerRef} className="grid-background" aria-hidden="true">
    {enabled && motionAllowed && visible && cover && <div className="grid-photo-cover" style={cover}>
      <BackgroundFallback><Suspense fallback={null}>
        <GridDistortion imageSrc="/images/lar-fachada.png" grid={6} mouse={0.11} strength={0.15} relaxation={0.9} className="custom-class" />
      </Suspense></BackgroundFallback>
    </div>}
  </div>;
}
