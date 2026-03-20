import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChannelChartProps {
  data?: { name: string; count: number }[]
}

export function ChannelChart({ data = [] }: ChannelChartProps) {
  // Sort descending
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.count - a.count)
  }, [data])

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] flex flex-col overflow-hidden h-full">
      <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-black dark:text-white">Channel ที่มา</h3>
      </div>
      <div className="p-5 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(60,60,67,0.6)', fontSize: 13 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} label={{ position: 'right', fill: 'rgba(60,60,67,0.6)', fontSize: 12 }}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#007AFF" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
