import { YogaCourse } from "@/interface/YogaCourse";

const mapDocToYogaCourse = (doc: any): YogaCourse => ({
  id: parseInt(doc.id, 10),
  dayOfWeek: doc.data().dayOfWeek ?? "Unknown",
  timeOfCourse: doc.data().timeOfCourse ?? "00:00",
  duration: doc.data().duration ?? 0,
  capacity: doc.data().capacity ?? 0,
  price: doc.data().price ?? 0,
  typeOfClass: doc.data().typeOfClass ?? "Unknown",
  description: doc.data().description ?? "",
  isPublished: doc.data().published ?? false,
});

export default mapDocToYogaCourse;