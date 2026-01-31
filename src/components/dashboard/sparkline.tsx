'use client'

import { useMemo } from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, color = '#059669', height = 40, width = 80 }: SparklineProps) {
  const gradientId = useMemo(() => `sparkline-${Math.random().toString(36).slice(2, 9)}`, [])

  const points = useMemo(() => {
    if (!data.length) return ''

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const xStep = width / (data.length - 1)

    return data
      .map((value, index) => {
        const x = index * xStep
        const y = height - ((value - min) / range) * height * 0.75 - height * 0.125
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }, [data, height, width])

  const areaPoints = useMemo(() => {
    if (!data.length) return ''

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const xStep = width / (data.length - 1)

    const linePoints = data.map((value, index) => {
      const x = index * xStep
      const y = height - ((value - min) / range) * height * 0.75 - height * 0.125
      return `${x},${y}`
    })

    return `M 0,${height} L ${linePoints.join(' L ')} L ${width},${height} Z`
  }, [data, height, width])

  const lastPointY = useMemo(() => {
    if (!data.length) return height / 2
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    return height - ((data[data.length - 1] - min) / range) * height * 0.75 - height * 0.125
  }, [data, height])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <path
        d={areaPoints}
        fill={`url(#${gradientId})`}
        className="transition-all duration-500"
      />

      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500"
      />

      {data.length > 0 && (
        <g>
          <circle
            cx={width}
            cy={lastPointY}
            r={5}
            fill={color}
            opacity={0.2}
            className="animate-ping"
          />
          <circle
            cx={width}
            cy={lastPointY}
            r={3.5}
            fill="white"
            stroke={color}
            strokeWidth={2}
            className="transition-all duration-500"
          />
        </g>
      )}
    </svg>
  )
}
