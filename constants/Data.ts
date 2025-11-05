export interface EmissionEntry {
    id: string;
    date: string;
    category: string;
    source: string;
    value: number;
    unit: string;
    co2e: number;
    department: string;
  }
  
  export interface Department {
    id: string;
    name: string;
    manager: string;
    emissionSources: string[];
    monthlyEmissions: number;
    trend: 'up' | 'down' | 'stable';
  }
  
  export interface ReductionStrategy {
    id: string;
    title: string;
    category: string;
    difficulty: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    description: string;
    implementationTime: string;
    cost: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
  }
  
  export interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    progress: number;
    status: 'On Track' | 'At Risk' | 'Completed';
  }
  
  export interface ComplianceScore {
    standard: string;
    score: number;
    maxScore: number;
    status: 'Excellent' | 'Good' | 'Needs Improvement';
    criteria: {
      met: string[];
      unmet: string[];
    };
  }
  
  export const organizationData = {
    name: "TechGreen Solutions Inc.",
    totalEmissions: 12450,
    monthlyTrend: -8.2,
    complianceScore: 82,
    sustainabilityRating: "B+"
  };
  
  export const emissionData: EmissionEntry[] = [
    {
      id: "1",
      date: "2024-01-15",
      category: "Energy",
      source: "Electricity",
      value: 12500,
      unit: "kWh",
      co2e: 6850,
      department: "Facilities"
    },
    {
      id: "2",
      date: "2024-01-15",
      category: "Transport",
      source: "Company Vehicles",
      value: 2450,
      unit: "liters",
      co2e: 5800,
      department: "Transport"
    },
    {
      id: "3",
      date: "2024-01-10",
      category: "Production",
      source: "Manufacturing",
      value: 450,
      unit: "units",
      co2e: 3200,
      department: "Production"
    }
  ];
  
  export const departments: Department[] = [
    {
      id: "1",
      name: "Transport",
      manager: "Sarah Chen",
      emissionSources: ["Fleet Vehicles", "Business Travel", "Logistics"],
      monthlyEmissions: 5800,
      trend: "down"
    },
    {
      id: "2",
      name: "Energy",
      manager: "Mike Rodriguez",
      emissionSources: ["Electricity", "Natural Gas", "Generator"],
      monthlyEmissions: 6850,
      trend: "stable"
    },
    {
      id: "3",
      name: "Production",
      manager: "Emma Davis",
      emissionSources: ["Raw Materials", "Manufacturing", "Packaging"],
      monthlyEmissions: 3200,
      trend: "up"
    },
    {
      id: "4",
      name: "Facilities",
      manager: "James Wilson",
      emissionSources: ["HVAC", "Lighting", "Water"],
      monthlyEmissions: 1850,
      trend: "down"
    }
  ];
  
  export const reductionStrategies: ReductionStrategy[] = [
    {
      id: "1",
      title: "Switch to LED Lighting",
      category: "Energy Efficiency",
      difficulty: "Low",
      impact: "Medium",
      description: "Replace all traditional lighting with energy-efficient LED alternatives",
      implementationTime: "1-3 months",
      cost: "Medium",
      status: "In Progress"
    },
    {
      id: "2",
      title: "Electric Vehicle Fleet",
      category: "Transport",
      difficulty: "High",
      impact: "High",
      description: "Transition company vehicles to electric models",
      implementationTime: "12-18 months",
      cost: "High",
      status: "Not Started"
    },
    {
      id: "3",
      title: "Solar Panel Installation",
      category: "Renewable Energy",
      difficulty: "Medium",
      impact: "High",
      description: "Install solar panels on facility rooftops",
      implementationTime: "6-9 months",
      cost: "High",
      status: "Completed"
    }
  ];
  
  export const goals: Goal[] = [
    {
      id: "1",
      title: "Reduce Energy Consumption",
      target: 20,
      current: 12,
      unit: "%",
      deadline: "2024-12-31",
      progress: 60,
      status: "On Track"
    },
    {
      id: "2",
      title: "Increase Renewable Energy",
      target: 50,
      current: 25,
      unit: "%",
      deadline: "2024-12-31",
      progress: 50,
      status: "On Track"
    },
    {
      id: "3",
      title: "Reduce Fleet Emissions",
      target: 30,
      current: 8,
      unit: "%",
      deadline: "2024-12-31",
      progress: 27,
      status: "At Risk"
    }
  ];
  
  export const complianceScores: ComplianceScore[] = [
    {
      standard: "ISO 14064-1:2018",
      score: 85,
      maxScore: 100,
      status: "Excellent",
      criteria: {
        met: ["GHG Inventory", "Quantification Methods", "Reporting Principles"],
        unmet: ["Third-party Verification"]
      }
    },
    {
      standard: "GHG Protocol",
      score: 78,
      maxScore: 100,
      status: "Good",
      criteria: {
        met: ["Scope 1 & 2 Accounting", "Emission Factors"],
        unmet: ["Scope 3 Complete", "Supplier Data Collection"]
      }
    },
    {
      standard: "ESG Reporting",
      score: 65,
      maxScore: 100,
      status: "Needs Improvement",
      criteria: {
        met: ["Environmental Metrics", "Basic Disclosure"],
        unmet: ["Social Metrics", "Governance Framework", "Stakeholder Engagement"]
      }
    }
  ];
  
  export const chartColors = {
    energy: '#f59e0b',
    transport: '#3b82f6',
    production: '#8b5cf6',
    facilities: '#06b6d4',
    waste: '#ef4444',
    other: '#64748b'
  };

  // Add to existing Data.ts file

export const monthlyTrendData = [
    { month: 'Jan', emissions: 14500, reduction: 0 },
    { month: 'Feb', emissions: 13800, reduction: 4.8 },
    { month: 'Mar', emissions: 13200, reduction: 9.0 },
    { month: 'Apr', emissions: 12800, reduction: 11.7 },
    { month: 'May', emissions: 12450, reduction: 14.1 },
    { month: 'Jun', emissions: 11900, reduction: 17.9 },
  ];
  
  export const strategyCategories = [
    'Energy Efficiency',
    'Renewable Energy', 
    'Transport',
    'Waste Management',
    'Supply Chain',
    'Digital Transformation'
  ];
  
  export const goalTimeline = [
    { month: 'Jan', progress: 0 },
    { month: 'Feb', progress: 15 },
    { month: 'Mar', progress: 25 },
    { month: 'Apr', progress: 40 },
    { month: 'May', progress: 50 },
    { month: 'Jun', progress: 60 },
    { month: 'Jul', progress: 75 },
  ];