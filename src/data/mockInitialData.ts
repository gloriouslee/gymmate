import { UserProfile, ScheduledWorkout, WorkoutSession, Goal, PersonalRecord, ProgressionSuggestion, BodyWeightEntry } from '@/types/gym';

// Helper to format ISO date strings for current week
export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_USER: UserProfile = {
  id: 'user-huy-hoang',
  name: 'Hoang Le Huy',
  email: 'huy.hoangle@gymmate.app',
  unit: 'kg',
  bodyWeight: 74.5,
  targetWeight: 72.0,
  height: 175,
  targetGoal: 'Hypertrophy & Progressive Overload',
  createdAt: '2026-09-01T00:00:00Z'
};

export const INITIAL_WEIGHT_HISTORY: BodyWeightEntry[] = [
  { id: 'bw-1', date: getRelativeDateString(-21), weight: 76.2, note: 'Bắt đầu siết cân', loggedAt: '2026-09-28T07:00:00Z' },
  { id: 'bw-2', date: getRelativeDateString(-14), weight: 75.6, note: 'Cân sáng sớm', loggedAt: '2026-10-05T07:00:00Z' },
  { id: 'bw-3', date: getRelativeDateString(-7), weight: 75.1, note: 'Kiểm soát calo tốt', loggedAt: '2026-10-12T07:00:00Z' },
  { id: 'bw-4', date: getRelativeDateString(-3), weight: 74.8, note: 'Sau buổi tập chân', loggedAt: '2026-10-16T07:00:00Z' },
  { id: 'bw-5', date: getRelativeDateString(0), weight: 74.5, note: 'Cân buổi sáng sau ngủ dậy', loggedAt: '2026-10-19T07:00:00Z' }
];

export const INITIAL_SCHEDULE: ScheduledWorkout[] = [
  {
    id: 'sched-1',
    date: getRelativeDateString(-2),
    templateId: 'leg-day-a',
    status: 'completed',
    completedSessionId: 'sess-leg-past'
  },
  {
    id: 'sched-2',
    date: getRelativeDateString(-1),
    status: 'rest',
    notes: 'Phục hồi cơ bắp, giãn cơ nhẹ nhàng.'
  },
  {
    id: 'sched-3',
    date: getRelativeDateString(0), // TODAY
    templateId: 'push-day-a',
    status: 'planned'
  },
  {
    id: 'sched-4',
    date: getRelativeDateString(1),
    templateId: 'pull-day-a',
    status: 'planned'
  },
  {
    id: 'sched-5',
    date: getRelativeDateString(2),
    status: 'rest',
    notes: 'Nghỉ ngơi tích cực.'
  },
  {
    id: 'sched-6',
    date: getRelativeDateString(3),
    templateId: 'leg-day-a',
    status: 'planned'
  },
  {
    id: 'sched-7',
    date: getRelativeDateString(4),
    templateId: 'push-day-a',
    status: 'planned'
  }
];

export const INITIAL_PRS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseId: 'barbell-bench-press',
    type: 'heaviest_weight',
    value: 75,
    repsAtWeight: 6,
    achievedAt: '2026-10-14T09:30:00Z',
    sessionId: 'sess-past-1'
  },
  {
    id: 'pr-2',
    exerciseId: 'barbell-bench-press',
    type: 'estimated_1rm',
    value: 88,
    achievedAt: '2026-10-14T09:30:00Z',
    sessionId: 'sess-past-1'
  },
  {
    id: 'pr-3',
    exerciseId: 'barbell-deadlift',
    type: 'heaviest_weight',
    value: 125,
    repsAtWeight: 5,
    achievedAt: '2026-10-11T10:15:00Z',
    sessionId: 'sess-past-2'
  },
  {
    id: 'pr-4',
    exerciseId: 'barbell-back-squat',
    type: 'heaviest_weight',
    value: 95,
    repsAtWeight: 6,
    achievedAt: '2026-10-17T08:45:00Z',
    sessionId: 'sess-leg-past'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    exerciseId: 'barbell-bench-press',
    metric: 'weight',
    baseline: 65,
    target: 100,
    current: 75,
    targetDate: '2026-12-31',
    status: 'active',
    createdAt: '2026-09-15T00:00:00Z'
  },
  {
    id: 'goal-2',
    exerciseId: 'barbell-back-squat',
    metric: 'weight',
    baseline: 80,
    target: 120,
    current: 95,
    targetDate: '2026-12-31',
    status: 'active',
    createdAt: '2026-09-15T00:00:00Z'
  },
  {
    id: 'goal-3',
    exerciseId: 'barbell-deadlift',
    metric: 'estimated_1rm',
    baseline: 110,
    target: 160,
    current: 142,
    targetDate: '2027-01-30',
    status: 'active',
    createdAt: '2026-09-15T00:00:00Z'
  }
];

