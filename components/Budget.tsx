import React, { useMemo, useState } from 'react';
import { Activity } from '../types';
import { Wallet, TrendingDown, Info, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BudgetProps {
  itinerary: Activity[];
}

const COLORS = ['#8B0000', '#D4AF37', '#7393B3', '#94a3b8'];

const Budget: React.FC<BudgetProps> = ({ itinerary }) => {
  const [currency] = useState<'EUR'>('EUR');

  const manualExpenses = [
    { title: 'Ticket BIRG (5 Zonas)', cost: 12, type: 'transport' },
    { title: 'Almuerzo (Pizza + Bebida)', cost: 15, type: 'food' },
    { title: 'Extras (Café, Helado, Baños)', cost: 12, type: 'leisure' },
  ];
  
  const total = useMemo(() => {
    return manualExpenses.reduce((acc, curr) => acc + curr.cost, 0);
  }, []);

  const chartData = manualExpenses.map(item => ({
    name: item.title,
    value: item.cost
  }));

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-imperial-900 flex items-center">
          <Wallet className="mr-2" /> Gastos Estimados
        </h2>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-imperial-800 to-imperial-950 rounded-2xl p-6 text-white shadow-xl mb-8 border border-white/10">
        <p className="text-imperial-200 text-xs mb-1 uppercase tracking-widest font-bold">Total por Persona</p>
        <div className="text-5xl font-black">
          {total.toFixed(2)} €
        </div>
        <p className="text-[10px] text-imperial-300 mt-4 flex items-center bg-white/10 p-2 rounded">
          <Info size={14} className="mr-1.5 flex-shrink-0"/> Cubre transporte regional y gastos básicos del día.
        </p>
      </div>

      {/* Breakdown List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <h3 className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-tight flex items-center">
          <CreditCard size={14} className="mr-2"/> Desglose de Gastos
        </h3>
        {manualExpenses.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <div>
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-[10px] text-gray-500 uppercase font-medium">{item.type}</p>
              </div>
            </div>
            <div className="font-bold text-gray-900">
              {item.cost.toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8">
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Saving Tip */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start shadow-sm mb-6">
        <TrendingDown className="text-emerald-600 mt-1 mr-3 flex-shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-emerald-800 text-sm">Ahorro Inteligente</h4>
          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
            Roma tiene fuentes de agua gratuitas (<span className="font-bold">Nasoni</span>) por toda la ciudad. Lleva tu propia botella para evitar pagar 2-3€ por agua.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Budget;
