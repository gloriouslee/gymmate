import { WorkoutTemplate } from '@/types/gym';

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'push-day-a',
    name: 'Push Day A — Ngực & Tay sau',
    description: 'Tập trung phát triển sức mạnh và độ dày nhóm cơ đẩy (Ngực, Vai trước, Tay sau).',
    tags: ['Hypertrophy', 'Push', 'Strength'],
    estimatedDurationMinutes: 65,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
    exercises: [
      {
        id: 'te-1',
        exerciseId: 'barbell-bench-press',
        order: 1,
        targetSets: 4,
        repMin: 6,
        repMax: 8,
        targetWeight: 70,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 120,
        notes: 'Khởi động kỹ trước khi vào hiệp chính. Tăng dần mức tạ.'
      },
      {
        id: 'te-2',
        exerciseId: 'incline-dumbbell-press',
        order: 2,
        targetSets: 3,
        repMin: 8,
        repMax: 12,
        targetWeight: 24,
        targetRpe: 8.5,
        targetRir: 1,
        restSeconds: 90,
        notes: 'Ghế nghiêng 30 độ. Tập trung ép ngực trên.'
      },
      {
        id: 'te-3',
        exerciseId: 'cable-chest-fly',
        order: 3,
        targetSets: 3,
        repMin: 12,
        repMax: 15,
        targetWeight: 15,
        targetRpe: 9,
        targetRir: 1,
        restSeconds: 60,
        supersetGroupId: 'ss-push-1',
        notes: 'Superset với Tricep Pushdown.'
      },
      {
        id: 'te-4',
        exerciseId: 'tricep-rope-pushdown',
        order: 4,
        targetSets: 3,
        repMin: 12,
        repMax: 15,
        targetWeight: 22.5,
        targetRpe: 9,
        targetRir: 1,
        restSeconds: 90,
        supersetGroupId: 'ss-push-1',
        notes: 'Tách dây thừng ở cuối biên độ.'
      },
      {
        id: 'te-5',
        exerciseId: 'dumbbell-lateral-raise',
        order: 5,
        targetSets: 4,
        repMin: 12,
        repMax: 15,
        targetWeight: 10,
        targetRpe: 9,
        targetRir: 1,
        restSeconds: 60,
        notes: 'Hạ chậm 3 giây để bùng nổ vai giữa.'
      }
    ]
  },
  {
    id: 'pull-day-a',
    name: 'Pull Day A — Lưng xô & Tay trước',
    description: 'Xây dựng bề rộng và độ dày của lưng xô cùng sức mạnh tay trước bắp tay.',
    tags: ['Back', 'Pull', 'V-Taper'],
    estimatedDurationMinutes: 60,
    createdAt: '2026-10-02T08:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
    exercises: [
      {
        id: 'te-6',
        exerciseId: 'barbell-deadlift',
        order: 1,
        targetSets: 3,
        repMin: 5,
        repMax: 5,
        targetWeight: 110,
        targetRpe: 8.5,
        targetRir: 1,
        restSeconds: 180,
        notes: 'Giữ form chuẩn, đai lưng nếu cần thiết.'
      },
      {
        id: 'te-7',
        exerciseId: 'lat-pulldown',
        order: 2,
        targetSets: 4,
        repMin: 8,
        repMax: 10,
        targetWeight: 55,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 90,
        notes: 'Kéo sâu chạm ngực, kéo bằng cùi chỏ.'
      },
      {
        id: 'te-8',
        exerciseId: 'barbell-bent-over-row',
        order: 3,
        targetSets: 3,
        repMin: 8,
        repMax: 12,
        targetWeight: 60,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 90,
        notes: 'Gập hông 60 độ, kéo chạm rốn.'
      },
      {
        id: 'te-9',
        exerciseId: 'barbell-bicep-curl',
        order: 4,
        targetSets: 3,
        repMin: 10,
        repMax: 12,
        targetWeight: 27.5,
        targetRpe: 8.5,
        targetRir: 1,
        restSeconds: 75,
        notes: 'Cố định cùi chỏ sát người.'
      },
      {
        id: 'te-10',
        exerciseId: 'face-pulls',
        order: 5,
        targetSets: 3,
        repMin: 15,
        repMax: 20,
        targetWeight: 20,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 60,
        notes: 'Bảo vệ khớp vai, tăng cường cơ vai sau.'
      }
    ]
  },
  {
    id: 'leg-day-a',
    name: 'Leg Day — Đùi trước & Đùi sau',
    description: 'Buổi tập chân toàn diện giúp phát triển cơ đùi, mông và sức mạnh nền tảng.',
    tags: ['Legs', 'Squat', 'Lower Body'],
    estimatedDurationMinutes: 70,
    createdAt: '2026-10-03T08:00:00Z',
    updatedAt: '2026-10-14T10:00:00Z',
    exercises: [
      {
        id: 'te-11',
        exerciseId: 'barbell-back-squat',
        order: 1,
        targetSets: 4,
        repMin: 6,
        repMax: 8,
        targetWeight: 85,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 150,
        notes: 'Squat sâu dưới song song nếu độ linh hoạt cho phép.'
      },
      {
        id: 'te-12',
        exerciseId: 'romanian-deadlift',
        order: 2,
        targetSets: 3,
        repMin: 8,
        repMax: 10,
        targetWeight: 75,
        targetRpe: 8,
        targetRir: 2,
        restSeconds: 120,
        notes: 'Cảm nhận căng sâu đùi sau và gồng cơ mông.'
      },
      {
        id: 'te-13',
        exerciseId: 'leg-press',
        order: 3,
        targetSets: 3,
        repMin: 10,
        repMax: 12,
        targetWeight: 140,
        targetRpe: 8.5,
        targetRir: 1,
        restSeconds: 90,
        notes: 'Không khóa gối ở đỉnh.'
      },
      {
        id: 'te-14',
        exerciseId: 'hanging-leg-raise',
        order: 4,
        targetSets: 3,
        repMin: 12,
        repMax: 15,
        targetWeight: 0,
        targetRpe: 8.5,
        targetRir: 1,
        restSeconds: 60,
        notes: 'Gập bụng chậm rãi có kiểm soát.'
      }
    ]
  }
];
