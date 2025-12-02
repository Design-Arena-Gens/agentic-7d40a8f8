import React from 'react';

export function Header() {
  return (
    <header className="lux" role="banner" aria-label="Site header">
      <nav className="lux" aria-label="Primary">
        <div className="brand">big Christmas tree</div>
        <div className="lights" aria-hidden>
          <div className="wire" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
        </div>
      </nav>
    </header>
  );
}

