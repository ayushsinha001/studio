"use client"

import * as React from "react"
import { 
  Users, 
  Gavel, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const caseloadData = [
  { month: "Jan", new: 450, resolved: 380 },
  { month: "Feb", new: 520, resolved: 410 },
  { month: "Mar", new: 480, resolved: 460 },
  { month: "Apr", new: 610, resolved: 520 },
  { month: "May", new: 590, resolved: 580 },
  { month: "Jun", new: 640, resolved: 600 },
]

const nationalOverview = [
  { court: "Supreme Court", pending: 72000, capacity: 85 },
  { court: "High Courts", pending: 5900000, capacity: 62 },
  { court: "District Courts", pending: 41000000, capacity: 48 },
]

const stats = [
  { title: "Active Cases", value: "12,482", change: "+4.5%", trend: "up", icon: Users },
  { title: "Judgments", value: "894", change: "+12.1%", trend: "up", icon: Gavel },
  { title: "Avg. Duration", value: "18.2m", change: "-2.4%", trend: "down", icon: Clock },
  { title: "Success Rate", value: "76.4%", change: "+1.2%", trend: "up", icon: TrendingUp },
]

export function JudicialDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Judicial Dashboard</h1>
        <p className="text-muted-foreground">National caseload overview and judicial performance metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <stat.icon className="w-12 h-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs flex items-center mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Caseload Trends</CardTitle>
            <CardDescription>Comparison of new case filings vs resolved cases</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={caseloadData}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.2)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="new" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorNew)" strokeWidth={3} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass-card">
          <CardHeader>
            <CardTitle>National Overview</CardTitle>
            <CardDescription>Pending cases by court jurisdiction level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {nationalOverview.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.court}</span>
                    <span className="text-muted-foreground">{(item.pending / 1000000).toFixed(2)}M cases</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${item.capacity}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>Clearance Rate: {item.capacity}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-bold mr-1">Insight:</span>
                  Disposal rates in District Courts have improved by 4.2% following the implementation of virtual courtrooms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}