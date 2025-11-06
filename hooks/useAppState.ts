import { useState, useEffect } from 'react';
import { 
  EmissionEntry, 
  Department, 
  ReductionStrategy, 
  Goal,
  organizationData,
  emissionData,
  departments,
  reductionStrategies,
  goals 
} from '../constants/Data';

export function useAppState() {
  // Emissions State
  const [emissions, setEmissions] = useState<EmissionEntry[]>(emissionData);
  const [newEmission, setNewEmission] = useState<Partial<EmissionEntry>>({
    category: 'Energy',
    source: '',
    value: 0,
    unit: 'kWh',
    department: 'Facilities'
  });

  // Departments State
  const [departmentList, setDepartmentList] = useState<Department[]>(departments);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    manager: '',
    emissionSources: []
  });

  // Strategies State
  const [strategies, setStrategies] = useState<ReductionStrategy[]>(reductionStrategies);

  // Goals State
  const [goalList, setGoalList] = useState<Goal[]>(goals);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    target: 0,
    unit: '%',
    deadline: new Date().toISOString().split('T')[0]
  });

  // Add new emission
  const addEmission = () => {
    if (newEmission.source && newEmission.value) {
      const emission: EmissionEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        category: newEmission.category || 'Energy',
        source: newEmission.source,
        value: newEmission.value,
        unit: newEmission.unit || 'kWh',
        co2e: calculateCO2e(newEmission),
        department: newEmission.department || 'Facilities'
      };
      setEmissions([...emissions, emission]);
      setNewEmission({
        category: 'Energy',
        source: '',
        value: 0,
        unit: 'kWh',
        department: 'Facilities'
      });
    }
  };

  // Calculate CO2 equivalent
  const calculateCO2e = (emission: Partial<EmissionEntry>): number => {
    // Simple calculation - in real app, use proper emission factors
    const baseValue = emission.value || 0;
    switch (emission.category) {
      case 'Energy': return baseValue * 0.85; // kg CO2 per kWh
      case 'Transport': return baseValue * 2.68; // kg CO2 per liter
      case 'Production': return baseValue * 7.1; // kg CO2 per unit
      default: return baseValue;
    }
  };

  // Add new department
  const addDepartment = () => {
    if (newDepartment.name && newDepartment.manager) {
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name,
        manager: newDepartment.manager,
        emissionSources: newDepartment.emissionSources || [],
        monthlyEmissions: 0,
        trend: 'stable'
      };
      setDepartmentList([...departmentList, department]);
      setNewDepartment({
        name: '',
        manager: '',
        emissionSources: []
      });
    }
  };

  // Add new goal
  const addGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: newGoal.target,
        current: 0,
        unit: newGoal.unit || '%',
        deadline: newGoal.deadline || new Date().toISOString().split('T')[0],
        progress: 0,
        status: 'On Track'
      };
      setGoalList([...goalList, goal]);
      setNewGoal({
        title: '',
        target: 0,
        unit: '%',
        deadline: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Update goal progress
  const updateGoalProgress = (goalId: string, newCurrent: number) => {
    setGoalList(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const progress = (newCurrent / goal.target) * 100;
        const status = progress >= 100 ? 'Completed' : 
                      progress >= (goal.target * 0.7) ? 'On Track' : 'At Risk';
        return {
          ...goal,
          current: newCurrent,
          progress,
          status
        };
      }
      return goal;
    }));
  };

  // Implement strategy
  const implementStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: 'In Progress' as const }
        : strategy
    ));
  };

  return {
    // Emissions
    emissions,
    newEmission,
    setNewEmission,
    addEmission,
    
    // Departments
    departmentList,
    newDepartment,
    setNewDepartment,
    addDepartment,
    
    // Strategies
    strategies,
    implementStrategy,
    
    // Goals
    goalList,
    newGoal,
    setNewGoal,
    addGoal,
    updateGoalProgress,
    
    // Organization data
    organizationData
  };
}