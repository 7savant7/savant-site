import { useState, useEffect } from 'react'
import SmoothScroll from './components/SmoothScroll'
import SavantFlameLogo3D from './components/SavantFlameLogo3D'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000) // fake load window

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <SavantFlameLogo3D />}

      {!loading && (
        <SmoothScroll>
          <div style={{
            minHeight: '200vh',
            background: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            SAVANT SYSTEM ACTIVE
          </div>
        </SmoothScroll>
      )}
    </>
  )
}
