export interface YogaCourse {
  id: number;

  dayOfWeek: string;
  timeOfCourse: string;
  duration: number;
  capacity: number;
  pricePerClass: number;

  typeOfClass: string;
  description: string;
  isPublished: boolean;

  category: string;
}
