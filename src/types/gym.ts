export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'full_body';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'smith_machine'
  | 'other';

export type MovementPattern =
  | 'push'
  | 'pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'isolation';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type UnitType = 'kg' | 'lb';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  unit: UnitType;
  bodyWeight: number; // in kg (will convert display based on unit)
  targetWeight?: number; // target weight in kg
  height: number; // in cm
  targetGoal: string;
  createdAt: string;
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  note?: string;
  loggedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  vietnameseName: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType;
  movementPattern: MovementPattern;
  difficulty: Difficulty;
  instructions: string[];
  cues: string[];
  imageUrl?: string;
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface TemplateExercise {
  id: string; // unique item id inside template
  exerciseId: string;
  order: number;
  targetSets: number;
  repMin: number;
  repMax: number;
  targetWeight: number; // kg
  targetRpe: number; // 6 - 10
  targetRir: number; // 0 - 4
  restSeconds: number; // e.g. 90
  supersetGroupId?: string; // grouped with another exercise for superset
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  estimatedDurationMinutes: number;
  exercises: TemplateExercise[];
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'rest';

export interface ScheduledWorkout {
  id: string;
  date: string; // YYYY-MM-DD
  templateId?: string;
  customTitle?: string;
  status: ScheduleStatus;
  completedSessionId?: string;
  notes?: string;
}

export interface SetLog {
  id: string;
  setNumber: number;
  targetWeight: number;
  targetReps: number;
  actualWeight: number;
  actualReps: number;
  rpe: number;
  rir: number;
  completed: boolean;
  isWarmup?: boolean;
  isDropSet?: boolean;
  completedAt?: string;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  supersetGroupId?: string;
  notes?: string;
  sets: SetLog[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: 'heaviest_weight' | 'max_reps' | 'estimated_1rm' | 'highest_volume';
  value: number; // weight in kg or reps or volume
  repsAtWeight?: number;
  achievedAt: string; // ISO date
  sessionId: string;
}

export interface WorkoutSession {
  id: string;
  templateId?: string;
  title: string;
  startTime: string; // ISO date
  endTime?: string;
  durationSeconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  notes: string;
  exercises: SessionExercise[];
  totalVolume: number; // Sum of (weight * reps) for completed sets
  totalCompletedSets: number;
  targetCompletionRate: number; // percentage 0-100%
  prsAchieved: PersonalRecord[];
  strainScore: number; // 0.0 - 21.0 WHOOP strain calculation
}

export interface Goal {
  id: string;
  exerciseId: string;
  metric: 'weight' | 'reps' | 'estimated_1rm' | 'volume';
  baseline: number;
  target: number;
  current: number;
  targetDate?: string;
  status: 'active' | 'achieved';
  createdAt: string;
}

export interface ProgressionSuggestion {
  id: string;
  exerciseId: string;
  type: 'increase_weight' | 'increase_reps' | 'plateau_warning';
  title: string;
  reason: string;
  suggestedWeightDelta: number; // e.g. +2.5kg
  suggestedRepRange?: string;
  status: 'pending' | 'accepted' | 'dismissed';
}

export interface RestTimerState {
  isActive: boolean;
  isRunning: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  exerciseName?: string;
  setNumber?: number;
}
