import React, { useState } from 'react'

const InputPanel = ({ onSend, placeholder = 'Type a message…', disabled = false }) => {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend?.(text)
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
      <textarea
        rows={1}
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex:1,
          resize:'none',
          border:'1px solid rgba(255, 255, 255, 0.08)',
          borderRadius:12,
          padding:'10px 12px',
          background:'#141831',
          color:'#f8f9ff',
          opacity: disabled ? 0.6 : 1
        }}
      />
      <button
        onClick={handleSend}
        title="Send"
        style={{
          border:'none',
          padding:'10px 14px',
          borderRadius:12,
          background:'linear-gradient(90deg,#24e4ac,#7c5cff)',
          color:'#fff',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <i className="fas fa-paper-plane" />
      </button>
    </div>
  )
}

export default InputPanel