import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearChat } from '../store/slices/chat.slice.js'

const ConvoManagement = () => {
  const dispatch = useDispatch()
  const { messages } = useSelector(s => s.chat)

  const stats = useMemo(() => {
    const total = messages.length
    const userMsgs = messages.filter(m => m.role === 'user').length
    const aiMsgs = messages.filter(m => m.role !== 'user').length
    const last = messages[messages.length - 1]
    return {
      total,
      userMsgs,
      aiMsgs,
      lastAt: last ? new Date().toLocaleString() : '—'
    }
  }, [messages])

  const onExport = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const onClear = () => dispatch(clearChat())
  
  return (
    <div style={{ maxWidth: 720, margin: '28px auto', padding:'16px' }}>
      <h2 style={{ color:'#f8f9ff', marginBottom: 12 }}>Conversation Management</h2>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:12,
        marginBottom:16
      }}>
        <div style={{ padding:12, border:'1px solid rgba(255,255,255,.08)', borderRadius:12, background:'rgba(255,255,255,.03)', color:'#f8f9ff' }}>
          <div style={{ opacity:.7, fontSize:12 }}>Total Messages</div>
          <div style={{ fontSize:22, fontWeight:700 }}>{stats.total}</div>
        </div>
        <div style={{ padding:12, border:'1px solid rgba(255,255,255,.08)', borderRadius:12, background:'rgba(255,255,255,.03)', color:'#f8f9ff' }}>
          <div style={{ opacity:.7, fontSize:12 }}>You</div>
          <div style={{ fontSize:22, fontWeight:700 }}>{stats.userMsgs}</div>
        </div>
        <div style={{ padding:12, border:'1px solid rgba(255,255,255,.08)', borderRadius:12, background:'rgba(255,255,255,.03)', color:'#f8f9ff' }}>
          <div style={{ opacity:.7, fontSize:12 }}>Assistant</div>
          <div style={{ fontSize:22, fontWeight:700 }}>{stats.aiMsgs}</div>
        </div>
      </div>

      <div style={{ padding:12, border:'1px solid rgba(255,255,255,.08)', borderRadius:12, background:'rgba(255,255,255,.03)', color:'#a9add6', marginBottom:16 }}>
        <div><span style={{ opacity:.8 }}>Last activity:</span> <span style={{ color:'#f8f9ff' }}>{stats.lastAt}</span></div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onExport} style={{
          border:'none',
          padding:'10px 14px',
          borderRadius:12,
          background:'linear-gradient(90deg,#7c5cff,#9a7bff)',
          color:'#fff',
          cursor:'pointer'
        }}>
          <i className="fas fa-file-arrow-down" /> Export JSON
        </button>
        <button onClick={onClear} style={{
          border:'1px solid rgba(255,107,107,.5)',
          padding:'10px 14px',
          borderRadius:12,
          background:'transparent',
          color:'#ff6b6b',
          cursor:'pointer'
        }}>
          <i className="fas fa-trash" /> Clear Chat
        </button>
      </div>
    </div>
  )
}

export default ConvoManagement