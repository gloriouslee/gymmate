'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import {
  UserProfile,
  Exercise,
  WorkoutTemplate,
  ScheduledWorkout,
  WorkoutSession,
  Goal,
  PersonalRecord,
  ProgressionSuggestion,
  RestTimerState,
  SetLog,
  SessionExercise,
  BodyWeightEntry
} from '@/types/gym';
import { DEFAULT_EXERCISES } from '@/data/defaultExercises';
import { DEFAULT_TEMPLATES } from '@/data/defaultTemplates';
import {
  INITIAL_USER,
  INITIAL_SCHEDULE,
  INITIAL_PRS,
  INITIAL_GOALS,
  INITIAL_SUGGESTIONS,
  INITIAL_PAST_SESSIONS,
  INITIAL_WEIGHT_HISTORY
} from '@/data/mockInitialData';
import {
  calculateEstimated1RM,
  calculateSessionVolume,
  calculateWorkoutStrain,
  playRestTimerChime,
  requestWakeLock
} from '@/utils/fitness';
import confetti from 'canvas-confetti';

interface GymContextType {
  // User Profile
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleUnit: () => void;

  // Exercises
  exercises: Exercise[];
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => void;
  updateExerciseImage: (exerciseId: string, imageUrl: string) => void;
  toggleFavoriteExercise: (exerciseId: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;

  // Templates
  templates: WorkoutTemplate[];
  saveTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  getTemplateById: (id: string) => WorkoutTemplate | undefined;

  // Schedule & Calendar
  schedule: ScheduledWorkout[];
  scheduleWorkoutOnDate: (date: string, templateId?: string, customTitle?: string) => void;
  moveScheduledWorkout: (workoutId: string, targetDate: string) => void;
  markDayAsRest: (date: string, notes?: string) => void;
  deleteScheduledWorkout: (workoutId: string) => void;
  getScheduleForDate: (date: string) => ScheduledWorkout[];

  // Live Workout Session
  activeSession: WorkoutSession | null;
  startSession: (options: { templateId?: string; scheduledId?: string; title?: string }) => void;
  updateActiveSessionNotes: (notes: string) => void;
  updateSetLog: (exerciseId: string, setId: string, updates: Partial<SetLog>) => void;
  addSetToExercise: (exerciseId: string) => void;
  removeSetFromExercise: (exerciseId: string, setId: string) => void;
  addExerciseToActiveSession: (exerciseId: string) => void;
  finishActiveSession: () => WorkoutSession | null;
  cancelActiveSession: () => void;

  // Rest Timer
  restTimer: RestTimerState;
  startRestTimer: (seconds: number, exerciseName?: string, setNumber?: number) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  addRestTimerSeconds: (seconds: number) => void;
  stopRestTimer: () => void;

  // Progression & Goals
  prs: PersonalRecord[];
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  suggestions: ProgressionSuggestion[];
  acceptSuggestion: (suggestionId: string) => void;
  dismissSuggestion: (suggestionId: string) => void;

  // History
  sessionHistory: WorkoutSession[];

  // Bodyweight Tracking
  weightHistory: BodyWeightEntry[];
  logBodyWeight: (weight: number, date?: string, note?: string) => void;
  deleteBodyWeightEntry: (id: string) => void;

  // Backup & Restore
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetAllData: () => void;

  // UI state
  activeTab: 'home' | 'plan' | 'progress' | 'library' | 'profile';
  setActiveTab: (tab: 'home' | 'plan' | 'progress' | 'library' | 'profile') => void;
  isWorkoutModalOpen: boolean;
  setIsWorkoutModalOpen: (open: boolean) => void;
  isWeightModalOpen: boolean;
  setIsWeightModalOpen: (open: boolean) => void;
  lastFinishedSession: WorkoutSession | null;
  setLastFinishedSession: (session: WorkoutSession | null) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

const STORAGE_KEY = 'gymmate_data_v1';

type PersistedGymData = {
  user?: UserProfile;
  exercises?: Exercise[];
  templates?: WorkoutTemplate[];
  schedule?: ScheduledWorkout[];
  sessionHistory?: WorkoutSession[];
  prs?: PersonalRecord[];
  goals?: Goal[];
  suggestions?: ProgressionSuggestion[];
  activeSession?: WorkoutSession | null;
  weightHistory?: BodyWeightEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isObjectArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.every(isRecord);
}

function parsePersistedGymData(value: unknown): PersistedGymData | null {
  if (!isRecord(value)) return null;
  const arrayFields = ['exercises', 'templates', 'schedule', 'sessionHistory', 'prs', 'goals', 'suggestions', 'weightHistory'] as const;
  if (arrayFields.some(field => field in value && !isObjectArray(value[field]))) return null;
  if ('user' in value && !isRecord(value.user)) return null;
  if ('activeSession' in value && value.activeSession !== null && !isRecord(value.activeSession)) return null;
  return value as PersistedGymData;
}

export function GymProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'progress' | 'library' | 'profile'>('home');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [lastFinishedSession, setLastFinishedSession] = useState<WorkoutSession | null>(null);

  // Core Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(DEFAULT_TEMPLATES);
  const [schedule, setSchedule] = useState<ScheduledWorkout[]>(INITIAL_SCHEDULE);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const activeScheduledIdRef = useRef<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<WorkoutSession[]>(INITIAL_PAST_SESSIONS);
  const [prs, setPrs] = useState<PersonalRecord[]>(INITIAL_PRS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [suggestions, setSuggestions] = useState<ProgressionSuggestion[]>(INITIAL_SUGGESTIONS);
  const [weightHistory, setWeightHistory] = useState<BodyWeightEntry[]>(INITIAL_WEIGHT_HISTORY);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  // Rest Timer State
  const [restTimer, setRestTimer] = useState<RestTimerState>({
    isActive: false,
    isRunning: false,
    remainingSeconds: 0,
    totalSeconds: 90
  });

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parsePersistedGymData(JSON.parse(saved));
        if (!parsed) {
          return;
        }
        if (parsed.user) React.startTransition(() => setUser(parsed.user!));
        if (parsed.exercises) {
          const merged = parsed.exercises.map((pe: Exercise) => {
            const def = DEFAULT_EXERCISES.find(d => d.id === pe.id);
            return {
              ...pe,
              imageUrl: pe.imageUrl || def?.imageUrl
            };
          });
          React.startTransition(() => setExercises(merged));
        }
        React.startTransition(() => {
          if (parsed.templates) setTemplates(parsed.templates);
          if (parsed.schedule) setSchedule(parsed.schedule);
          if (parsed.sessionHistory) setSessionHistory(parsed.sessionHistory);
          if (parsed.prs) setPrs(parsed.prs);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.suggestions) setSuggestions(parsed.suggestions);
          if (parsed.activeSession) setActiveSession(parsed.activeSession);
          if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
        });
      }
    } catch {
      // Fallback to initial mock data
    } finally {
      queueMicrotask(() => setHasLoadedStorage(true));
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      const dataToSave = {
        user,
        exercises,
        templates,
        schedule,
        sessionHistory,
        prs,
        goals,
        suggestions,
        activeSession,
        weightHistory
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [hasLoadedStorage, user, exercises, templates, schedule, sessionHistory, prs, goals, suggestions, activeSession, weightHistory]);

  // Rest timer countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (restTimer.isActive && restTimer.isRunning && restTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev.remainingSeconds <= 1) {
            playRestTimerChime();
            // Trigger vibration if available
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([200, 100, 200]);
              } catch {
                // ignore
              }
            }
            return {
              ...prev,
              remainingSeconds: 0,
              isRunning: false
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.isActive, restTimer.isRunning, restTimer.remainingSeconds]);

  // Session elapsed time timer
  useEffect(() => {
    let sessionInterval: ReturnType<typeof setInterval> | null = null;
    if (activeSession && activeSession.status === 'in_progress') {
      // Request wake lock to prevent screen sleep while working out
      requestWakeLock().then(lock => {
        wakeLockRef.current = lock;
      });

      sessionInterval = setInterval(() => {
        setActiveSession(prev => {
          if (!prev || prev.status !== 'in_progress') return prev;
          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1
          };
        });
      }, 1000);
    } else {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
    };
  }, [activeSession?.status]);

  // --- User Profile Functions ---
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const toggleUnit = () => {
    setUser(prev => ({
      ...prev,
      unit: prev.unit === 'kg' ? 'lb' : 'kg'
    }));
  };

  // --- Exercise Functions ---
  const addCustomExercise = (newEx: Omit<Exercise, 'id' | 'isCustom'>) => {
    const customExercise: Exercise = {
      ...newEx,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    setExercises(prev => [customExercise, ...prev]);
  };

  const updateExerciseImage = (exerciseId: string, imageUrl: string) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === exerciseId ? { ...ex, imageUrl } : ex))
    );
  };

  const toggleFavoriteExercise = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex
      )
    );
  };

  const getExerciseById = (id: string) => {
    return exercises.find(ex => ex.id === id);
  };

  // --- Template Functions ---
  const saveTemplate = (template: WorkoutTemplate) => {
    setTemplates(prev => {
      const index = prev.findIndex(t => t.id === template.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...template, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, { ...template, updatedAt: new Date().toISOString() }];
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id);
  };

  // --- Schedule & Calendar Functions ---
  const scheduleWorkoutOnDate = (date: string, templateId?: string, customTitle?: string) => {
    const newScheduled: ScheduledWorkout = {
      id: `sched-${Date.now()}`,
      date,
      templateId,
      customTitle,
      status: 'planned'
    };
    setSchedule(prev => [...prev.filter(s => !(s.date === date && s.status === 'rest')), newScheduled]);
  };

  const moveScheduledWorkout = (workoutId: string, targetDate: string) => {
    setSchedule(prev =>
      prev.map(s => (s.id === workoutId ? { ...s, date: targetDate } : s))
    );
  };

  const markDayAsRest = (date: string, notes?: string) => {
    const restItem: ScheduledWorkout = {
      id: `rest-${Date.now()}`,
      date,
      status: 'rest',
      notes: notes || 'Nghỉ ngơi phục hồi cơ bắp'
    };
    // Replace any planned workout on that date with rest
    setSchedule(prev => [...prev.filter(s => s.date !== date), restItem]);
  };

  const deleteScheduledWorkout = (workoutId: string) => {
    setSchedule(prev => prev.filter(s => s.id !== workoutId));
  };

  const getScheduleForDate = (date: string) => {
    return schedule.filter(s => s.date === date);
  };

  // --- Rest Timer Functions ---
  const startRestTimer = (seconds: number, exerciseName?: string, setNumber?: number) => {
    setRestTimer({
      isActive: true,
      isRunning: true,
      remainingSeconds: seconds,
      totalSeconds: seconds,
      exerciseName,
      setNumber
    });
  };

  const pauseRestTimer = () => {
    setRestTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeRestTimer = () => {
    setRestTimer(prev => ({ ...prev, isRunning: true }));
  };

  const addRestTimerSeconds = (seconds: number) => {
    setRestTimer(prev => ({
      ...prev,
      remainingSeconds: prev.remainingSeconds + seconds,
      totalSeconds: prev.totalSeconds + seconds
    }));
  };

  const stopRestTimer = () => {
    setRestTimer(prev => ({ ...prev, isActive: false, isRunning: false, remainingSeconds: 0 }));
  };

  // --- Live Workout Functions ---
  const startSession = ({
    templateId,
    scheduledId,
    title
  }: {
    templateId?: string;
    scheduledId?: string;
    title?: string;
  }) => {
    let sessionTitle = title || 'Buổi tập tự do';
    let sessionExercises: SessionExercise[] = [];

    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        sessionTitle = template.name;
        sessionExercises = template.exercises.map((te, index) => {
          // Look up previous session performance for this exercise
          const prevSession = [...sessionHistory].sort((a, b) => b.startTime.localeCompare(a.startTime)).find(s =>
            s.exercises.some(se => se.exerciseId === te.exerciseId)
          );
          const prevEx = prevSession?.exercises.find(se => se.exerciseId === te.exerciseId);
          const prevWeight = prevEx?.sets[0]?.actualWeight || te.targetWeight;
          const prevReps = prevEx?.sets[0]?.actualReps || te.repMin;

          const sets: SetLog[] = Array.from({ length: te.targetSets }, (_, i) => ({
            id: `set-${Date.now()}-${index}-${i}`,
            setNumber: i + 1,
            targetWeight: te.targetWeight || prevWeight,
            targetReps: te.repMin || prevReps,
            actualWeight: te.targetWeight || prevWeight,
            actualReps: te.repMin || prevReps,
            rpe: te.targetRpe || 8,
            rir: te.targetRir || 2,
            completed: false
          }));

          return {
            id: `se-${Date.now()}-${index}`,
            exerciseId: te.exerciseId,
            supersetGroupId: te.supersetGroupId,
            notes: te.notes || '',
            sets
          };
        });
      }
    }

    // If empty workout with no exercises, pick default compound
    if (sessionExercises.length === 0) {
      sessionExercises = [
        {
          id: `se-${Date.now()}-1`,
          exerciseId: 'barbell-bench-press',
          notes: '',
          sets: [
            { id: `set-${Date.now()}-1`, setNumber: 1, targetWeight: 60, targetReps: 8, actualWeight: 60, actualReps: 8, rpe: 8, rir: 2, completed: false },
            { id: `set-${Date.now()}-2`, setNumber: 2, targetWeight: 60, targetReps: 8, actualWeight: 60, actualReps: 8, rpe: 8, rir: 2, completed: false },
            { id: `set-${Date.now()}-3`, setNumber: 3, targetWeight: 60, targetReps: 8, actualWeight: 60, actualReps: 8, rpe: 8, rir: 2, completed: false }
          ]
        }
      ];
    }

    const newSession: WorkoutSession = {
      id: `sess-${Date.now()}`,
      templateId,
      title: sessionTitle,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      status: 'in_progress',
      notes: '',
      exercises: sessionExercises,
      totalVolume: 0,
      totalCompletedSets: 0,
      targetCompletionRate: 0,
      prsAchieved: [],
      strainScore: 0
    };

    setActiveSession(newSession);
    setIsWorkoutModalOpen(true);

    // If launched from a scheduled item, update its status
    if (scheduledId) {
      activeScheduledIdRef.current = scheduledId;
      setSchedule(prev =>
        prev.map(s => (s.id === scheduledId ? { ...s, status: 'in_progress' } : s))
      );
    }
  };

  const updateActiveSessionNotes = (notes: string) => {
    setActiveSession(prev => (prev ? { ...prev, notes } : null));
  };

  const updateSetLog = (exerciseId: string, setId: string, updates: Partial<SetLog>) => {
    if (!activeSession) return;

    setActiveSession(prev => {
      if (!prev) return null;
      let justCompleted = false;
      let restSecondsToTrigger = 90;

      const updatedExercises = prev.exercises.map(ex => {
        if (ex.exerciseId !== exerciseId) return ex;
        const updatedSets = ex.sets.map(s => {
          if (s.id === setId) {
            const nextCompleted = updates.completed !== undefined ? updates.completed : s.completed;
            if (!s.completed && nextCompleted) {
              justCompleted = true;
            }
            return {
              ...s,
              ...updates,
              completedAt: nextCompleted ? new Date().toISOString() : undefined
            };
          }
          return s;
        });
        return { ...ex, sets: updatedSets };
      });

      // If a set was just marked completed, trigger rest timer!
      if (justCompleted) {
        const targetEx = exercises.find(e => e.id === exerciseId);
        // Look up rest time in template if available
        if (prev.templateId) {
          const tmpl = templates.find(t => t.id === prev.templateId);
          const te = tmpl?.exercises.find(e => e.exerciseId === exerciseId);
          if (te?.restSeconds) restSecondsToTrigger = te.restSeconds;
        }
        startRestTimer(restSecondsToTrigger, targetEx?.name || 'Set hoàn thành');
      }

      // Recompute total volume and completed sets
      const allSets = updatedExercises.flatMap(e => e.sets);
      const volume = calculateSessionVolume(allSets);
      const completedCount = allSets.filter(s => s.completed).length;
      const rate = allSets.length > 0 ? Math.round((completedCount / allSets.length) * 100) : 0;
      const strain = calculateWorkoutStrain(volume, prev.durationSeconds);

      return {
        ...prev,
        exercises: updatedExercises,
        totalVolume: volume,
        totalCompletedSets: completedCount,
        targetCompletionRate: rate,
        strainScore: strain
      };
    });
  };

  const addSetToExercise = (exerciseId: string) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.exerciseId !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSetNumber = ex.sets.length + 1;
        const newSet: SetLog = {
          id: `set-${Date.now()}-${newSetNumber}`,
          setNumber: newSetNumber,
          targetWeight: lastSet ? lastSet.targetWeight : 60,
          targetReps: lastSet ? lastSet.targetReps : 8,
          actualWeight: lastSet ? lastSet.actualWeight : 60,
          actualReps: lastSet ? lastSet.actualReps : 8,
          rpe: lastSet ? lastSet.rpe : 8,
          rir: lastSet ? lastSet.rir : 2,
          completed: false
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const removeSetFromExercise = (exerciseId: string, setId: string) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.exerciseId !== exerciseId) return ex;
        const filtered = ex.sets.filter(s => s.id !== setId);
        // Renumber sets
        const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...ex, sets: renumbered };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const addExerciseToActiveSession = (exerciseId: string) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const newExItem: SessionExercise = {
        id: `se-${Date.now()}-${prev.exercises.length + 1}`,
        exerciseId,
        notes: '',
        sets: [
          { id: `s-${Date.now()}-1`, setNumber: 1, targetWeight: 50, targetReps: 10, actualWeight: 50, actualReps: 10, rpe: 8, rir: 2, completed: false },
          { id: `s-${Date.now()}-2`, setNumber: 2, targetWeight: 50, targetReps: 10, actualWeight: 50, actualReps: 10, rpe: 8, rir: 2, completed: false },
          { id: `s-${Date.now()}-3`, setNumber: 3, targetWeight: 50, targetReps: 10, actualWeight: 50, actualReps: 10, rpe: 8, rir: 2, completed: false }
        ]
      };
      return { ...prev, exercises: [...prev.exercises, newExItem] };
    });
  };

  const finishActiveSession = (): WorkoutSession | null => {
    if (!activeSession) return null;

    stopRestTimer();

    const endTime = new Date().toISOString();
    const allSets = activeSession.exercises.flatMap(e => e.sets);
    const volume = calculateSessionVolume(allSets);
    const completedCount = allSets.filter(s => s.completed).length;
    const rate = allSets.length > 0 ? Math.round((completedCount / allSets.length) * 100) : 0;
    const strain = calculateWorkoutStrain(volume, activeSession.durationSeconds);

    // Personal Records detection! Check if any completed set beats previous PRs
    const newPrs: PersonalRecord[] = [];
    activeSession.exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed);
      if (completedSets.length === 0) return;

      const exercisePrs = prs.filter(p => p.exerciseId === ex.exerciseId);
      let existingMaxWeight = exercisePrs.find(p => p.type === 'heaviest_weight')?.value || 0;
      let existing1RM = exercisePrs.find(p => p.type === 'estimated_1rm')?.value || 0;

      completedSets.forEach(set => {
        // Check heaviest weight
        if (set.actualWeight > existingMaxWeight) {
          existingMaxWeight = set.actualWeight;
          const pr: PersonalRecord = {
            id: `pr-${Date.now()}-${ex.exerciseId}-weight`,
            exerciseId: ex.exerciseId,
            type: 'heaviest_weight',
            value: set.actualWeight,
            repsAtWeight: set.actualReps,
            achievedAt: endTime,
            sessionId: activeSession.id
          };
          newPrs.push(pr);
        }

        // Check estimated 1RM
        const est1RM = calculateEstimated1RM(set.actualWeight, set.actualReps);
        if (est1RM > existing1RM) {
          existing1RM = est1RM;
          const pr: PersonalRecord = {
            id: `pr-${Date.now()}-${ex.exerciseId}-1rm`,
            exerciseId: ex.exerciseId,
            type: 'estimated_1rm',
            value: est1RM,
            achievedAt: endTime,
            sessionId: activeSession.id
          };
          newPrs.push(pr);
        }
      });
    });

    if (newPrs.length > 0) {
      setPrs(prev => [...prev, ...newPrs]);
      // Trigger celebratory confetti fireworks!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F19F', '#0093E7', '#16EC06', '#FFFFFF']
        });
      } catch {
        // ignore
      }
    }

    // Update goals current value if higher
    activeSession.exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed);
      completedSets.forEach(set => {
        setGoals(prev =>
          prev.map(g => {
            if (g.exerciseId === ex.exerciseId) {
              if (g.metric === 'weight' && set.actualWeight > g.current) {
                const nextStatus = set.actualWeight >= g.target ? 'achieved' : 'active';
                return { ...g, current: set.actualWeight, status: nextStatus };
              }
              if (g.metric === 'estimated_1rm') {
                const est = calculateEstimated1RM(set.actualWeight, set.actualReps);
                if (est > g.current) {
                  const nextStatus = est >= g.target ? 'achieved' : 'active';
                  return { ...g, current: est, status: nextStatus };
                }
              }
            }
            return g;
          })
        );
      });
    });

    // Check progression overload suggestion
    activeSession.exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed);
      if (completedSets.length >= 3) {
        // If all completed sets hit or exceeded target reps
        const allTargetHit = completedSets.every(s => s.actualReps >= s.targetReps);
        if (allTargetHit) {
          const exInfo = exercises.find(e => e.id === ex.exerciseId);
          const topWeight = Math.max(...completedSets.map(s => s.actualWeight));
          const newSuggestion: ProgressionSuggestion = {
            id: `sugg-${Date.now()}-${ex.exerciseId}`,
            exerciseId: ex.exerciseId,
            type: 'increase_weight',
            title: `Đề xuất tăng tạ: ${exInfo?.name || 'Bài tập'}`,
            reason: `Bạn đã hoàn thành ${completedSets.length} hiệp với mức ${topWeight}kg. Đề xuất tăng thêm +2.5kg ở buổi tập tới!`,
            suggestedWeightDelta: 2.5,
            suggestedRepRange: `${completedSets[0].targetReps} reps`,
            status: 'pending'
          };
          setSuggestions(prev => [newSuggestion, ...prev.filter(s => s.exerciseId !== ex.exerciseId)]);
        }
      }
    });

    const finished: WorkoutSession = {
      ...activeSession,
      endTime,
      status: 'completed',
      totalVolume: volume,
      totalCompletedSets: completedCount,
      targetCompletionRate: rate,
      strainScore: strain,
      prsAchieved: newPrs
    };

    setSessionHistory(prev => [finished, ...prev]);
    setLastFinishedSession(finished);
    setActiveSession(null);
    setIsWorkoutModalOpen(false);

    // Update today's schedule status if it was linked
    const scheduledId = activeScheduledIdRef.current;
    setSchedule(prev =>
      prev.map(s =>
        s.id === scheduledId && s.status === 'in_progress'
          ? { ...s, status: 'completed', completedSessionId: finished.id }
          : s
      )
    );
    activeScheduledIdRef.current = null;

    return finished;
  };

  const cancelActiveSession = () => {
    stopRestTimer();
    const scheduledId = activeScheduledIdRef.current;
    if (scheduledId) {
      setSchedule(prev => prev.map(s => s.id === scheduledId && s.status === 'in_progress' ? { ...s, status: 'planned' } : s));
    }
    activeScheduledIdRef.current = null;
    setActiveSession(null);
    setIsWorkoutModalOpen(false);
  };

  // --- Goal Functions ---
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'status'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // --- Progression Suggestions ---
  const acceptSuggestion = (suggestionId: string) => {
    const sugg = suggestions.find(s => s.id === suggestionId);
    if (!sugg) return;

    // Apply to templates containing this exercise
    setTemplates(prev =>
      prev.map(t => ({
        ...t,
        exercises: t.exercises.map(te => {
          if (te.exerciseId === sugg.exerciseId) {
            return {
              ...te,
              targetWeight: te.targetWeight + sugg.suggestedWeightDelta
            };
          }
          return te;
        })
      }))
    );

    setSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, status: 'accepted' } : s))
    );
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === suggestionId ? { ...s, status: 'dismissed' } : s))
    );
  };

  // --- Bodyweight Tracking Functions ---
  const logBodyWeight = (weight: number, date?: string, note?: string) => {
    const entryDate = date || new Date().toISOString().split('T')[0];
    const newEntry: BodyWeightEntry = {
      id: `bw-${Date.now()}`,
      date: entryDate,
      weight,
      note,
      loggedAt: new Date().toISOString()
    };
    setWeightHistory(prev => {
      const filtered = prev.filter(e => e.date !== entryDate);
      const updated = [newEntry, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
      return updated;
    });
    setUser(prev => ({ ...prev, bodyWeight: weight }));
  };

  const deleteBodyWeightEntry = (id: string) => {
    setWeightHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      if (updated.length > 0) {
        setUser(u => ({ ...u, bodyWeight: updated[0].weight }));
      }
      return updated;
    });
  };

  // --- Backup & Restore ---
  const exportDataJSON = () => {
    const payload = {
      user,
      exercises,
      templates,
      schedule,
      sessionHistory,
      prs,
      goals,
      suggestions,
      weightHistory,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymmate_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = parsePersistedGymData(JSON.parse(jsonString));
      if (!parsed) return false;
      if (parsed.user) setUser(parsed.user);
      if (parsed.exercises) setExercises(parsed.exercises);
      if (parsed.templates) setTemplates(parsed.templates);
      if (parsed.schedule) setSchedule(parsed.schedule);
      if (parsed.sessionHistory) setSessionHistory(parsed.sessionHistory);
      if (parsed.prs) setPrs(parsed.prs);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.suggestions) setSuggestions(parsed.suggestions);
      if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
      return true;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    setUser(INITIAL_USER);
    setExercises(DEFAULT_EXERCISES);
    setTemplates(DEFAULT_TEMPLATES);
    setSchedule(INITIAL_SCHEDULE);
    setSessionHistory(INITIAL_PAST_SESSIONS);
    setPrs(INITIAL_PRS);
    setGoals(INITIAL_GOALS);
    setSuggestions(INITIAL_SUGGESTIONS);
    setWeightHistory(INITIAL_WEIGHT_HISTORY);
    setActiveSession(null);
    setIsWorkoutModalOpen(false);
    setIsWeightModalOpen(false);
    setLastFinishedSession(null);
    setActiveTab('home');
    setRestTimer({ isActive: false, isRunning: false, remainingSeconds: 0, totalSeconds: 90 });
    activeScheduledIdRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <GymContext.Provider
      value={{
        user,
        updateUserProfile,
        toggleUnit,
        exercises,
        addCustomExercise,
        updateExerciseImage,
        toggleFavoriteExercise,
        getExerciseById,
        templates,
        saveTemplate,
        deleteTemplate,
        getTemplateById,
        schedule,
        scheduleWorkoutOnDate,
        moveScheduledWorkout,
        markDayAsRest,
        deleteScheduledWorkout,
        getScheduleForDate,
        activeSession,
        startSession,
        updateActiveSessionNotes,
        updateSetLog,
        addSetToExercise,
        removeSetFromExercise,
        addExerciseToActiveSession,
        finishActiveSession,
        cancelActiveSession,
        restTimer,
        startRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        addRestTimerSeconds,
        stopRestTimer,
        prs,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        suggestions,
        acceptSuggestion,
        dismissSuggestion,
        sessionHistory,
        weightHistory,
        logBodyWeight,
        deleteBodyWeightEntry,
        exportDataJSON,
        importDataJSON,
        resetAllData,
        activeTab,
        setActiveTab,
        isWorkoutModalOpen,
        setIsWorkoutModalOpen,
        isWeightModalOpen,
        setIsWeightModalOpen,
        lastFinishedSession,
        setLastFinishedSession
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}
