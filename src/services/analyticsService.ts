import { AnalyticsData } from '../types/onboarding';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_ANALYTICS: AnalyticsData = {
  kpis: [
    {
      id: 'kpi-1',
      label: 'Total Hires (YTD)',
      value: '1,248',
      change: '+18.4%',
      isPositive: true,
      description: 'Total technical & operational employees recruited across all engineering hubs',
      period: 'vs previous year'
    },
    {
      id: 'kpi-2',
      label: 'Active Onboarding Cohort',
      value: '42',
      change: '+6',
      isPositive: true,
      description: 'Candidates currently progressing through pre-boarding & Day-1 milestones',
      period: 'this month'
    },
    {
      id: 'kpi-3',
      label: 'Completed This Month',
      value: '86',
      change: '+24.1%',
      isPositive: true,
      description: 'New hires who have completed all checklists and domain skill verifications',
      period: 'vs last month'
    },
    {
      id: 'kpi-4',
      label: 'Avg Time to Productive',
      value: '14.2 Days',
      change: '-3.8 Days',
      isPositive: true,
      description: 'Average duration from Day 1 to first production pull request merge',
      period: 'industry benchmark: 28d'
    },
    {
      id: 'kpi-5',
      label: '90-Day Retention Rate',
      value: '94.6%',
      change: '+2.3%',
      isPositive: true,
      description: 'Percentage of onboarded engineers retained past first quarterly review',
      period: 'top quartile'
    }
  ],
  funnel: [
    { stage: 'Applied', count: 14200, conversionRate: 100, dropOffRate: 0 },
    { stage: 'AI Screened', count: 4260, conversionRate: 30, dropOffRate: 70 },
    { stage: 'Technical Assessment', count: 1840, conversionRate: 43.2, dropOffRate: 56.8 },
    { stage: 'Manager Interviewed', count: 720, conversionRate: 39.1, dropOffRate: 60.9 },
    { stage: 'Offer Extended', count: 290, conversionRate: 40.3, dropOffRate: 59.7 },
    { stage: 'Fully Onboarded', count: 268, conversionRate: 92.4, dropOffRate: 7.6 }
  ],
  monthlyTrends: [
    { month: 'Oct 25', hires: 64, offers: 72, target: 60 },
    { month: 'Nov 25', hires: 78, offers: 85, target: 70 },
    { month: 'Dec 25', hires: 52, offers: 60, target: 55 },
    { month: 'Jan 26', hires: 94, offers: 102, target: 85 },
    { month: 'Feb 26', hires: 88, offers: 95, target: 80 },
    { month: 'Mar 26', hires: 106, offers: 115, target: 95 },
    { month: 'Apr 26', hires: 98, offers: 110, target: 90 },
    { month: 'May 26', hires: 112, offers: 124, target: 100 },
    { month: 'Jun 26', hires: 125, offers: 135, target: 110 },
    { month: 'Jul 26', hires: 118, offers: 128, target: 105 },
    { month: 'Aug 26', hires: 132, offers: 142, target: 115 },
    { month: 'Sep 26', hires: 145, offers: 158, target: 125 }
  ],
  skillDistribution: [
    { skill: 'AI / Machine Learning', headcount: 340, percentage: 27.2, color: '#8b5cf6' },
    { skill: 'Cloud & DevOps (K8s)', headcount: 285, percentage: 22.8, color: '#3b82f6' },
    { skill: 'Fullstack / Frontend', headcount: 240, percentage: 19.2, color: '#06b6d4' },
    { skill: 'Distributed Backend', headcount: 215, percentage: 17.2, color: '#10b981' },
    { skill: 'Data Eng & Analytics', headcount: 168, percentage: 13.6, color: '#f59e0b' }
  ],
  departmentStats: [
    {
      department: 'Core AI Platform & Infrastructure',
      activeOnboarding: 14,
      completionRate: 96.2,
      avgDaysToProductive: 12.8
    },
    {
      department: 'Data Platform & Petabyte Streaming',
      activeOnboarding: 10,
      completionRate: 91.5,
      avgDaysToProductive: 15.4
    },
    {
      department: 'Cloud Security & Infrastructure',
      activeOnboarding: 8,
      completionRate: 95.0,
      avgDaysToProductive: 13.1
    },
    {
      department: 'Enterprise Applications & UI/UX',
      activeOnboarding: 10,
      completionRate: 97.4,
      avgDaysToProductive: 11.2
    }
  ],
  aiInsights: [
    {
      id: 'ins-01',
      category: 'Velocity',
      title: 'Accelerated Time-to-First PR in AI Platform Cohort',
      description: 'Engineers who completed the interactive Live Coding baseline before Day 1 shipped their first production code 4.6 days faster than average.',
      severity: 'success',
      metric: '-32% Onboarding Friction',
      actionRecommendation: 'Recommend making Domain Skills Live Coding mandatory in pre-boarding flow.'
    },
    {
      id: 'ins-02',
      category: 'Skill Gap',
      title: 'Cluster-Wide Demand for Apache Spark & Ray Optimization',
      description: 'ML Engineering new hires show a 17% average gap in distributed data streaming compared to production workload requirements.',
      severity: 'warning',
      metric: '17% Aggregate Gap',
      actionRecommendation: 'Auto-assign "Petabyte ML with Spark & Ray" to all upcoming AI track new hires.'
    },
    {
      id: 'ins-03',
      category: 'Retention',
      title: 'Retention Predictor Flags High Stability in Q3 Hires',
      description: 'Machine learning model projects 94.6% 1-year retention based on high role-fit scores and manager engagement velocity.',
      severity: 'info',
      metric: '4.2yr Avg Predicted Tenure',
      actionRecommendation: 'Maintain bi-weekly manager sync cadences through first 90 days.'
    },
    {
      id: 'ins-04',
      category: 'Efficiency',
      title: 'AI Document Verification Eliminates 88% Manual Review Load',
      description: 'Automated OCR & cryptographic check digit validation has reduced HR document verification latency from 3.5 days to 4.2 minutes.',
      severity: 'success',
      metric: '96.4% Verification Automation',
      actionRecommendation: 'Expand automated parsing to international tax declarations.'
    }
  ],
  lastUpdated: new Date().toISOString()
};

export const analyticsService = {
  /**
   * Get Enterprise Big Data Analytics Data
   */
  async getAnalytics(department?: string, timeRange?: string): Promise<AnalyticsData> {
    await delay(450);

    // If filtering by department, tailor statistics slightly
    if (department && department !== 'All Departments') {
      const deptStat = DEFAULT_ANALYTICS.departmentStats.find((d) => d.department === department);
      return {
        ...DEFAULT_ANALYTICS,
        kpis: DEFAULT_ANALYTICS.kpis.map((kpi) => {
          if (kpi.id === 'kpi-2' && deptStat) {
            return { ...kpi, value: deptStat.activeOnboarding.toString() };
          }
          if (kpi.id === 'kpi-4' && deptStat) {
            return { ...kpi, value: `${deptStat.avgDaysToProductive} Days` };
          }
          return kpi;
        }),
        lastUpdated: new Date().toISOString()
      };
    }

    return {
      ...DEFAULT_ANALYTICS,
      lastUpdated: new Date().toISOString()
    };
  }
};
