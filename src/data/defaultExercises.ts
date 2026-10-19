import { Exercise } from '@/types/gym';

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    vietnameseName: 'Đẩy ngực ngang với đòn tạ',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'barbell',
    movementPattern: 'push',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Nằm ngửa trên ghế phẳng, mắt đặt ngay dưới thanh đòn.',
      'Nắm thanh đòn rộng hơn vai, bóp chặt bả vai và ưỡn ngực.',
      'Hạ thanh đòn có kiểm soát xuống điểm giữa ngực (núm vú).',
      'Đẩy mạnh thanh đòn lên điểm xuất phát mà không khóa khớp khuỷu tay gắt.'
    ],
    cues: ['Khóa chặt bả vai vào ghế', 'Khuỷu tay chếch 45-60 độ', 'Đạp chân xuống sàn tạo lực (leg drive)'],
    isFavorite: true
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    vietnameseName: 'Đẩy ngực trên với tạ đơn',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'dumbbell',
    movementPattern: 'push',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Chỉnh ghế dốc khoảng 30 đến 45 độ.',
      'Dùng đùi nâng tạ đơn lên vị trí ngực trên.',
      'Hạ tạ có kiểm soát đến khi cảm nhận cơ ngực căng tối đa.',
      'Đẩy tạ lên theo hình vòng cung nhẹ, ép ngực trên ở đỉnh.'
    ],
    cues: ['Không chỉnh ghế quá dốc tránh ăn vào vai trước', 'Giữ cổ tay thẳng trên cẳng tay', 'Ưỡn ngực cao suốt hiệp'],
    isFavorite: true
  },
  {
    id: 'cable-chest-fly',
    name: 'Cable Chest Fly',
    vietnameseName: 'Ép ngực với dây cáp',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    movementPattern: 'isolation',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Chỉnh ròng rọc ở tầm ngực hoặc cao hơn một chút.',
      'Bước một chân lên trước để giữ thăng bằng, khuỷu tay hơi cong.',
      'Ép hai tay lại phía trước ngực như đang ôm thân cây lớn.',
      'Từ từ mở tay ra hít sâu để căng ngực, giữ khuỷu tay cố định.'
    ],
    cues: ['Giữ góc khuỷu tay không đổi', 'Gồng chặt ngực 1 giây ở điểm chạm', 'Kiểm soát nhịp hạ chậm 2-3 giây']
  },
  {
    id: 'dips-chest',
    name: 'Chest Dips',
    vietnameseName: 'Chống xà kép ngực dưới',
    muscleGroup: 'chest',
    secondaryMuscles: ['arms', 'shoulders'],
    equipment: 'bodyweight',
    movementPattern: 'push',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Lên xà kép, hơi nghiêng người về phía trước khoảng 20-30 độ.',
      'Hạ người xuống từ từ đến khi khuỷu tay tạo góc khoảng 90 độ.',
      'Dùng lực cơ ngực đẩy người trở lại vị trí ban đầu.'
    ],
    cues: ['Nghiêng người về trước để tác động ngực thay vì tay sau', 'Khuỷu tay hơi mở', 'Không hạ quá sâu nếu đau vai']
  },

  // BACK
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    vietnameseName: 'Kéo tạ đòn từ sàn (Deadlift)',
    muscleGroup: 'back',
    secondaryMuscles: ['legs', 'core'],
    equipment: 'barbell',
    movementPattern: 'hinge',
    difficulty: 'advanced',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đứng sát thanh đòn, chân rộng bằng hông, thanh đòn cắt ngang giữa mu bàn chân.',
      'Cúi người gập hông nắm đòn, kéo bả vai xuống (engage lats).',
      'Hít sâu vào khoang bụng, đạp mạnh chân xuống sàn kéo thanh đòn lên sát ống đồng.',
      'Khóa hông ở đỉnh, không ưỡn lưng quá mức, sau đó hạ tạ theo quỹ đạo tương tự.'
    ],
    cues: ['Đạp sàn chứ không chỉ kéo bằng lưng', 'Thanh đòn luôn trượt sát người', 'Gồng chặt cơ bụng như chuẩn bị đỡ đấm'],
    isFavorite: true
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    vietnameseName: 'Kéo xô máy tạ',
    muscleGroup: 'back',
    secondaryMuscles: ['arms'],
    equipment: 'cable',
    movementPattern: 'pull',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Ngồi vào máy, đệm chân giữ đùi chắc chắn.',
      'Cầm thanh kéo rộng hơn vai một chút, ưỡn ngực nhẹ.',
      'Kéo thanh đòn xuống chạm vùng xương đòn trên ngực, kéo bằng khuỷu tay.',
      'Thả chậm thanh đòn về vị trí ban đầu, cảm nhận cơ xô giãn căng.'
    ],
    cues: ['Dẫn động bằng khuỷu tay, không dùng giật tay trước', 'Không ngả người ra sau quá nhiều', 'Giữ vai hạ thấp']
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    vietnameseName: 'Kéo xô gập người với đòn tạ (Pendlay / Barbell Row)',
    muscleGroup: 'back',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'barbell',
    movementPattern: 'pull',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Gập hông khoảng 45 đến 70 độ, giữ lưng thẳng tự nhiên.',
      'Cầm thanh đòn rộng bằng vai, kéo thanh đòn về phía rốn hoặc bụng dưới.',
      'Ép chặt hai bả vai vào nhau ở đỉnh chuyển động.',
      'Hạ tạ có kiểm soát về điểm xuất phát.'
    ],
    cues: ['Giữ cổ trung tính, nhìn xuống sàn', 'Căng cơ đùi sau và mông để làm điểm tựa vững', 'Kéo bằng cơ lưng']
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    vietnameseName: 'Hít xà đơn sấp tay',
    muscleGroup: 'back',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'bodyweight',
    movementPattern: 'pull',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Nắm xà ngang lòng bàn tay hướng về phía trước, tay rộng hơn vai.',
      'Hạ vai và ép bả vai trước khi gập khuỷu tay kéo người lên.',
      'Kéo cằm vượt qua thanh xà.',
      'Hạ người xuống có kiểm soát hoàn toàn đến khi tay thẳng.'
    ],
    cues: ['Không đung đưa người lấy đà (kipping)', 'Hạ hết biên độ (dead hang) có kiểm soát', 'Tập trung cơ xô']
  },

  // LEGS
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    vietnameseName: 'Gánh đùi sau với đòn tạ (Back Squat)',
    muscleGroup: 'legs',
    secondaryMuscles: ['core', 'back'],
    equipment: 'barbell',
    movementPattern: 'squat',
    difficulty: 'advanced',
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đặt thanh đòn trên phần cơ thang (trapezius), bóp chặt lưng trên.',
      'Chân rộng bằng vai hoặc hơi rộng hơn, mũi chân mở góc 15-30 độ.',
      'Hít sâu gồng bụng, đẩy hông ra sau và gập gối hạ mông xuống dưới mức song song.',
      'Đạp mạnh cả bàn chân xuống sàn để đứng dậy về vị trí khóa hông.'
    ],
    cues: ['Mở đầu gối theo hướng ngón chân', 'Giữ ngực mở, không gập người quá sâu', 'Trọng tâm ở giữa bàn chân'],
    isFavorite: true
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    vietnameseName: 'RDL - Kéo tạ đùi sau & mông',
    muscleGroup: 'legs',
    secondaryMuscles: ['back'],
    equipment: 'barbell',
    movementPattern: 'hinge',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đứng thẳng cầm đòn tạ hoặc tạ đơn sát đùi, đầu gối hơi chùng nhẹ 10-15 độ.',
      'Đẩy hông ra sau hết mức có thể, giữ thanh đòn trượt sát chân.',
      'Dừng lại khi cảm nhận cơ đùi sau (hamstring) căng hết biên độ (khoảng dưới gối).',
      'Dùng lực mông và đùi sau đẩy hông về phía trước để đứng thẳng.'
    ],
    cues: ['Chuyển động đẩy hông ra sau (hip hinge), không phải squat gập gối', 'Lưng luôn thẳng tắp', 'Cảm nhận căng sâu đùi sau']
  },
  {
    id: 'leg-press',
    name: 'Leg Press 45°',
    vietnameseName: 'Đạp đùi máy 45 độ',
    muscleGroup: 'legs',
    secondaryMuscles: ['core'],
    equipment: 'machine',
    movementPattern: 'squat',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Ngồi vào máy, lưng và hông ép sát đệm tựa.',
      'Đặt chân giữa bàn đạp, mở chốt an toàn.',
      'Hạ bàn đạp xuống từ từ đến khi đầu gối tạo góc 90 độ mà mông không bị nhấc khỏi đệm.',
      'Đạp mạnh trở lại vị trí ban đầu, không khóa khớp gối gắt.'
    ],
    cues: ['Không khóa khớp gối ở đỉnh', 'Không để mông nhấc lên gây áp lực thắt lưng', 'Kiểm soát nhịp hạ chậm']
  },
  {
    id: 'walking-lunges',
    name: 'Dumbbell Walking Lunges',
    vietnameseName: 'Chùng chân bước tới với tạ đơn',
    muscleGroup: 'legs',
    secondaryMuscles: ['core'],
    equipment: 'dumbbell',
    movementPattern: 'lunge',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Cầm hai tạ đơn hai bên người, bước một chân dài về phía trước.',
      'Hạ hông xuống đến khi cả hai đầu gối đều vuông góc 90 độ, gối sau gần chạm sàn.',
      'Dồn lực vào gót chân trước đạp người lên và bước tiếp chân sau.'
    ],
    cues: ['Thân người hơi nghiêng tới để kích hoạt cơ mông', 'Không để đầu gối trước vượt quá xa mũi chân', 'Cân bằng vững']
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Overhead Barbell Press (OHP)',
    vietnameseName: 'Đẩy vai qua đầu với đòn tạ đứng',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'barbell',
    movementPattern: 'push',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đứng thẳng, nắm thanh đòn ở mức xương quai xanh, khuỷu tay hơi hướng về trước.',
      'Gồng chặt mông và cơ bụng để cố định thân người.',
      'Đẩy thanh đòn thẳng lên qua đầu, hơi né đầu ra sau rồi đưa đầu về phía trước khi tạ qua đỉnh.',
      'Khóa tạ qua đầu với bả vai vững chắc, hạ có kiểm soát về đòn xương đòn.'
    ],
    cues: ['Gồng mông và bụng để không cong thắt lưng', 'Quỹ đạo tạ thẳng đứng nhất có thể', 'Không nhún chân lấy đà (strict press)'],
    isFavorite: true
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    vietnameseName: 'Dang tạ đơn sang hai bên (Vai giữa)',
    muscleGroup: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    movementPattern: 'isolation',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đứng thẳng hoặc ngồi trên ghế, hai tay cầm tạ đơn bên hông.',
      'Thân người hơi nghiêng về trước một chút, khuỷu tay hơi chùng.',
      'Nâng hai tạ sang hai bên ngang tầm vai, dẫn động bằng khuỷu tay.',
      'Hạ tạ chậm rãi trong 2-3 giây để tăng time-under-tension.'
    ],
    cues: ['Dẫn động bằng cùi chỏ', 'Không nhún người lấy đà (no swinging)', 'Tưởng tượng như rót nước ở đỉnh']
  },
  {
    id: 'face-pulls',
    name: 'Cable Face Pulls',
    vietnameseName: 'Kéo cáp vào mặt (Vai sau & Rotator Cuff)',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    movementPattern: 'pull',
    difficulty: 'beginner',
    instructions: [
      'Cài tay kéo dây thừng vào ròng rọc ở tầm mắt.',
      'Nắm đầu dây thừng với ngón cái hướng về phía mình.',
      'Kéo dây về phía mắt hoặc trán đồng thời tách hai đầu dây sang hai bên.',
      'Xoay vai ngoài và ép chặt bả vai trong 1-2 giây rồi thả chậm.'
    ],
    cues: ['Khuỷu tay luôn cao hơn cổ tay', 'Tập trung xoay ngoài khớp vai', 'Cực tốt cho phục hồi và tư thế lưng gù']
  },

  // ARMS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    vietnameseName: 'Cuốn tay trước với đòn tạ (Bicep Curl)',
    muscleGroup: 'arms',
    secondaryMuscles: [],
    equipment: 'barbell',
    movementPattern: 'isolation',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Đứng thẳng, nắm thanh đòn bằng vai, lòng bàn tay hướng lên.',
      'Giữ cùi chỏ sát mạn sườn, cuộn thanh đòn lên phía ngực.',
      'Gồng chặt bắp tay trước 1 giây ở đỉnh.',
      'Hạ tạ có kiểm soát về vị trí tay duỗi gần thẳng.'
    ],
    cues: ['Không lắc lư thân người để quăng tạ', 'Cùi chỏ cố định sát sườn', 'Hạ chậm 2 giây']
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Tricep Rope Pushdown',
    vietnameseName: 'Kéo cáp dây thừng tay sau (Triceps)',
    muscleGroup: 'arms',
    secondaryMuscles: [],
    equipment: 'cable',
    movementPattern: 'isolation',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Nắm dây thừng ở máy cáp cao, thân người hơi nghiêng tới.',
      'Giữ bắp tay trên cố định sát hông, đẩy dây xuống dưới.',
      'Ở cuối biên độ, tách hai đầu dây thừng sang hai bên để khóa khớp tay sau tối đa.',
      'Thả chậm lên đến khi cẳng tay vuông góc với bắp tay.'
    ],
    cues: ['Cùi chỏ không được di chuyển tới lui', 'Tách dây thừng ở đáy để căng tối đa', 'Gồng cơ tay sau 1 giây']
  },
  {
    id: 'skull-crushers',
    name: 'EZ-Bar Skull Crushers',
    vietnameseName: 'Hạ đòn EZ vào trán (Lying Tricep Extension)',
    muscleGroup: 'arms',
    secondaryMuscles: [],
    equipment: 'barbell',
    movementPattern: 'isolation',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Nằm trên ghế phẳng, cầm thanh đòn EZ giơ thẳng qua ngực.',
      'Giữ bắp tay trên nghiêng nhẹ về sau đầu một góc nhỏ.',
      'Gập khuỷu tay hạ thanh đòn về phía đỉnh đầu hoặc trán.',
      'Dùng cơ tay sau đẩy thanh đòn trở lại vị trí ban đầu.'
    ],
    cues: ['Khuỷu tay khép, không bị xòe rộng sang hai bên', 'Kiểm soát tuyệt đối tránh va vào đầu', 'Căng sâu đầu dài cơ tay sau']
  },

  // CORE & FULL BODY
  {
    id: 'plank',
    name: 'Core Plank',
    vietnameseName: 'Plank gồng bụng',
    muscleGroup: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'bodyweight',
    movementPattern: 'carry',
    difficulty: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Chống khuỷu tay xuống sàn, khuỷu tay vuông góc ngay dưới vai.',
      'Duỗi thẳng hai chân, người tạo thành một đường thẳng từ đầu đến gót.',
      'Gồng chặt cơ bụng, siết mông và đùi, duy trì nhịp thở đều.'
    ],
    cues: ['Không võng lưng dưới', 'Không chổng mông lên quá cao', 'Cổ thẳng hàng với cột sống']
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    vietnameseName: 'Treo người co gối / nâng chân gập bụng',
    muscleGroup: 'core',
    secondaryMuscles: ['arms'],
    equipment: 'bodyweight',
    movementPattern: 'isolation',
    difficulty: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'Treo người trên xà đơn, hai tay giữ chắc.',
      'Cuộn xương chậu và nâng đầu gối hoặc thẳng chân lên phía ngực.',
      'Hạ chân xuống chậm mà không để cơ thể đung đưa theo quán tính.'
    ],
    cues: ['Cuộn xương chậu chứ không chỉ nhấc đùi', 'Dừng 1 giây ở đỉnh', 'Không lấy đà']
  }
];
