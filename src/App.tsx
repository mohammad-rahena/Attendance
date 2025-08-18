import React, { useState } from 'react';
import { Calculator, BookOpen, Beaker, Brain, BookText, Percent } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  icon: React.ReactNode;
  attended: number;
  total: number;
}

function App() {
  const [components, setComponents] = useState<Component[]>([
    { id: 'lecture', name: 'Lectures', icon: <BookOpen className="w-5 h-5" />, attended: 0, total: 0 },
    { id: 'practical', name: 'Practicals', icon: <Beaker className="w-5 h-5" />, attended: 0, total: 0 },
    { id: 'skill', name: 'Skills', icon: <Brain className="w-5 h-5" />, attended: 0, total: 0 },
    { id: 'tutorial', name: 'Tutorials', icon: <BookText className="w-5 h-5" />, attended: 0, total: 0 },
  ]);

  const handleInputChange = (id: string, field: 'attended' | 'total', value: string) => {
    const numValue = parseInt(value) || 0;
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, [field]: numValue } : comp
    ));
  };

  const calculatePercentage = (attended: number, total: number): number => {
    if (total === 0) return 0;
    return (attended / total) * 100;
  };

  const getOverallAttendance = (): number => {
    const activeComponents = components.filter(comp => comp.total > 0);
    if (activeComponents.length === 0) return 0;
    
    const sum = activeComponents.reduce((acc, comp) => 
      acc + calculatePercentage(comp.attended, comp.total), 0);
    return sum / activeComponents.length;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Course Attendance Calculator</h1>
          </div>

          <div className="grid gap-6 mb-8">
            {components.map((component) => (
              <div 
                key={component.id}
                className="bg-gray-50 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    {component.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">{component.name}</h2>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Classes Attended
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={component.attended || ''}
                      onChange={(e) => handleInputChange(component.id, 'attended', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Total Classes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={component.total || ''}
                      onChange={(e) => handleInputChange(component.id, 'total', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(calculatePercentage(component.attended, component.total))} transition-all duration-500 flex items-center justify-center text-white font-medium`}
                        style={{ width: `${calculatePercentage(component.attended, component.total)}%` }}
                      >
                        {calculatePercentage(component.attended, component.total).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Percent className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700">Overall Attendance</h2>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {getOverallAttendance().toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;