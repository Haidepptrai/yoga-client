import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Button,
} from "react-native";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface YogaSession {
  id: string;
  classDate: string;
  teacher: string;
  comment: string;
  courseId: string;
}

interface CourseDetails {
  timeOfCourse: string; // Start time as HH:MM (e.g., "09:00")
  duration: number; // Duration in minutes
}

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<YogaSession[]>([]);
  const [courseDetails, setCourseDetails] = useState<{
    [key: string]: CourseDetails;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        Alert.alert("Error", "You must be logged in to view the cart.");
        return;
      }

      try {
        setLoading(true);

        // Step 1: Get the user's cart items from `user_cart`
        const cartRef = collection(db, "user_cart");
        const cartQuery = query(cartRef, where("userId", "==", user.uid));
        const cartSnapshot = await getDocs(cartQuery);

        // Collect class IDs from the user's cart
        const classIds = cartSnapshot.docs.map((doc) => doc.data().classId);

        // Step 2: Fetch the class details from `yoga_sessions` using the class IDs
        const sessionPromises = classIds.map(async (classId: string) => {
          const sessionRef = doc(db, "yoga_sessions", classId);
          const sessionSnap = await getDoc(sessionRef);

          if (sessionSnap.exists()) {
            return { id: sessionSnap.id, ...sessionSnap.data() } as YogaSession;
          }
          return null;
        });

        // Step 3: Fetch course details for each class
        const sessions = (await Promise.all(sessionPromises)).filter(
          (session) => session !== null
        ) as YogaSession[];
        const courseIds = Array.from(
          new Set(sessions.map((s) => s.courseId.toString()))
        );
        const courseDetailsPromises = courseIds.map(async (courseId) => {
          const courseRef = doc(db, "yoga_courses", courseId);
          const courseSnap = await getDoc(courseRef);

          if (courseSnap.exists()) {
            return { id: courseId, ...courseSnap.data() } as CourseDetails;
          }
          return null;
        });

        const fetchedCourseDetails = (
          await Promise.all(courseDetailsPromises)
        ).filter((course) => course !== null) as CourseDetails[];

        // Map course details by courseId for easy access
        const courseDetailsMap = fetchedCourseDetails.reduce((acc, course) => {
          acc[course.id] = course;
          return acc;
        }, {} as { [key: string]: CourseDetails });

        setCourseDetails(courseDetailsMap);
        setCartItems(sessions);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Alert.alert("Error", "Could not load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const formatTime = (date: Date) => date.toTimeString().slice(0, 5); // Formats as HH:MM

  const checkout = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to proceed to checkout.");
        return;
      }

      // Fetch user profile details from Firestore
      const userProfileRef = doc(db, "users", user.uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const userProfileData = userProfileSnap.data();
        const userName = userProfileData?.name;
        const userPhone = userProfileData?.phone;

        if (!userName || !userPhone) {
          Alert.alert(
            "Incomplete Profile",
            "Please complete your profile with your name and phone number to proceed to checkout."
          );
          router.navigate("/(protected)/tabbed/profile"); // Navigate to profile screen to update information
        } else {
          Alert.alert("Success", "Proceeding to checkout...");

          // Step 1: Retrieve and delete all classes from `user_cart`
          const cartRef = collection(db, "user_cart");
          const cartQuery = query(cartRef, where("userId", "==", user.uid));
          const cartSnapshot = await getDocs(cartQuery);

          // Step 2: For each class in the cart, add it to `user_joined_class`
          const joinedClassPromises = cartSnapshot.docs.map(async (cartDoc) => {
            const { classId, addedAt } = cartDoc.data();

            // Add the class to `user_joined_class`
            const joinedClassRef = doc(
              db,
              "user_joined_class",
              `${user.uid}_${classId}`
            );
            await setDoc(joinedClassRef, {
              userId: user.uid,
              classId,
              joinedAt: Date.now(),
              addedAt, // Optional: keeping the original added time
            });

            // Delete the class from `user_cart`
            await deleteDoc(cartDoc.ref); // Use deleteDoc to delete from Firestore

            setCartItems([]);
          });

          // Wait for all `user_joined_class` updates and cart deletions to complete
          await Promise.all(joinedClassPromises);

          // Notify the user that the checkout process is complete
          Alert.alert(
            "Checkout Complete",
            "All classes have been joined successfully."
          );
        }
      } else {
        Alert.alert("Error", "User profile not found.");
        router.navigate("/(protected)/tabbed/profile");
      }
    } catch (error) {
      console.error("Error checking profile information:", error);
      Alert.alert("Error", "Could not proceed to checkout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return <Text style={styles.emptyCartText}>Your cart is empty.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.cartTitle}>Your Cart</Text>

      {cartItems.map((session) => {
        const course = courseDetails[session.courseId];
        let formattedTime = "";

        if (course) {
          // Parse start time and calculate end time
          const startTime = new Date(`2023-01-01T${course.timeOfCourse}:00`);
          const endTime = new Date(
            startTime.getTime() + course.duration * 60000
          );
          formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        }

        return (
          <View key={session.id} style={styles.sessionItem}>
            <Text style={styles.sessionText}>Date: {session.classDate}</Text>
            <Text style={styles.sessionText}>Teacher: {session.teacher}</Text>
            <Text style={styles.sessionText}>Time: {formattedTime}</Text>
            <Text style={styles.sessionComment}>
              Comment: {session.comment}
            </Text>
          </View>
        );
      })}

      {/* Checkout Button */}
      <Button title="Checkout" onPress={checkout} color={Colors.primary} />
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 10,
  },
  emptyCartText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  sessionItem: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  sessionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sessionComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 8,
  },
});
