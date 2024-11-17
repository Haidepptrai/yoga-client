import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";

interface SearchBarProps {
  onSearchResults?: (results: any) => void; // Adjust type as per actual usage
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [isAdvancedSearchVisible, setAdvancedSearchVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  const showPicker = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setPickerVisible(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setPickerVisible(false);
    if (date) {
      mode === "date" ? setSelectedDate(date) : setSelectedTime(date);
    }
  };

  const openAdvancedSearchModal = () => setAdvancedSearchVisible(true);

  const [keyword, setKeyword] = useState("");
  const handleSearch = async () => {
    try {
      const now = Date.now();
  
      const coursesRef = collection(db, "yoga_courses");
      const coursesQuery = query(
        coursesRef,
        where("typeOfClass", ">=", keyword),
        where("typeOfClass", "<", keyword + "\uf8ff")
      );
      const coursesSnapshot = await getDocs(coursesQuery);
  
      if (coursesSnapshot.empty) {
        console.warn("No course found for the specified name.");
        onSearchResults && onSearchResults([]);
        return;
      }
  
      // Filter results by `createdAt`
      const filteredCourses = coursesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        // .filter((course) => course.createdAt >= now); // Temporary filter
  
      if (filteredCourses.length === 0) {
        console.warn("No upcoming courses found.");
        onSearchResults && onSearchResults([]);
        return;
      }
  
      const courseId = filteredCourses[0].id;
  
      const sessionsRef = collection(db, "yoga_sessions");
      const sessionsQuery = query(
        sessionsRef,
        where("courseId", "==", parseInt(courseId))
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
  
      const sessions = sessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      onSearchResults && onSearchResults(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };
  

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type course type..."
            value={keyword}
            onChangeText={(text) => setKeyword(text)}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
            <FontAwesome name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Advanced Search Button */}
        <TouchableOpacity
          onPress={openAdvancedSearchModal}
          style={styles.advancedButton}
        >
          <Text style={styles.advancedButtonText}>Advanced search</Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Search Modal */}
      <Modal
        isVisible={isAdvancedSearchVisible}
        onBackdropPress={() => setAdvancedSearchVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Date & Time</Text>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => showPicker("date")}
          >
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          {/* Time Picker */}
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => showPicker("time")}
          >
            <Text style={styles.dateText}>{formatTime(selectedTime)}</Text>
          </TouchableOpacity>

          {/* Date & Time Picker rendered outside of the modal */}
          {isPickerVisible && (
            <DateTimePicker
              value={mode === "date" ? selectedDate : selectedTime}
              mode={mode}
              display="spinner"
              onChange={handleDateChange}
            />
          )}

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setAdvancedSearchVisible(false)}
          >
            <Text style={styles.confirmButtonText}>Set date & time</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  advancedButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    color: Colors.primary,
    justifyContent: "flex-end",
  },
  advancedButtonText: {
    fontSize: 16,
    color: "#555",
    marginRight: 5,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  dateInput: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  timeInput: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
