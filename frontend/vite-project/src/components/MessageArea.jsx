import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../store/slices/chat.slice.js'
import Loader from './ui/Loader.jsx'
import InputPanel from './InputPanel.jsx'

const MessageArea = () => {
  const dispatch = useDispatch()
  const { messages, status } = useSelector(s => s.chat)
  const endRef = useRef(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, status])
   const onSend = (content) => {
    const trimmed = String(content || '').trim()
    if (!trimmed) return
    dispatch(sendMessage({ conversationId: null, message: trimmed }))
  }

  return (
    <div style={{ maxWidth: 920, margin:'24px auto', padding:'12px' }}>
      <div style={{
        border:'1px solid rgba(255,255,255,.08)',
        borderRadius:16,
        background:'rgba(255,255,255,.03)',
        overflow:'hidden'
      }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', alignItems:'center', gap:10 }}>
          <i className="fas fa-robot" style={{ color:'#24e4ac' }} />
          <div style={{ color:'#f8f9ff', fontWeight:'700'}}>Nexus Assistant</div>
          <div style={{ marginLeft:'auto', fontSize:12, color:'#a9add6' }}>{status==='loading' ? 'Thinking…' : 'Online'}</div>
        </div>

        <div style={{ height: '56vh', padding:'14px', overflowY:'auto', display:'grid', gap:10 }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
              <div style={{
                maxWidth:'75%',
                padding:'10px 12px',
                borderRadius:12,
                background: m.role==='user' ? 'linear-gradient(90deg,#7c5cff,#9a7bff)' : 'rgba(255,255,255,.05)',
                color:'#f8f9ff',
                border: m.role==='user' ? 'none' : '1px solid rgba(255,255,255,.08)'
              }}>{m.content}</div>
            </div>
          ))}
          {status==='loading' && (
            <div style={{ display:'flex', justifyContent:'flex-start' }}>
              <div style={{ padding:'6px 10px', borderRadius:12, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)' }}>
                <Loader size={18} label="" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
          <InputPanel onSend={onSend} placeholder="Ask anything…" disabled={status==='loading'} />
        </div>
      </div>
    </div>
  )
}

export default MessageArea