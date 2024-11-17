export interface YogaSession {
  id: number;
  teacher: string;
  additionalComment?: string;
  classDate: string;
  courseId: number;
  createdAt: number;
  deletedAt?: number | null;
  syncedAt?: number | null;
  updatedAt?: number | null;
  typeOfClass: string;
  timeOfCourse: string;
  description: string;
  duration: number;
}
