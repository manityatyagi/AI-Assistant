import React, { useMemo, useState } from 'react'

const Health = () => {
  const [hydration, setHydration] = useState(1.2)
  const [steps, setSteps] = useState(6842)
  const [sleep, setSleep] = useState(7.5)

  const goals = useMemo(() => ({ hydration: 2.5, steps: 10000, sleep: 8 }), [])

  return (
    <div className="nx-container" style={{ paddingTop: 24 }}>
      <main className="nx-main">
        <section className="nx-welcome">
          <h1>Health & Wellness</h1>
          <p>Track sleep, steps, and hydration. Manual demo controls below.</p>
        </section>
        <section className="nx-grid">
          <div className="nx-card nx-card--lightblue">
            <div className="nx-card-header"><div className="nx-card-title">Sleep</div></div>
            <div className="nx-stats">
              <div className="nx-stat"><span>Goal</span><div className="nx-bar"><div className="nx-fill nx-sleep" style={{ width: `${Math.min(100,(sleep/goals.sleep)*100).toFixed(0)}%` }}></div></div><span>{sleep}h / {goals.sleep}h</span></div>
              <input type="range" min="0" max="12" step="0.5" value={sleep} onChange={e=>setSleep(Number(e.target.value))} />
            </div>
          </div>
          <div className="nx-card nx-card--lightblue">
            <div className="nx-card-header"><div className="nx-card-title">Steps</div></div>
            <div className="nx-stats">
              <div className="nx-stat"><span>Today</span><div className="nx-bar"><div className="nx-fill nx-steps" style={{ width: `${Math.min(100,(steps/goals.steps)*100).toFixed(0)}%` }}></div></div><span>{steps}/{goals.steps}</span></div>
              <input type="range" min="0" max="20000" step="100" value={steps} onChange={e=>setSteps(Number(e.target.value))} />
            </div>
          </div>
          <div className="nx-card nx-card--lightblue">
            <div className="nx-card-header"><div className="nx-card-title">Hydration</div></div>
            <div className="nx-stats">
              <div className="nx-stat"><span>Today</span><div className="nx-bar"><div className="nx-fill nx-hydr" style={{ width: `${Math.min(100,(hydration/goals.hydration)*100).toFixed(0)}%` }}></div></div><span>{hydration}L / {goals.hydration}L</span></div>
              <input type="range" min="0" max="5" step="0.1" value={hydration} onChange={e=>setHydration(Number(e.target.value))} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Health
