import {
  useManufacturers,
  useModels,
  useSubmitVehicleInfo,
} from "@/hooks/queries";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function VehicleInfoScreen() {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    manufacturerId: "",
    modelId: "",
    plateNumber: "",
    color: "",
  });

  const [isFocus, setIsFocus] = useState({
    year: false,
    manufacturer: false,
    model: false,
    color: false,
  });

  const [exteriorPhoto, setExteriorPhoto] = useState<string | null>(null);
  const [interiorPhoto, setInteriorPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    plateNumber: "",
  });

  const { mutate: submitVehicleInfo, isPending } = useSubmitVehicleInfo();

  // Fetch manufacturers and models from API
  const { data: manufacturers, isLoading: loadingManufacturers } =
    useManufacturers();

  const { data: models, isLoading: loadingModels } = useModels(
    formData.manufacturerId
  );

  const pickImage = async (type: "exterior" | "interior") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (type === "exterior") setExteriorPhoto(uri);
      else if (type === "interior") setInteriorPhoto(uri);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if history is lost (e.g., after a refresh)
      router.replace("/(onboarding)/driver-info");
    }
  };

  const handleSubmit = () => {
    if (
      !formData.manufacturerId ||
      !formData.modelId ||
      !formData.plateNumber ||
      !formData.color ||
      !exteriorPhoto ||
      !interiorPhoto
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields and upload all photos"
      );
      return;
    }

    // Build FormData for multipart/form-data submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("vehicleYear", String(formData.year));
    formDataToSubmit.append("modelId", formData.modelId);
    formDataToSubmit.append("plateNumber", formData.plateNumber);
    formDataToSubmit.append("vehicleColor", formData.color);

    formDataToSubmit.append("exteriorPhoto", {
      uri: exteriorPhoto,
      type: "image/jpeg",
      name: "vehicle-exterior.jpg",
    } as any);

    formDataToSubmit.append("interiorPhoto", {
      uri: interiorPhoto,
      type: "image/jpeg",
      name: "vehicle-interior.jpg",
    } as any);

    // formDataToSubmit.append("vehicleCertificate", {
    //   uri: certificatePhoto,
    //   type: "image/jpeg",
    //   name: "vehicle-certificate.jpg",
    // } as any);

    submitVehicleInfo(formDataToSubmit, {
      onSuccess: () => {
        Alert.alert(
          "Success",
          "Onboarding completed! We will review your application."
        );
        router.replace("/(tabs)/home");
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          "Failed to save vehicle information. Please try again."
        );
      },
    });
  };

  // Color data with uppercase values
  const colors = [
    { label: "Beige", value: "BEIGE" },
    { label: "Black", value: "BLACK" },
    { label: "Blue", value: "BLUE" },
    { label: "Brown", value: "BROWN" },
    { label: "Gold", value: "GOLD" },
    { label: "Gray", value: "GRAY" },
    { label: "Green", value: "GREEN" },
    { label: "Orange", value: "ORANGE" },
    { label: "Red", value: "RED" },
    { label: "Silver", value: "SILVER" },
    { label: "White", value: "WHITE" },
    { label: "Yellow", value: "YELLOW" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => ({
    label: String(currentYear - i),
    value: currentYear - i,
  }));

  // Transform manufacturers data for dropdown
  const manufacturerOptions =
    manufacturers?.map((m) => ({
      label: m.name,
      value: m.id,
    })) || [];

  // Transform models data for dropdown
  const modelOptions =
    models?.map((m) => ({
      label: m.name,
      value: m.id,
    })) || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BlazeDriver</Text>
          <Text style={styles.step}>Vehicle Information</Text>
          <Text style={styles.subtitle}>
            We're legally required to ask you for some documents to sign you up
            as a driver. Documents scans and quality photos are accepted.
          </Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>
              Need help getting documents? Click here!
            </Text>
          </TouchableOpacity>

          <View style={styles.checkboxContainer}>
            <Ionicons name="checkbox" size={24} color="#00C48C" />
            <Text style={styles.checkboxText}>
              I have a vehicle that I will drive.
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Vehicle Year */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle year <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus.year && styles.dropdownFocused]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={years}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus.year ? "Select year" : "..."}
              searchPlaceholder="Search year..."
              value={formData.year}
              onFocus={() => setIsFocus({ ...isFocus, year: true })}
              onBlur={() => setIsFocus({ ...isFocus, year: false })}
              onChange={(item) => {
                setFormData({ ...formData, year: item.value });
                setIsFocus({ ...isFocus, year: false });
              }}
              renderLeftIcon={() => (
                <Ionicons
                  style={styles.icon}
                  color={isFocus.year ? "#00C48C" : "#64748B"}
                  name="calendar-outline"
                  size={20}
                />
              )}
            />
          </View>

          {/* Manufacturer */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle manufacturer <Text style={styles.required}>*</Text>
            </Text>
            {loadingManufacturers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00C48C" />
                <Text style={styles.loadingText}>Loading manufacturers...</Text>
              </View>
            ) : (
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus.manufacturer && styles.dropdownFocused,
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={manufacturerOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={
                  !isFocus.manufacturer ? "Select manufacturer" : "..."
                }
                searchPlaceholder="Search manufacturer..."
                value={formData.manufacturerId}
                onFocus={() => setIsFocus({ ...isFocus, manufacturer: true })}
                onBlur={() => setIsFocus({ ...isFocus, manufacturer: false })}
                onChange={(item) => {
                  setFormData({
                    ...formData,
                    manufacturerId: item.value,
                    modelId: "",
                  });
                  setIsFocus({ ...isFocus, manufacturer: false });
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    style={styles.icon}
                    color={isFocus.manufacturer ? "#00C48C" : "#64748B"}
                    name="car-outline"
                    size={20}
                  />
                )}
              />
            )}
          </View>

          {/* Model */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle model <Text style={styles.required}>*</Text>
            </Text>
            {loadingModels ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00C48C" />
                <Text style={styles.loadingText}>Loading models...</Text>
              </View>
            ) : (
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus.model && styles.dropdownFocused,
                  !formData.manufacturerId && styles.dropdownDisabled,
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={modelOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus.model ? "Select model" : "..."}
                searchPlaceholder="Search model..."
                value={formData.modelId}
                onFocus={() => setIsFocus({ ...isFocus, model: true })}
                onBlur={() => setIsFocus({ ...isFocus, model: false })}
                onChange={(item) => {
                  setFormData({ ...formData, modelId: item.value });
                  setIsFocus({ ...isFocus, model: false });
                }}
                disable={!formData.manufacturerId}
                renderLeftIcon={() => (
                  <Ionicons
                    style={styles.icon}
                    color={isFocus.model ? "#00C48C" : "#64748B"}
                    name="car-sport-outline"
                    size={20}
                  />
                )}
              />
            )}
            <Text style={styles.hint}>
              If you don't find your vehicle model from the list then let us
              know at info@blaze.eu.
            </Text>
          </View>

          {/* License Plate */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Licence plate <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.plateNumber ? styles.inputError : null, // Red border if error
              ]}
              value={formData.plateNumber}
              onChangeText={(text) => {
                // Limit input to 9 characters max so they can't even type more
                if (text.length <= 9) {
                  setFormData({ ...formData, plateNumber: text });

                  // Validation logic
                  if (text.length > 0 && text.length < 9) {
                    setErrors({
                      ...errors,
                      plateNumber: "Plate number must be exactly 9 characters",
                    });
                  } else {
                    setErrors({ ...errors, plateNumber: "" });
                  }
                }
              }}
              placeholder="Enter license plate number"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={9} // Physical limit for the keyboard
            />

            {/* Inline Error Message */}
            {errors.plateNumber ? (
              <Text style={styles.errorText}>{errors.plateNumber}</Text>
            ) : (
              <Text style={styles.charCount}>
                {formData.plateNumber.length}/9
              </Text>
            )}
          </View>

          {/* Vehicle Color */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle colour <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus.color && styles.dropdownFocused]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={colors}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus.color ? "Select color" : "..."}
              searchPlaceholder="Search color..."
              value={formData.color}
              onFocus={() => setIsFocus({ ...isFocus, color: true })}
              onBlur={() => setIsFocus({ ...isFocus, color: false })}
              onChange={(item) => {
                setFormData({ ...formData, color: item.value });
                setIsFocus({ ...isFocus, color: false });
              }}
              renderLeftIcon={() => (
                <Ionicons
                  style={styles.icon}
                  color={isFocus.color ? "#00C48C" : "#64748B"}
                  name="color-palette-outline"
                  size={20}
                />
              )}
            />
          </View>

          {/* Exterior Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Exterior Photo of your Vehicle{" "}
              <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.description}>
              Upload a clear picture of your vehicle's exterior, ensuring that
              the plate number is fully visible from either the front or back
              view.
            </Text>
            {exteriorPhoto ? (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: exteriorPhoto }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setExteriorPhoto(null)}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("exterior")}
              >
                <Ionicons name="add" size={24} color="#64748B" />
                <Text style={styles.uploadButtonText}>Upload file</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Interior Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Interior Photo of your Vehicle{" "}
              <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.description}>
              Provide a clear interior photo of your vehicle.
            </Text>
            {interiorPhoto ? (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: interiorPhoto }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setInteriorPhoto(null)}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("interior")}
              >
                <Ionicons name="add" size={24} color="#64748B" />
                <Text style={styles.uploadButtonText}>Upload file</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Vehicle License Certificate */}
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle License Certificate <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.description}>
              Upload the Vehicle License document of the car
            </Text>
            {certificatePhoto ? (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: certificatePhoto }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setCertificatePhoto(null)}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("certificate")}
              >
                <Ionicons name="add" size={24} color="#64748B" />
                <Text style={styles.uploadButtonText}>Upload file</Text>
              </TouchableOpacity>
            )}
          </View> */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, isPending && styles.nextButtonDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text style={styles.nextButtonText}>
            {isPending ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 30,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  step: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 8,
  },
  helpLink: {
    fontSize: 14,
    color: "#00C48C",
    fontWeight: "500",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: "#1E293B",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  required: {
    color: "#EF4444",
  },
  description: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdown: {
    height: 54,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdownFocused: {
    borderColor: "#00C48C",
    borderWidth: 2,
  },
  dropdownDisabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#1E293B",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748B",
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
  photoPreview: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
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
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#00C48C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
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
