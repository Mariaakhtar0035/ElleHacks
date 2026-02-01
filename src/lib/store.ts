import { Student, Mission, Reward, MissionStatus, MissionBandColor, BalanceHistoryEntry, PendingReward } from "@/types";
import { generateHistoryFromCurrent } from "@/lib/growthCalculator";
import { RECOMMENDED_SPEND_RATIO, RECOMMENDED_SAVE_RATIO, RECOMMENDED_GROW_RATIO } from "@/lib/constants";

// In-memory data store - prepopulated with varied activity
let students: Student[] = [
  {
    id: "alex",
    name: "Alex",
    pin: "1234",
    spendTokens: 165,
    saveTokens: 60,
    growTokens: 95,
    assignedMissions: ["mission-1", "mission-5"],
    purchasedRewards: ["reward-2"],
    balanceHistory: [
      { week: 1, spendBalance: 20, saveBalance: 6, growBalance: 10 },
      { week: 2, spendBalance: 55, saveBalance: 12, growBalance: 22 },
      { week: 3, spendBalance: 48, saveBalance: 18, growBalance: 35 },
      { week: 4, spendBalance: 72, saveBalance: 24, growBalance: 48 },
      { week: 5, spendBalance: 95, saveBalance: 30, growBalance: 62 },
      { week: 6, spendBalance: 78, saveBalance: 36, growBalance: 72 },
      { week: 7, spendBalance: 102, saveBalance: 42, growBalance: 78 },
      { week: 8, spendBalance: 125, saveBalance: 48, growBalance: 82 },
      { week: 9, spendBalance: 118, saveBalance: 52, growBalance: 85 },
      { week: 10, spendBalance: 142, saveBalance: 54, growBalance: 88 },
      { week: 11, spendBalance: 158, saveBalance: 58, growBalance: 91 },
      { week: 12, spendBalance: 165, saveBalance: 60, growBalance: 95 },
    ],
  },
  {
    id: "jordan",
    name: "Jordan",
    pin: "1234",
    spendTokens: 45,
    saveTokens: 30,
    growTokens: 82,
    assignedMissions: ["mission-2"],
    purchasedRewards: ["reward-1", "reward-2"],
    balanceHistory: [
      { week: 1, spendBalance: 30, saveBalance: 3, growBalance: 15 },
      { week: 2, spendBalance: 65, saveBalance: 6, growBalance: 28 },
      { week: 3, spendBalance: 52, saveBalance: 9, growBalance: 38 },
      { week: 4, spendBalance: 38, saveBalance: 12, growBalance: 48 },
      { week: 5, spendBalance: 55, saveBalance: 15, growBalance: 55 },
      { week: 6, spendBalance: 42, saveBalance: 18, growBalance: 62 },
      { week: 7, spendBalance: 48, saveBalance: 21, growBalance: 68 },
      { week: 8, spendBalance: 45, saveBalance: 24, growBalance: 74 },
      { week: 9, spendBalance: 50, saveBalance: 27, growBalance: 78 },
      { week: 10, spendBalance: 45, saveBalance: 30, growBalance: 82 },
    ],
  },
  {
    id: "sam",
    name: "Sam",
    pin: "1234",
    spendTokens: 230,
    saveTokens: 90,
    growTokens: 120,
    assignedMissions: ["mission-3"],
    purchasedRewards: ["reward-1", "reward-3"],
  },
  {
    id: "riley",
    name: "Riley",
    pin: "1234",
    spendTokens: 88,
    saveTokens: 40,
    growTokens: 65,
    assignedMissions: ["mission-4"],
    purchasedRewards: [],
  },
  {
    id: "morgan",
    name: "Morgan",
    pin: "1234",
    spendTokens: 142,
    saveTokens: 55,
    growTokens: 55,
    assignedMissions: ["mission-6"],
    purchasedRewards: ["reward-2", "reward-4"],
  },
  {
    id: "casey",
    name: "Casey",
    pin: "1234",
    spendTokens: 100,
    saveTokens: 35,
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
    status: "IN_PROGRESS",
    assignedStudentId: "alex",
    bandColor: "green",
  },
  {
    id: "mission-2",
    title: "Help Setup Science Lab",
    description: "Arrange equipment and label all materials",
    baseReward: 120,
    currentReward: 120,
    requestCount: 0,
    requestedBy: [],
    status: "IN_PROGRESS",
    assignedStudentId: "jordan",
    bandColor: "darkBlue",
  },
  {
    id: "mission-3",
    title: "Create Welcome Poster",
    description: "Design a colorful poster for new students",
    baseReward: 80,
    currentReward: 80,
    requestCount: 0,
    requestedBy: [],
    status: "IN_PROGRESS",
    assignedStudentId: "sam",
    bandColor: "lightBlue",
  },
  {
    id: "mission-4",
    title: "Tech Helper for Week",
    description: "Assist classmates with computer problems",
    baseReward: 150,
    currentReward: 150,
    requestCount: 0,
    requestedBy: [],
    status: "IN_PROGRESS",
    assignedStudentId: "riley",
    bandColor: "red",
  },
  {
    id: "mission-5",
    title: "Lunch Monitor Assistant",
    description: "Help organize lunch line and clean up",
    baseReward: 90,
    currentReward: 90,
    requestCount: 0,
    requestedBy: [],
    status: "IN_PROGRESS",
    assignedStudentId: "alex",
    bandColor: "yellow",
  },
  {
    id: "mission-6",
    title: "Garden Maintenance",
    description: "Water plants and remove weeds from school garden",
    baseReward: 110,
    currentReward: 110,
    requestCount: 0,
    requestedBy: [],
    status: "IN_PROGRESS",
    assignedStudentId: "morgan",
    bandColor: "orange",
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
    bandColor: "brown",
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
    bandColor: "purple",
  },
  {
    id: "mission-9",
    title: "Recycle Program Leader",
    description: "Collect and sort recyclables for one week",
    baseReward: 95,
    currentReward: 95,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "green",
  },
  {
    id: "mission-10",
    title: "Morning Greeter",
    description: "Welcome classmates at the door each morning",
    baseReward: 75,
    currentReward: 75,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "lightBlue",
  },
  {
    id: "mission-11",
    title: "Art Supply Organizer",
    description: "Tidy and label art supplies in the classroom",
    baseReward: 85,
    currentReward: 85,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "red",
  },
  {
    id: "mission-12",
    title: "Weather Reporter",
    description: "Update the classroom weather chart each day",
    baseReward: 70,
    currentReward: 70,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "yellow",
  },
  {
    id: "mission-13",
    title: "Class Photographer",
    description: "Take photos at the next class event",
    baseReward: 125,
    currentReward: 125,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "purple",
  },
  {
    id: "mission-14",
    title: "Snack Helper",
    description: "Help pass out snacks and clean up after",
    baseReward: 65,
    currentReward: 65,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "orange",
  },
  {
    id: "mission-15",
    title: "Math Game Host",
    description: "Lead a math review game for the class",
    baseReward: 160,
    currentReward: 160,
    requestCount: 0,
    requestedBy: [],
    status: "AVAILABLE",
    bandColor: "darkBlue",
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
    soldOut: false,
  },
  {
    id: "reward-5",
    title: "Choose the Class Game",
    description: "Pick the game for Friday fun time",
    cost: 45,
    icon: "🎮",
  },
  {
    id: "reward-6",
    title: "Sit by a Friend",
    description: "Choose your seat for one day",
    cost: 25,
    icon: "🪑",
  },
  {
    id: "reward-7",
    title: "Lunch with the Teacher",
    description: "Special lunch in the classroom",
    cost: 120,
    icon: "🍽️",
    soldOut: true,
  },
  {
    id: "reward-8",
    title: "No Uniform Day Pass",
    description: "Wear your favorite outfit to school",
    cost: 75,
    icon: "👕",
  },
  {
    id: "reward-9",
    title: "Extra Recess Time",
    description: "5 extra minutes at recess",
    cost: 40,
    icon: "⚽",
  },
  {
    id: "reward-10",
    title: "Class DJ for a Day",
    description: "Pick the music during work time",
    cost: 60,
    icon: "🎵",
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

export function verifyStudentPin(studentId: string, pin: string): boolean {
  const student = getStudent(studentId);
  if (!student) return false;
  return student.pin === pin;
}

/**
 * Returns balance history for chart. Uses student.balanceHistory if present,
 * otherwise generates plausible history from current spend/grow balances.
 */
export function getBalanceHistory(studentId: string): BalanceHistoryEntry[] {
  const student = getStudent(studentId);
  if (!student) return [];
  if (student.balanceHistory && student.balanceHistory.length > 0) {
    return student.balanceHistory;
  }
  return generateHistoryFromCurrent(student.spendTokens, student.saveTokens, student.growTokens);
}

export function updateStudent(id: string, data: Partial<Student>): Student | null {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...data };
  return students[index];
}

export type CreateStudentData = {
  name: string;
  pin?: string;
};

export function createStudent(data: CreateStudentData): Student {
  const slug = data.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const baseId = slug || "student";
  let id = baseId;
  let suffix = 1;
  while (students.some((s) => s.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }
  const student: Student = {
    id,
    name: data.name.trim(),
    pin: (data.pin && /^\d{4}$/.test(data.pin)) ? data.pin : "1234",
    spendTokens: 100,
    saveTokens: 40,
    growTokens: 50,
    assignedMissions: [],
    purchasedRewards: [],
  };
  students.push(student);
  return student;
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

let pendingRewards: PendingReward[] = [];

export function getRecommendedSplit(total: number): { spend: number; save: number; grow: number } {
  const spend = Math.floor(total * RECOMMENDED_SPEND_RATIO);
  const save = Math.floor(total * RECOMMENDED_SAVE_RATIO);
  const grow = Math.max(0, total - spend - save);
  return { spend, save, grow };
}

export function getPendingRewardsForStudent(studentId: string): PendingReward[] {
  return pendingRewards.filter((p) => p.studentId === studentId);
}

export function claimPendingReward(
  pendingId: string,
  spendAmount: number,
  saveAmount: number,
  growAmount: number
): { mission: Mission; student: Student } | null {
  const index = pendingRewards.findIndex((p) => p.id === pendingId);
  if (index === -1) return null;
  const pending = pendingRewards[index]!;
  if (spendAmount < 0 || saveAmount < 0 || growAmount < 0 || spendAmount + saveAmount + growAmount !== pending.totalAmount) {
    return null;
  }
  const student = getStudent(pending.studentId);
  const mission = getMission(pending.missionId);
  if (!student || !mission) return null;

  // Update student tokens
  const updatedStudent = updateStudent(student.id, {
    spendTokens: student.spendTokens + spendAmount,
    saveTokens: student.saveTokens + saveAmount,
    growTokens: student.growTokens + growAmount,
  });
  
  // Remove pending reward
  pendingRewards.splice(index, 1);

  return { mission, student: updatedStudent! };
}

export type TokenBucket = "spend" | "save" | "grow";

export function transferTokens(
  studentId: string,
  amount: number,
  from: TokenBucket,
  to: TokenBucket
): { student: Student } | null {
  const student = getStudent(studentId);
  if (!student) return null;
  if (amount <= 0) return null;
  if (from === to) return null;

  const balances = {
    spend: student.spendTokens,
    save: student.saveTokens,
    grow: student.growTokens,
  };

  if (balances[from] < amount) return null;

  const updated = { ...balances };
  updated[from] -= amount;
  updated[to] += amount;

  const updatedStudent = updateStudent(studentId, {
    spendTokens: updated.spend,
    saveTokens: updated.save,
    growTokens: updated.grow,
  });

  return { student: updatedStudent! };
}

export function completeMission(missionId: string): { mission: Mission; student: Student; pendingReward: PendingReward } | null {
  const mission = getMission(missionId);
  if (!mission || !mission.assignedStudentId) return null;

  const student = getStudent(mission.assignedStudentId);
  if (!student) return null;

  const reward = mission.currentReward;
  mission.status = "COMPLETED";
  updateMission(missionId, mission);

  const pendingReward: PendingReward = {
    id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    missionId,
    studentId: student.id,
    missionTitle: mission.title,
    totalAmount: reward,
  };
  pendingRewards.push(pendingReward);

  return { mission, student, pendingReward };
}

// Reward functions
export function getRewards(): Reward[] {
  return rewards;
}

export function getReward(id: string): Reward | undefined {
  return rewards.find((r) => r.id === id);
}

export type CreateRewardData = {
  title: string;
  description: string;
  cost: number;
  icon: string;
  soldOut?: boolean;
};

export function createReward(data: CreateRewardData): Reward {
  const id = `reward-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const reward: Reward = {
    id,
    title: data.title,
    description: data.description,
    cost: data.cost,
    icon: data.icon,
    soldOut: data.soldOut ?? false,
  };
  rewards.push(reward);
  return reward;
}

export function updateReward(id: string, data: Partial<Reward>): Reward | null {
  const index = rewards.findIndex((r) => r.id === id);
  if (index === -1) return null;
  rewards[index] = { ...rewards[index], ...data };
  return rewards[index];
}

export function deleteReward(rewardId: string): boolean {
  const index = rewards.findIndex((r) => r.id === rewardId);
  if (index === -1) return false;
  // Remove from all students' purchasedRewards
  students.forEach((student) => {
    if (student.purchasedRewards.includes(rewardId)) {
      const updated = student.purchasedRewards.filter((id) => id !== rewardId);
      updateStudent(student.id, { purchasedRewards: updated });
    }
  });
  rewards.splice(index, 1);
  return true;
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
