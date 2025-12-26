import { useSubmitDriverInfo } from "@/hooks/queries";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DriverInfoScreen() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);

  const { mutate: submitDriverInfo, isPending } = useSubmitDriverInfo();
  const [errors, setErrors] = useState({
    licenseNumber: "",
  });

  const pickImage = async (type: "profile" | "license") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (type === "profile") {
        setProfilePhoto(uri);
      } else {
        setLicensePhoto(uri);
      }
    }
  };

  // NEW: Logical Back Handler
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if history is lost (e.g., after a refresh)
      router.replace("/(onboarding)/personal-info");
    }
  };

  const handleNext = () => {
    if (!licenseNumber || !profilePhoto || !licensePhoto) {
      Alert.alert(
        "Error",
        "Please fill in all required fields and upload the necessary photos"
      );
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("licenseNumber", licenseNumber);

    formDataToSubmit.append("profilePhoto", {
      uri: profilePhoto,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    formDataToSubmit.append("licensePhoto", {
      uri: licensePhoto,
      type: "image/jpeg",
      name: "license.jpg",
    } as any);

    submitDriverInfo(formDataToSubmit, {
      onSuccess: () => {
        router.push("/(onboarding)/vehicle-info");
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          "Failed to save driver information. Please try again."
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BlazeDriver</Text>
          <Text style={styles.subtitle}>
            We're legally required to ask you for some documents to sign you up
            as a driver. Documents scans and quality photos are accepted.
          </Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>
              Need help getting documents? Click here!
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* License Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Driver's license number for Cars / NIN for Motorbike and
              Tricycles. <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.licenseNumber ? styles.inputError : null,
              ]}
              value={licenseNumber}
              onChangeText={(text) => {
                if (text.length <= 12) {
                  setLicenseNumber(text);

                  // Simple check: if they started typing but aren't at 12 yet
                  if (text.length > 0 && text.length < 12) {
                    setErrors({
                      ...errors,
                      licenseNumber: "Must be 12 characters",
                    });
                  } else {
                    setErrors({ ...errors, licenseNumber: "" });
                  }
                }
              }}
              placeholder="Enter license number"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={12}
            />

            {errors.licenseNumber ? (
              <Text style={styles.errorText}>{errors.licenseNumber}</Text>
            ) : (
              <Text style={styles.hint}>
                If you're a Car driver, add your license number on your driver's
                license, if you're a Motorbike or Tricycle driver, add your
                National ID number.
              </Text>
            )}

            {/* Character counter at the bottom */}
            <Text style={styles.charCount}>{licenseNumber.length}/12</Text>
          </View>

          {/* Driver's Profile Photo */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Driver's profile photo <Text style={styles.required}>*</Text>
              </Text>
              {profilePhoto && (
                <Text style={styles.uploadedBadge}>Uploaded</Text>
              )}
            </View>
            <Text style={styles.description}>
              Please provide a clear portrait picture (not a full body picture)
              of yourself. It should show your full face, front view, with eyes
              open (Do not wear a cap, earphones, or glasses)
            </Text>
            {profilePhoto ? (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setProfilePhoto(null)}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("profile")}
              >
                <Ionicons name="add" size={24} color="#64748B" />
                <Text style={styles.uploadButtonText}>Upload file</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Driver's License */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Driver's license <Text style={styles.required}>*</Text>
              </Text>
              {licensePhoto && (
                <Text style={styles.uploadedBadge}>Uploaded</Text>
              )}
            </View>
            <Text style={styles.description}>
              Please provide a clear driver's license (not expired) showing the
              license number, your name, and date of birth and expiry date.
            </Text>
            {licensePhoto ? (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: licensePhoto }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setLicensePhoto(null)}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("license")}
              >
                <Ionicons name="add" size={24} color="#64748B" />
                <Text style={styles.uploadButtonText}>Upload file</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER WITH FIXED BACK BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, isPending && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isPending}
        >
          <Text style={styles.nextButtonText}>
            {isPending ? "Saving..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { marginBottom: 32, marginTop: 30 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  subtitle: { fontSize: 14, color: "#64748B", lineHeight: 20, marginBottom: 8 },
  helpLink: { fontSize: 14, color: "#00C48C", fontWeight: "500" },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  required: { color: "#EF4444" },
  uploadedBadge: { fontSize: 12, fontWeight: "500", color: "#00C48C" },
  description: { fontSize: 13, color: "#64748B", lineHeight: 18 },
  hint: { fontSize: 12, color: "#64748B", lineHeight: 16 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uploadButton: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  photoPreview: { position: "relative", borderRadius: 8, overflow: "hidden" },
  previewImage: { width: "100%", height: 200, resizeMode: "cover" },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  backButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backButtonText: { fontSize: 16, fontWeight: "600", color: "#64748B" },
  nextButton: {
    flex: 1,
    backgroundColor: "#00C48C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  nextButtonDisabled: { backgroundColor: "#9CA3AF" },
  nextButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  inputError: {
    borderColor: "#EF4444", // Red border
    borderWidth: 1.5,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  charCount: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "right",
    marginTop: 4,
  },
});
