import React from 'react';

const Loader = ({ size = 32, label = 'Loading...' }) => {
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:12, justifyContent:'center' }}>
      <div
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          border: '3px solid rgba(124,92,255,.25)',
          borderTopColor: '#7c5cff',
          animation: 'nx-spin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ color:'#a9add6' }}>{label}</span>}
      <style>{`@keyframes nx-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Loader;
