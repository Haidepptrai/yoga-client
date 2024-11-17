import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderWithBackButton from "@/components/navigation/HeaderWithBackButton";
import { z } from "zod";
import { Colors } from "@/constants/Colors";
import { getAuth } from "firebase/auth";
import { ThemedText } from "@/components/ThemedText";

// Zod schema for validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number should be at least 10 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export default function ProfileScreen() {
  const [profile, setProfile] = useState({ email: "", name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { fromCart } = useLocalSearchParams(); // Check if navigated from Cart
  const auth = getAuth();
  const user = auth.currentUser; // Get currently logged-in user

  useEffect(() => {
    // Fetch profile data from Firebase if user is logged in
    const fetchProfile = async () => {
      if (!user) return; // Ensure user is logged in

      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setProfile({
            email: profileData.email || user.email, // Use email from Auth if not in Firestore
            name: profileData.name || "",
            phone: profileData.phone || "",
          });
        } else {
          // If no profile data exists, populate email from Firebase Auth
          setProfile({ email: user.email || "", name: "", phone: "" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    // Validate form data with Zod
    const result = profileSchema.safeParse({
      name: profile.name,
      phone: profile.phone,
    });
    if (!result.success) {
      // Show validation errors
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join("\n");
      Alert.alert("Validation Error", errorMessage);
      return;
    }

    // Save profile data to Firebase if user is logged in
    if (!user) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      const profileRef = doc(db, "users", user.uid); // Use user ID from Firebase Auth
      await setDoc(
        profileRef,
        { email: user.email, name: profile.name, phone: profile.phone },
        { merge: true }
      );
      Alert.alert("Success", "Profile updated successfully!");

      // If accessed from Cart, navigate back to Cart after saving
      if (fromCart) {
        router.push("/(protected)/cart");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleBackPress = () => {
    // Navigate back to the appropriate screen
    if (fromCart) {
      router.push("/(protected)/cart");
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View>
      <HeaderWithBackButton
        title="Edit Profile"
        onBackPress={handleBackPress}
      />
      <View style={styles.container}>
        <ThemedText type="title">User Profile</ThemedText>
        <Text style={styles.label}>Email (non-editable)</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={profile.email}
          editable={false}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, name: text }))
          }
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, phone: text }))
          }
          keyboardType="phone-pad"
        />

        <Button
          title="Save Profile"
          onPress={handleSaveProfile}
          color={Colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  disabledInput: {
    backgroundColor: Colors.inputBackground,
    color: Colors.textSecondary,
  },
});
