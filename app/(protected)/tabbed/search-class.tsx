import SearchBar from "@/components/SearchBar";
import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SearchScreen = () => {
  const [results, setResults] = useState([]);

  return (
    <View style={styles.screen}>
      <SearchBar onSearchResults={setResults} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.type}>
                {item.typeOfClass || "Unknown Class"}
              </Text>
              <Text style={styles.date}>
                {item.classDate || "No Date"} - {item.timeOfCourse || "No Time"}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.description}>
                {item.description || "No description available"}
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.teacher}>
                {item.teacher || "Unknown Teacher"}
              </Text>
              <Text style={styles.duration}>
                {item.duration ? `${item.duration} mins` : "No Duration"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No classes available</Text>
        }
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
