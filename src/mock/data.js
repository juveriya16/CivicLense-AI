export const currentUser = {
  id: 'u_1001',
  fullName: 'Aarav Mehta',
  username: 'aarav.mehta',
  email: 'aarav.mehta@example.com',
  phone: '+91 98200 11234',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400069',
  avatar: null,
  joinedAt: '2025-11-02',
  badge: 'Civic Champion',
  contributionScore: 742,
  level: 4,
  levelProgress: 68, // % to next level
  totalReports: 21,
  resolvedReports: 16,
  leaderboardRank: 12,
  badges: [
    { id: 'b1', label: 'First Report', earned: true },
    { id: 'b2', label: 'Streak — 7 Days', earned: true },
    { id: 'b3', label: '10 Resolved', earned: true },
    { id: 'b4', label: 'Neighbourhood Hero', earned: true },
    { id: 'b5', label: 'Top 10 Citizen', earned: false },
  ],
}

export const weeklyActivity = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  reportsSubmitted: [1, 0, 2, 1, 0, 3, 1],
  reportsResolved:  [0, 1, 1, 2, 1, 1, 2],
}

export const cityStats = {
  totalReports: 1204,
  resolvedPct: 83,
  avgResolutionDays: 2.4,
  overdue: 19,
  byCategory: {
    labels: ['Pothole', 'Garbage', 'Streetlight', 'Signal', 'Water Leak', 'Road Crack'],
    values: [412, 268, 190, 96, 140, 98],
  },
}

export const nearbyIssues = [
  { id: 'CL-0491', title: 'Broken footpath tile', category: 'road_crack', distanceKm: 0.3, status: 'submitted' },
  { id: 'CL-0488', title: 'Garbage near market', category: 'garbage', distanceKm: 0.6, status: 'assigned' },
  { id: 'CL-0483', title: 'Flickering streetlight', category: 'streetlight', distanceKm: 0.9, status: 'in_progress' },
  { id: 'CL-0479', title: 'Water logging on service road', category: 'water_leakage', distanceKm: 1.2, status: 'submitted' },
]

export const cityUpdates = [
  { id: 'n1', title: 'Ward 84 road resurfacing begins Monday', time: '2h ago' },
  { id: 'n2', title: 'New pothole task-force added for East zone', time: '1d ago' },
  { id: 'n3', title: 'Monsoon drain-clearing drive completed', time: '3d ago' },
]

export const notifications = [
  { id: 'nt1', type: 'status', title: 'Your report CL-0475 was resolved', body: 'Pothole on 5th Cross Street has been repaired.', time: '2 days ago', read: false },
  { id: 'nt2', type: 'assign', title: 'CL-0481 assigned to an officer', body: 'Officer R. Patil is now handling your traffic signal report.', time: '4 days ago', read: false },
  { id: 'nt3', type: 'system', title: 'Weekly city report is ready', body: '1,204 reports were filed across the city this month.', time: '5 days ago', read: true },
  { id: 'nt4', type: 'badge', title: 'You earned "Neighbourhood Hero"', body: 'Awarded for 15+ resolved reports in your ward.', time: '1 week ago', read: true },
  { id: 'nt5', type: 'assign', title: 'CL-0469 assigned to an officer', body: 'Officer A. Shaikh is now handling your garbage report.', time: '2 weeks ago', read: true },
]

export const weatherMock = {
  location: 'Andheri East, Mumbai',
  tempC: 29,
  condition: 'Light Rain',
  humidity: 78,
  windKph: 14,
}
