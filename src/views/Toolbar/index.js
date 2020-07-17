import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
  const { title, leftItems, rightItems } = props;
  return (
    <div className="toolbar bg-dark" style={{ top: '-1rem' }}>
      <div className="left-items">{leftItems}</div>
      <h1 className="toolbar-title" style={{ fontSize: '1.5em' }}>
        {title ? title.toUpperCase() : ''}
      </h1>
      <div className="right-items">{rightItems}</div>
    </div>
  );
}
