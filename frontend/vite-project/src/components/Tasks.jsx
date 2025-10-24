import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, addTask, toggleTask, deleteTask } from '../store/slices/tasks.slice.js'
import Loader from './ui/Loader.jsx'
import Empty from './ui/Empty.jsx'

const Tasks = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(s => s.tasks)
  const [text, setText] = useState('')

  useEffect(()=>{ dispatch(fetchTasks()) }, [dispatch])

  const onAdd = () => {
    if (text.trim()) { dispatch(addTask(text)); setText('') }
  }

  return (
    <div style={{ maxWidth: 720, margin: '28px auto', padding:'16px' }}>
      <h2 style={{ color:'#f8f9ff', marginBottom: 12 }}>Tasks</h2>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input 
          value={text} 
          onChange={e=>setText(e.target.value)} 
          placeholder="Add a new task" 
          style={{ flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.1)', background:'#141831', color:'#f8f9ff' }} />
        <button onClick={onAdd} style={{ padding:'10px 14px', border:'none', borderRadius:10, background:'linear-gradient(90deg,#7c5cff,#9a7bff)', color:'#fff', cursor:'pointer' }}>Add</button>
      </div>

      {status==='loading' && <Loader label="Loading tasks..." />}
      {status==='failed' && error && (
        <div style={{ marginBottom:12, padding:'10px 12px', border:'1px solid rgba(255,107,107,.4)', borderRadius:12, color:'#ffb3b3', background:'rgba(255,107,107,.08)' }}>
          <i className="fas fa-triangle-exclamation" /> {error}
        </div>
      )}

      {status!=='loading' && items.length===0 && (
        <Empty title="No tasks yet" subtitle="Create your first task to get started" />
      )}

      <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:8 }}>
        {items.map(t=> (
          <li key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12 }}>
            <input type="checkbox" checked={!!t.completed} onChange={()=>dispatch(toggleTask(t.id))} />
            <span style={{ color:'#f8f9ff', flex:1, textDecoration: t.completed?'line-through':'none', opacity: t.completed? .7 : 1 }}>{t.text}</span>
            <button onClick={()=>dispatch(deleteTask(t.id))} style={{ background:'transparent', color:'#ff6b6b', border:'1px solid rgba(255,107,107,.4)', borderRadius:10, padding:'6px 10px', cursor:'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks
