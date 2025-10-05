import React from 'react';

const Empty = ({ title = 'Nothing here yet', subtitle = 'Add something to get started.' }) => {
  return (
    <div style={{
      textAlign: 'center',
      color: '#a9add6',
      padding: '24px',
      border: '1px dashed rgba(124,92,255,.35)',
      borderRadius: 12,
      background: 'rgba(255,255,255,.02)'
    }}>
      <div style={{ fontWeight: 700, color: '#f8f9ff', marginBottom: 6 }}>{title}</div>
      <div>{subtitle}</div>
    </div>
  );
};

export default Empty;
