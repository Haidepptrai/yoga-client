import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { YogaCourse } from "@/interface/YogaCourse";
import { YogaSession } from "@/interface/YogaSession";

interface SearchBarProps {
  onSearchResults?: (joined: boolean, results: YogaSession[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [keyword, setKeyword] = useState("");
  const [showJoined, setShowJoined] = useState(false);
  const [unsubscribeJoined, setUnsubscribeJoined] = useState<(() => void) | null>(
    null
  );
  const [unsubscribeCourses, setUnsubscribeCourses] = useState<(() => void) | null>(
    null
  );

  const handleSearch = () => {
    if (unsubscribeJoined) unsubscribeJoined(); // Unsubscribe previous listeners
    if (unsubscribeCourses) unsubscribeCourses();

    if (showJoined) {
      fetchJoinedClasses();
    } else {
      fetchCourses();
    }
  };

  const fetchJoinedClasses = () => {
    const joinedClassesRef = collection(db, "user_joined_class");
    const unsubscribe = onSnapshot(joinedClassesRef, async (snapshot: QuerySnapshot<DocumentData>) => {
      if (snapshot.empty) {
        console.warn("No joined classes found.");
        onSearchResults && onSearchResults(true, []);
        return;
      }

      const joinedClasses = snapshot.docs.map((doc) => doc.data());
      const sessionIds = joinedClasses.map((joined) => joined.classId);

      const sessionsRef = collection(db, "yoga_sessions");
      const sessionsQuery = query(sessionsRef, where("id", "in", sessionIds));
      onSnapshot(sessionsQuery, async (sessionsSnapshot) => {
        if (sessionsSnapshot.empty) {
          console.warn("No sessions found.");
          onSearchResults && onSearchResults(true, []);
          return;
        }

        const sessions = sessionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaSession[];

        const courseIds = sessions.map((session) => session.courseId);
        const coursesRef = collection(db, "yoga_courses");
        const coursesQuery = query(coursesRef, where("id", "in", courseIds));
        onSnapshot(coursesQuery, (coursesSnapshot) => {
          const courses = coursesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as YogaCourse[];

          const mergedResults = sessions.map((session) => {
            const course = courses.find((course) => course.id === session.courseId);
            return {
              ...session,
              timeOfCourse: course?.timeOfCourse || "No Time",
              duration: course?.duration || 0,
              typeOfClass: course?.typeOfClass || "Unknown Class",
              description: course?.description || "No description available",
            };
          });

          onSearchResults && onSearchResults(true, mergedResults);
        });
      });
    });

    setUnsubscribeJoined(() => unsubscribe); // Save the unsubscribe function
  };

  const fetchCourses = () => {
    const coursesRef = collection(db, "yoga_courses");
    const coursesQuery = query(
      coursesRef,
      where("typeOfClass", ">=", keyword),
      where("typeOfClass", "<", keyword + "\uf8ff")
    );

    const unsubscribe = onSnapshot(coursesQuery, async (coursesSnapshot) => {
      if (coursesSnapshot.empty) {
        console.warn("No courses found.");
        onSearchResults && onSearchResults(false, []);
        return;
      }

      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as YogaCourse[];

      const courseIds = courses.map((course) => course.id);
      const sessionsRef = collection(db, "yoga_sessions");
      const sessionsQuery = query(sessionsRef, where("courseId", "in", courseIds));
      onSnapshot(sessionsQuery, (sessionsSnapshot) => {
        if (sessionsSnapshot.empty) {
          console.warn("No sessions found.");
          onSearchResults && onSearchResults(false, []);
          return;
        }

        const sessions = sessionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaSession[];

        const mergedResults = sessions.map((session) => {
          const course = courses.find((course) => course.id === session.courseId);
          return {
            ...session,
            timeOfCourse: course?.timeOfCourse || "No Time",
            duration: course?.duration || 0,
            typeOfClass: course?.typeOfClass || "Unknown Class",
            description: course?.description || "No description available",
          };
        });

        onSearchResults && onSearchResults(false, mergedResults);
      });
    });

    setUnsubscribeCourses(() => unsubscribe); // Save the unsubscribe function
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={
            showJoined
              ? "Click search button to show joined class"
              : "Type course type..."
          }
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          editable={!showJoined} // Disable input when viewing joined classes
        />
        <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => {
          setShowJoined((prev) => !prev);
          setKeyword("");
          if (unsubscribeJoined) unsubscribeJoined(); // Clear previous listeners
          if (unsubscribeCourses) unsubscribeCourses();
          onSearchResults && onSearchResults(showJoined, []);
        }}
      >
        <Text style={styles.toggleText}>
          {showJoined ? "Show All Classes" : "Show Joined Classes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  toggleButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  toggleText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
