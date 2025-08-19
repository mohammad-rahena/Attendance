import React, { useState } from 'react';
import { Calculator, BookOpen, Beaker, Brain, Percent } from 'lucide-react';

// Define the structure for each component (e.g., Lecture, Practical)
interface Component {
  id: string;
  name: string;
  icon: React.ReactNode;
  attended: number;
  total: number;
}

function App() {
  // Initialize the state with the components, excluding 'tutorial'
  const [components, setComponents] = useState<Component[]>([
    { id: 'lecture', name: 'Lectures', icon: <BookOpen className="w-5 h-5" />, attended: 0, total: 0 },
    { id: 'practical', name: 'Practicals', icon: <Beaker className="w-5 h-5" />, attended: 0, total: 0 },
    { id: 'skill', name: 'Skills', icon: <Brain className="w-5 h-5" />, attended: 0, total: 0 },
    // The 'tutorial' component has been removed from this list
  ]);

  /**
   * Handles changes in the input fields for attended and total classes.
   * Updates the state of the relevant component.
   * @param id The ID of the component to update.
   * @param field The field to update ('attended' or 'total').
   * @param value The new value from the input field.
   */
  const handleInputChange = (id: string, field: 'attended' | 'total', value: string) => {
    const numValue = parseInt(value) || 0; // Convert input value to a number, default to 0 if invalid
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, [field]: numValue } : comp // Update the specific component
    ));
  };

  /**
   * Calculates the attendance percentage for a given component.
   * Returns 0 if total classes are zero to avoid division by zero.
   * @param attended The number of classes attended.
   * @param total The total number of classes.
   * @returns The attendance percentage.
   */
  const calculatePercentage = (attended: number, total: number): number => {
    if (total === 0) return 0; // Prevent division by zero
    return (attended / total) * 100;
  };

  /**
   * Calculates the overall average attendance across all components with total classes greater than 0.
   * Filters out components with 0 total classes to ensure meaningful average.
   * @returns The overall attendance percentage.
   */
  const getOverallAttendance = (): number => {
    // Only consider components that have defined total classes
    const activeComponents = components.filter(comp => comp.total > 0);
    if (activeComponents.length === 0) return 0; // If no active components, overall attendance is 0

    // Sum up percentages of active components and average them
    const sum = activeComponents.reduce((acc, comp) =>
      acc + calculatePercentage(comp.attended, comp.total), 0);
    return sum / activeComponents.length;
  };

  /**
   * Determines the color of the progress bar based on the attendance percentage.
   * Green for good, yellow for moderate, red for low.
   * @param percentage The attendance percentage.
   * @returns A Tailwind CSS class string for the background color.
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return 'bg-green-500'; // Good attendance
    if (percentage >= 60) return 'bg-yellow-500'; // Moderate attendance
    return 'bg-red-500'; // Low attendance
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          {/* Header section with icon and title */}
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Course Attendance Calculator</h1>
          </div>

          {/* Section for individual attendance components */}
          <div className="grid gap-6 mb-8">
            {components.map((component) => (
              <div
                key={component.id}
                className="bg-gray-50 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Component header with icon and name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    {component.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">{component.name}</h2>
                </div>

                {/* Input fields and percentage display for each component */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor={`${component.id}-attended`} className="block text-sm font-medium text-gray-600 mb-1">
                      Classes Attended
                    </label>
                    <input
                      id={`${component.id}-attended`}
                      type="number"
                      min="0"
                      value={component.attended === 0 && component.total === 0 ? '' : component.attended}
                      onChange={(e) => handleInputChange(component.id, 'attended', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`${component.id}-total`} className="block text-sm font-medium text-gray-600 mb-1">
                      Total Classes
                    </label>
                    <input
                      id={`${component.id}-total`}
                      type="number"
                      min="0"
                      value={component.total === 0 && component.attended === 0 ? '' : component.total}
                      onChange={(e) => handleInputChange(component.id, 'total', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  {/* Progress bar for individual component attendance */}
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

          {/* Overall attendance display */}
          <div className="bg-indigo-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
