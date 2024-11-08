import SearchBar from "@/components/SearchBar";
import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

const SearchScreen = () => {
  const [results, setResults] = useState([]);

  return (
    <View style={styles.screen}>
      <SearchBar onSearchResults={setResults} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.title}>{item.typeOfClass || item.teacher}</Text>
            <Text>{item.description || item.classDate}</Text>
          </View>
        )}
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
