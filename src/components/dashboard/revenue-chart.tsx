'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRevenueData } from '@/hooks/use-dashboard'
import { formatCurrency, formatNumber } from '@/lib/patterns'
import { Calendar, TrendingUp } from 'lucide-react'
import { ReactNode, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { match } from 'ts-pattern'

export function RevenueChart() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const { data, isLoading, error } = useRevenueData(period)

  const totalRevenue = data?.reduce((sum, item) => sum + item.revenue, 0) || 0
  const revenueChange = 16

  const renderChart = (): ReactNode => {
    return match({ isLoading, error, data })
      .returnType<ReactNode>()
      .with({ isLoading: true }, () => (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ))
      .when(({ error }) => error !== null, ({ error }) => (
        <div className="flex h-full items-center justify-center text-destructive">
          Error: {error?.message}
        </div>
      ))
      .otherwise(() => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="barGradientMuted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64736c', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64736c', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `${formatNumber(value)}`}
              dx={-8}
            />
            <Tooltip
              cursor={{ fill: 'rgba(5, 150, 105, 0.06)' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e9e7',
                borderRadius: '12px',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
                padding: '12px 16px',
              }}
              formatter={(value) => [formatCurrency(value as number).replace('€', '$'), 'Revenue']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data?.map((_, index) => {
                const isHighlight = index === (data.length - 2)
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHighlight ? 'url(#barGradient)' : 'url(#barGradientMuted)'}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ))
  }

  return (
    <Card className="col-span-2 border-0 bg-white shadow-sm animate-fade-up animation-delay-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display text-base font-semibold tracking-tight">
          Revenue Stat
        </CardTitle>
        <Select value={period} onValueChange={(v: 'weekly' | 'monthly') => setPeriod(v)}>
          <SelectTrigger className="w-32 rounded-xl border-border/50 bg-muted/30 text-sm font-medium transition-colors hover:bg-muted/50">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            <SelectItem value="weekly" className="rounded-lg">Weekly</SelectItem>
            <SelectItem value="monthly" className="rounded-lg">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-baseline gap-3">
          <span className="font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {formatCurrency(totalRevenue).replace('€', '$')}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            {revenueChange}% from last month
          </span>
        </div>
        <div className="h-64">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}
