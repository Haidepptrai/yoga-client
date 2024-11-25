import SearchBar from "@/components/SearchBar";
import { YogaSession } from "@/interface/YogaSession";
import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/Colors";
import YogaSessionCard from "@/components/YogaSessionCard";
import { addToCart } from "@/utils/addToCart";

const SearchScreen = () => {
  const [results, setResults] = useState<YogaSession[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const { user } = useAuth();

  const handleClickButton = (joined: boolean, results: YogaSession[]) => {
    setIsJoined(joined);
    setResults(results);
  };

  const handleAddToCart = (classId: number) => {
    if (user) {
      addToCart(user.uid, classId);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearchResults={handleClickButton} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <YogaSessionCard
            typeOfClass={item.typeOfClass}
            classDate={item.classDate}
            timeOfCourse={item.timeOfCourse}
            description={item.description}
            teacher={item.teacher}
            duration={item.duration}
            onAddToCart={() => handleAddToCart(item.id)}
            isJoined={isJoined}
          />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardBody: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teacher: {
    fontSize: 14,
    color: Colors.textAccent,
    fontStyle: "italic",
  },
  duration: {
    fontSize: 14,
    color: Colors.textAccent,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.primary,
    marginTop: 20,
  },
  addToCartButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
