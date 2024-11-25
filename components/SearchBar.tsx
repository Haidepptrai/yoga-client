import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { YogaCourse } from "@/interface/YogaCourse";
import { YogaSession } from "@/interface/YogaSession";

interface SearchBarProps {
  onSearchResults?: (results: any) => void; // Adjust type as per actual usage
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [keyword, setKeyword] = useState("");
  const [showJoined, setShowJoined] = useState(false); // Toggle for joined classes

  const handleSearch = async () => {
    try {
      if (showJoined) {
        // Fetch user_joined_class
        const joinedClassesRef = collection(db, "user_joined_class");
        const joinedSnapshot = await getDocs(joinedClassesRef);

        if (joinedSnapshot.empty) {
          console.warn("No joined classes found.");
          onSearchResults && onSearchResults([]);
          return;
        }

        const joinedClasses = joinedSnapshot.docs.map((doc) => doc.data());

        const sessionIds = joinedClasses.map((joined) => joined.classId);
        const sessionsRef = collection(db, "yoga_sessions");
        const sessionsQuery = query(sessionsRef, where("id", "in", sessionIds));
        const sessionsSnapshot = await getDocs(sessionsQuery);

        if (sessionsSnapshot.empty) {
          console.warn("No sessions found.");
          onSearchResults && onSearchResults([]);
          return;
        }

        const sessions = sessionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaSession[];

        const courseIds = sessions.map((session) => session.courseId);
        const coursesRef = collection(db, "yoga_courses");
        const coursesQuery = query(coursesRef, where("id", "in", courseIds));
        const coursesSnapshot = await getDocs(coursesQuery);

        const courses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaCourse[];

        // Merge sessions with courses
        const mergedResults = sessions.map((session) => {
          const course = courses.find(
            (course) => course.id === session.courseId
          );
          return {
            ...session,
            timeOfCourse: course?.timeOfCourse || "No Time",
            duration: course?.duration || null,
            typeOfClass: course?.typeOfClass || "Unknown Class",
            description: course?.description || "No description available",
          };
        });

        onSearchResults && onSearchResults(mergedResults);
      } else {
        // Fetch regular courses based on search keyword
        const coursesRef = collection(db, "yoga_courses");
        const coursesQuery = query(
          coursesRef,
          where("typeOfClass", ">=", keyword),
          where("typeOfClass", "<", keyword + "\uf8ff")
        );
        const coursesSnapshot = await getDocs(coursesQuery);

        if (coursesSnapshot.empty) {
          console.warn("No courses found.");
          onSearchResults && onSearchResults([]);
          return;
        }

        const courses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaCourse[];

        const courseIds = courses.map((course) => course.id);
        const sessionsRef = collection(db, "yoga_sessions");
        const sessionsQuery = query(
          sessionsRef,
          where("courseId", "in", courseIds)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);

        if (sessionsSnapshot.empty) {
          console.warn("No sessions found.");
          onSearchResults && onSearchResults([]);
          return;
        }

        const sessions = sessionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as YogaSession[];

        // Merge sessions with courses
        const mergedResults = sessions.map((session) => {
          const course = courses.find(
            (course) => course.id === session.courseId
          );
          return {
            ...session,
            timeOfCourse: course?.timeOfCourse || "No Time",
            duration: course?.duration || null,
            typeOfClass: course?.typeOfClass || "Unknown Class",
            description: course?.description || "No description available",
          };
        });

        onSearchResults && onSearchResults(mergedResults);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              showJoined
                ? "Click search button to show joined course..."
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
            onSearchResults && onSearchResults([])
          }}
        >
          <Text style={styles.toggleText}>
            {showJoined ? "Show All Classes" : "Show Joined Classes"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
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
