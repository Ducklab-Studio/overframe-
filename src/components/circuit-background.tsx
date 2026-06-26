'use client';

import { CircuitLines } from './circuit-lines';

export function CircuitBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <CircuitLines />
    </div>
  );
}
