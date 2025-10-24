import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchedule, addEvent, deleteEvent } from '../store/slices/schedule.slice.js'
import Loader from './ui/Loader.jsx'
import Empty from './ui/Empty.jsx'

const Schedule = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(s => s.schedule)
  const [title, setTitle] = useState('')

  useEffect(()=>{ dispatch(fetchSchedule()) }, [dispatch])

  const onAdd = () => {
    if (title.trim()) { dispatch(addEvent({ title })); setTitle('') }
  }

  return (
    <div style={{ maxWidth: 720, margin: '28px auto', padding:'16px' }}>
      <h2 style={{ color:'#f8f9ff', marginBottom: 12 }}>Schedule</h2>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          placeholder="Add a new event" 
          style={{ flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.1)', background:'#141831', color:'#f8f9ff' }} />
        <button onClick={onAdd} style={{ padding:'10px 14px', border:'none', borderRadius:10, background:'linear-gradient(90deg,#7c5cff,#9a7bff)', color:'#fff', cursor:'pointer' }}>Add</button>
      </div>

      {status==='loading' && <Loader label="Loading schedule..." />}
      {status==='failed' && error && (
        <div style={{ marginBottom:12, padding:'10px 12px', border:'1px solid rgba(255,107,107,.4)', borderRadius:12, color:'#ffb3b3', background:'rgba(255,107,107,.08)' }}>
          <i className="fas fa-triangle-exclamation" /> {error}
        </div>
      )}

      {status!=='loading' && items.length===0 && (
        <Empty title="No events yet" subtitle="Add your first event" />
      )}

      <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:8 }}>
        {items.map(e=> (
          <li key={e.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12 }}>
            <span style={{ color:'#f8f9ff', flex:1 }}>{e.title}</span>
            <button onClick={()=>dispatch(deleteEvent(e.id))} style={{ background:'transparent', color:'#ff6b6b', border:'1px solid rgba(255,107,107,.4)', borderRadius:10, padding:'6px 10px', cursor:'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Schedule
