'use client'

import { useState } from 'react'
import { Sparkles, Users } from 'lucide-react'
import { BuilderCardGenerator } from '@/components/builder-card-generator'
import { TeamCardGenerator } from '@/components/team-card-generator'

type Mode = 'solo' | 'team'

export default function Home() {
  const [mode, setMode] = useState<Mode>('solo')
  const [isSwitching, setIsSwitching] = useState(false)

  function switchMode(nextMode: Mode) {
    if (nextMode === mode) return
    setIsSwitching(true)
    window.setTimeout(() => {
      setMode(nextMode)
      setIsSwitching(false)
    }, 280)
  }

  return (
    <div className={isSwitching ? 'mode-glitch' : ''}>
      <div className="mode-switch-wrap" role="tablist" aria-label="Card type">
        <div className="mode-switch-label">CHOOSE YOUR FORMAT</div>
        <div className="mode-switch" data-mode={mode}>
          <span className="mode-switch-track" aria-hidden="true" />
          <button type="button" role="tab" aria-selected={mode === 'solo'} onClick={() => switchMode('solo')} className={mode === 'solo' ? 'mode-button active' : 'mode-button'}>
            <Sparkles className="size-4" /> SOLO ID
          </button>
          <button type="button" role="tab" aria-selected={mode === 'team'} onClick={() => switchMode('team')} className={mode === 'team' ? 'mode-button active' : 'mode-button'}>
            <Users className="size-4" /> TEAM ID
          </button>
        </div>
        <p className="mode-switch-hint">{mode === 'solo' ? 'One builder. One signal.' : 'One crew. One signal.'}</p>
      </div>
      <div key={mode} className="mode-page-enter">
        {mode === 'solo' ? <BuilderCardGenerator /> : <TeamCardGenerator />}
      </div>
    </div>
  )
}
