"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'a1', value: 300 },
  { name: 'a2', value: 200 },
  { name: 'a3', value: 800 },
  { name: 'a4', value: 600 }
];

export default function LineChartPage() {
  return (
    <div>
      <h3>Line-chart</h3>
      <ResponsiveContainer width={500} height={400}>
        <LineChart data={data}>
          <CartesianGrid />
          <Line dataKey="value" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
