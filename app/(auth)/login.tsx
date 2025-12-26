import { handleApiError } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    Keyboard.dismiss();
    setErrorMessage(""); // Clear previous errors
    try {
      if (!email || !password) {
        setErrorMessage("Please enter both email and password");
        return;
      }
      await login(email, password);
    } catch (error: any) {
      console.log("Sign in failed:", error.message);
      setErrorMessage(handleApiError(error));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Header Section */}
        <View style={styles.header}>
          {/* Illustration Placeholder */}
          <View style={styles.illustrationContainer}>
            {/* Placeholder for the gift box illustration */}
            <Ionicons
              name="gift-outline"
              size={60}
              color="rgba(255, 255, 255, 0.8)"
            />
          </View>

          <Text style={styles.headerText}>
            New to Blaze? Enjoy up to 60% off on your first ride-hailing trips!
          </Text>
        </View>

        {/* Bottom Content Section */}
        <View style={styles.content}>
          {/* Input Row */}
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons
              name="logo-apple"
              size={20}
              color="black"
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/images/google-logo.png")}
              style={{ width: 20, height: 20, position: "absolute", left: 24 }}
            />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons
              name="logo-facebook"
              size={20}
              color="#1877F2"
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By signing up, you agree to our{" "}
            <Text style={styles.linkText}>Terms & Conditions</Text>, acknowledge
            our <Text style={styles.linkText}>Privacy Policy</Text>, and confirm
            that you're over 18.
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19942dff", // Bolt Green
  },
  header: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  illustrationContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  content: {
    flex: 1, // Takes up remaining space
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: "#288960",
    paddingVertical: 16,
    borderRadius: 30, // Fully rounded pill shape
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#666",
    fontSize: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
    position: "relative",
  },
  socialIcon: {
    position: "absolute",
    left: 24,
  },
  socialButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  legalText: {
    marginTop: 10,
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  linkText: {
    textDecorationLine: "underline",
    fontWeight: "500",
    color: "#288960",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    flex: 1,
  },
});
