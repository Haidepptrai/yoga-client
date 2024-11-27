import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;
    try {
      if (isLogin) {
        // Log in user
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/(protected)/tabbed");
      } else {
        // Attempt to create a new account
        await createUserWithEmailAndPassword(auth, email, password);
        setEmailError(null);
        setSuccessMessage("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already registered.");
      } else if (error.code === "auth/invalid-credential") {
        console.log(error)
        setEmailError(
          "Invalid credentials provided. Please check your information and try again."
        );
      } else {
        console.error("Sign up error:", error);
        setEmailError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </Text>

      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text> // Display success message
      )}

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                setEmailError(null); // Clear email error on change
              }}
              value={value}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                ...(errors.email || emailError ? [styles.inputError] : []),
              ]}
              placeholderTextColor={Colors.textSecondary}
            />
            {(errors.email || emailError) && (
              <Text style={styles.errorText}>
                {errors.email?.message || emailError}
              </Text>
            )}
          </>
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry
              style={[styles.input, errors.password && styles.inputError]}
              placeholderTextColor={Colors.textSecondary}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isLogin ? styles.loginButton : styles.signUpButton,
        ]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>

      {/* Switch between Login and Sign Up */}
      <TouchableOpacity
        onPress={() => {
          setIsLogin(!isLogin);
          setSuccessMessage(null); // Clear success message when switching modes
        }}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "Don’t have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 32,
  },
  successText: {
    color: "green",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: {
    borderColor: "red",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 16,
  },
  loginButton: {
    backgroundColor: Colors.primary,
  },
  signUpButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    color: Colors.textPrimary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
