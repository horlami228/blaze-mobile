import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
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
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSignIn = () => {
    router.push("/(tabs)/home");
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
              size={80}
              color="rgba(255,255,255,0.8)"
            />
          </View>

          <Text style={styles.headerText}>
            New to Blaze? Enjoy up to 60% off on your first ride-hailing trips!
          </Text>
        </View>

        {/* Bottom Content Section */}
        <View style={styles.content}>
          <Text style={styles.title}>Enter your number</Text>

          {/* Input Row */}
          <View style={styles.inputRow}>
            {/* Country Code */}
            <TouchableOpacity style={styles.countrySelector}>
              {/* Simple flag emoji fallback or icon */}
              <Text style={{ fontSize: 20 }}>🇳🇬</Text>
              <Text style={styles.countryCode}>+234</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>

            {/* Phone Input */}
            <TextInput
              style={styles.phoneInput}
              placeholder="7043168193"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
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

          {/* <TouchableOpacity style={styles.socialButton}>
            <Ionicons
              name="logo-google"
              size={20}
              color="black"
              style={styles.socialIcon}
            />
    
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity> */}

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
    backgroundColor: "#288960", // Bolt Green
  },
  header: {
    flex: 0.45, // Roughly 45% of the screen
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  illustrationContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    // In a real app, this would be an Image
  },
  headerText: {
    color: "white",
    fontSize: 18,
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
  inputRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  signInButton: {
    backgroundColor: "#288960",
    paddingVertical: 16,
    borderRadius: 30, // Fully rounded pill shape
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
    marginTop: 20,
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
});
