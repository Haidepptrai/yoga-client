import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Alert } from "react-native";

export const addToCart = async (
  userId: string,
  classId: number
): Promise<void> => {
  try {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to add a class to the cart.");
      return;
    }

    const cartRef = doc(db, "user_cart", `${userId}_${classId}`);
    await setDoc(cartRef, {
      userId,
      classId,
      addedAt: Date.now(),
    });

    Alert.alert("Success", "Class added to cart!");
  } catch (error) {
    console.error("Error adding class to cart:", error);
    Alert.alert("Error", "Could not add class to cart. Please try again.");
  }
};