export const INITIAL_SUGGESTIONS: ProgressionSuggestion[] = [
  {
    id: 'sugg-1',
    exerciseId: 'barbell-bench-press',
    type: 'increase_weight',
    title: 'Đề xuất Progressive Overload: Barbell Bench Press',
    reason: 'Bạn đã hoàn thành 4 hiệp x 8 reps với mức tạ 70kg ở buổi trước với RPE 8. Thời điểm lý tưởng để nâng mức tạ!',
    suggestedWeightDelta: 2.5,
    suggestedRepRange: '6 - 8 reps',
    status: 'pending'
  },
  {
    id: 'sugg-2',
    exerciseId: 'lat-pulldown',
    type: 'increase_weight',
    title: 'Đề xuất tăng mức tạ: Lat Pulldown',
    reason: 'Đạt target 4x10 @ 55kg trong 2 buổi liên tiếp.',
    suggestedWeightDelta: 5.0,
    suggestedRepRange: '8 - 10 reps',
    status: 'pending'
  }
];

export const INITIAL_PAST_SESSIONS: WorkoutSession[] = [
  {
    id: 'sess-leg-past',
    templateId: 'leg-day-a',
    title: 'Leg Day — Đùi trước & Đùi sau',
    startTime: '2026-10-17T08:00:00Z',
    endTime: '2026-10-17T09:12:00Z',
    durationSeconds: 4320,
    status: 'completed',
    notes: 'Buổi tập chân bùng nổ, tăng tạ squat lên 95kg thành công.',
    totalVolume: 8420,
    totalCompletedSets: 13,
    targetCompletionRate: 100,
    prsAchieved: [INITIAL_PRS[3]],
    strainScore: 16.2,
    exercises: [
      {
        id: 'se-1',
        exerciseId: 'barbell-back-squat',
        notes: 'Khởi động tốt, hiệp cuối đẩy hết sức.',
        sets: [
          { id: 's1', setNumber: 1, targetWeight: 85, targetReps: 8, actualWeight: 85, actualReps: 8, rpe: 7.5, rir: 2, completed: true },
          { id: 's2', setNumber: 2, targetWeight: 90, targetReps: 8, actualWeight: 90, actualReps: 8, rpe: 8, rir: 2, completed: true },
          { id: 's3', setNumber: 3, targetWeight: 95, targetReps: 6, actualWeight: 95, actualReps: 6, rpe: 9, rir: 1, completed: true },
          { id: 's4', setNumber: 4, targetWeight: 95, targetReps: 6, actualWeight: 95, actualReps: 6, rpe: 9.5, rir: 0, completed: true }
        ]
      },
      {
        id: 'se-2',
        exerciseId: 'romanian-deadlift',
        notes: 'Căng cơ đùi sau rất tốt.',
        sets: [
          { id: 's5', setNumber: 1, targetWeight: 75, targetReps: 10, actualWeight: 75, actualReps: 10, rpe: 8, rir: 2, completed: true },
          { id: 's6', setNumber: 2, targetWeight: 75, targetReps: 10, actualWeight: 75, actualReps: 10, rpe: 8.5, rir: 1, completed: true },
          { id: 's7', setNumber: 3, targetWeight: 80, targetReps: 8, actualWeight: 80, actualReps: 8, rpe: 9, rir: 1, completed: true }
        ]
      }
    ]
  },
  {
    id: 'sess-past-1',
    templateId: 'push-day-a',
    title: 'Push Day A — Ngực & Tay sau',
    startTime: '2026-10-14T08:30:00Z',
    endTime: '2026-10-14T09:35:00Z',
    durationSeconds: 3900,
    status: 'completed',
    notes: 'Bench press đạt kỷ lục mới 75kg!',
    totalVolume: 7150,
    totalCompletedSets: 14,
    targetCompletionRate: 95,
    prsAchieved: [INITIAL_PRS[0], INITIAL_PRS[1]],
    strainScore: 14.8,
    exercises: [
      {
        id: 'se-3',
        exerciseId: 'barbell-bench-press',
        notes: 'Kỷ lục mới!',
        sets: [
          { id: 's8', setNumber: 1, targetWeight: 70, targetReps: 8, actualWeight: 70, actualReps: 8, rpe: 7.5, rir: 2, completed: true },
          { id: 's9', setNumber: 2, targetWeight: 70, targetReps: 8, actualWeight: 70, actualReps: 8, rpe: 8, rir: 2, completed: true },
          { id: 's10', setNumber: 3, targetWeight: 75, targetReps: 6, actualWeight: 75, actualReps: 6, rpe: 9, rir: 1, completed: true },
          { id: 's11', setNumber: 4, targetWeight: 75, targetReps: 6, actualWeight: 75, actualReps: 6, rpe: 9.5, rir: 0, completed: true }
        ]
      }
    ]
  }
];
