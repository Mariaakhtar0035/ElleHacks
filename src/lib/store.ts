import { Student, Mission, Reward, MissionStatus, MissionBandColor } from "@/types";

// In-memory data store
let students: Student[] = [
  {
    id: "alex",
    name: "Alex",
    spendTokens: 100,
    growTokens: 50,
    assignedMissions: [],
    purchasedRewards: [],
  },
  {
    id: "jordan",
    name: "Jordan",
    spendTokens: 100,
    growTokens: 50,
    assignedMissions: [],
    purchasedRewards: [],
  },
  {
    id: "sam",
    name: "Sam",
    spendTokens: 100,
    growTokens: 50,
    assignedMissions: [],
    purchasedRewards: [],
  },
];

let missions: Mission[] = [
  {
    id: "mission-1",
    title: "Organize Classroom Library",
    description: "Sort books by genre and create a catalog system",
    baseReward: 100,
    currentReward: 100,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-2",
    title: "Help Setup Science Lab",
    description: "Arrange equipment and label all materials",
    baseReward: 120,
    currentReward: 120,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-3",
    title: "Create Welcome Poster",
    description: "Design a colorful poster for new students",
    baseReward: 80,
    currentReward: 80,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-4",
    title: "Tech Helper for Week",
    description: "Assist classmates with computer problems",
    baseReward: 150,
    currentReward: 150,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-5",
    title: "Lunch Monitor Assistant",
    description: "Help organize lunch line and clean up",
    baseReward: 90,
    currentReward: 90,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-6",
    title: "Garden Maintenance",
    description: "Water plants and remove weeds from school garden",
    baseReward: 110,
    currentReward: 110,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-7",
    title: "Peer Tutoring Session",
    description: "Help a classmate with homework for 30 minutes",
    baseReward: 130,
    currentReward: 130,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
  {
    id: "mission-8",
    title: "Event Planning Helper",
    description: "Assist with organizing the class celebration",
    baseReward: 140,
    currentReward: 140,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
  },
];

const rewards: Reward[] = [
  {
    id: "reward-1",
    title: "Extra Deadline Extension",
    description: "Get 2 extra days for any assignment",
    cost: 50,
    icon: "⏰",
  },
  {
    id: "reward-2",
    title: "Test Hint Card",
    description: "Get one helpful hint during a test",
    cost: 30,
    icon: "💡",
  },
  {
    id: "reward-3",
    title: "Homework Pass",
    description: "Skip one homework assignment",
    cost: 80,
    icon: "📝",
  },
  {
    id: "reward-4",
    title: "Mystery Reward",
    description: "A surprise reward chosen by your teacher!",
    cost: 100,
    icon: "🎁",
    soldOut: Math.random() > 0.5, // Randomly sold out
  },
];

// Supply & Demand calculation
export function calculateReward(baseReward: number, requestCount: number): number {
  if (requestCount === 0) return baseReward;
  
  const currentReward = baseReward * (1 - (requestCount - 1) * 0.1);
  const minimum = baseReward * 0.5;
  
  return Math.max(Math.floor(currentReward), Math.floor(minimum));
}

// Student functions
export function getStudents(): Student[] {
  return students;
}

export function getStudent(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function updateStudent(id: string, data: Partial<Student>): Student | null {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...data };
  return students[index];
}

// Mission functions
export function getMissions(): Mission[] {
  return missions;
}

export function getMission(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function updateMission(id: string, data: Partial<Mission>): Mission | null {
  const index = missions.findIndex((m) => m.id === id);
  if (index === -1) return null;
  
  missions[index] = { ...missions[index], ...data };
  return missions[index];
}

export type CreateMissionData = {
  title: string;
  description: string;
  baseReward: number;
  bandColor?: MissionBandColor;
};

export function createMission(data: CreateMissionData): Mission {
  const id = `mission-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const mission: Mission = {
    id,
    title: data.title,
    description: data.description,
    baseReward: data.baseReward,
    currentReward: data.baseReward,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: data.bandColor,
  };
  missions.push(mission);
  return mission;
}

export function deleteMission(missionId: string): boolean {
  const index = missions.findIndex((m) => m.id === missionId);
  if (index === -1) return false;
  
  const mission = missions[index];
  if (mission.assignedStudentId) {
    const student = getStudent(mission.assignedStudentId);
    if (student) {
      const updated = student.assignedMissions.filter((id) => id !== missionId);
      updateStudent(student.id, { assignedMissions: updated });
    }
  }
  missions.splice(index, 1);
  return true;
}

export function unassignMission(missionId: string): Mission | null {
  const mission = getMission(missionId);
  if (!mission || !mission.assignedStudentId) return null;
  
  const studentId = mission.assignedStudentId;
  const student = getStudent(studentId);
  if (student) {
    const updated = student.assignedMissions.filter((id) => id !== missionId);
    updateStudent(studentId, { assignedMissions: updated });
  }
  
  mission.assignedStudentId = undefined;
  mission.status = "AVAILABLE";
  return updateMission(missionId, mission);
}

export function requestMission(studentId: string, missionId: string): Mission | null {
  const mission = getMission(missionId);
  const student = getStudent(studentId);
  
  if (!mission || !student) return null;
  if (mission.assignedStudentId) return null; // Already assigned
  if (mission.requestedBy.includes(studentId)) return null; // Already requested
  
  // Add student to requestedBy
  mission.requestedBy.push(studentId);
  mission.requestCount = mission.requestedBy.length;
  
  // Recalculate reward
  mission.currentReward = calculateReward(mission.baseReward, mission.requestCount);
  mission.status = "REQUESTED";
  
  return updateMission(missionId, mission);
}

export function assignMission(missionId: string, studentId: string): Mission | null {
  const mission = getMission(missionId);
  const student = getStudent(studentId);
  
  if (!mission || !student) return null;
  if (mission.assignedStudentId) return null; // Already assigned
  
  // Assign mission to student
  mission.assignedStudentId = studentId;
  mission.status = "IN_PROGRESS";
  
  // Add to student's assigned missions
  if (!student.assignedMissions.includes(missionId)) {
    student.assignedMissions.push(missionId);
    updateStudent(studentId, student);
  }
  
  return updateMission(missionId, mission);
}

export function completeMission(missionId: string): { mission: Mission; student: Student } | null {
  const mission = getMission(missionId);
  if (!mission || !mission.assignedStudentId) return null;
  
  const student = getStudent(mission.assignedStudentId);
  if (!student) return null;
  
  // Calculate token split (70% spend, 30% grow)
  const reward = mission.currentReward;
  const spendAmount = Math.floor(reward * 0.7);
  const growAmount = Math.floor(reward * 0.3);
  
  // Award tokens
  student.spendTokens += spendAmount;
  student.growTokens += growAmount;
  
  // Update mission status
  mission.status = "COMPLETED";
  
  updateMission(missionId, mission);
  updateStudent(student.id, student);
  
  return { mission, student };
}

// Reward functions
export function getRewards(): Reward[] {
  return rewards;
}

export function purchaseReward(studentId: string, rewardId: string): { student: Student; reward: Reward } | null {
  const student = getStudent(studentId);
  const reward = rewards.find((r) => r.id === rewardId);
  
  if (!student || !reward) return null;
  if (reward.soldOut) return null;
  if (student.spendTokens < reward.cost) return null;
  
  // Deduct tokens
  student.spendTokens -= reward.cost;
  
  // Add to purchased rewards
  if (!student.purchasedRewards.includes(rewardId)) {
    student.purchasedRewards.push(rewardId);
  }
  
  updateStudent(studentId, student);
  
  return { student, reward };
}

// Helper to get available missions (not assigned)
export function getAvailableMissions(): Mission[] {
  return missions.filter((m) => !m.assignedStudentId);
}

// Helper to get student's assigned missions
export function getStudentMissions(studentId: string): Mission[] {
  return missions.filter((m) => m.assignedStudentId === studentId);
}

// Helper to get missions pending approval
export function getPendingApprovalMissions(): Mission[] {
  return missions.filter((m) => m.status === "IN_PROGRESS" && m.assignedStudentId);
}
