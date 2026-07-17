import React from 'react';

export default function FlexBetween({ children, style, ...props }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
