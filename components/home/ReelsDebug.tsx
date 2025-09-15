'use client'

import React, { useState, useEffect } from 'react'

export default function ReelsDebug() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/social-widgets')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4 bg-gray-100">
      <h2>Debug API Response:</h2>
      <pre className="text-xs bg-white p-2 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
