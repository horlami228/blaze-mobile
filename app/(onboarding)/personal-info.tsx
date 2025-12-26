import { useSubmitPersonalInfo } from "@/hooks/queries";
import type { SubmitPersonalInfoRequest } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function PersonalInfoScreen() {
  const [formData, setFormData] = useState<SubmitPersonalInfoRequest>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [isFocus, setIsFocus] = useState(false);

  const { mutate: submitPersonalInfo, isPending } = useSubmitPersonalInfo();

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateValue(selectedDate);
      const formatted = selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setFormData({ ...formData, dateOfBirth: formatted });
    }
  };

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    submitPersonalInfo(formData, {
      onSuccess: () => {
        router.push("/(onboarding)/driver-info");
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          "Failed to save personal information. Please try again."
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
          <Text style={styles.step}>Personal Information</Text>
          <Text style={styles.subtitle}>
            Only your first name and vehicle details are visible to clients
            during the booking
          </Text>
        </View>

        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="compact"
                onChange={handleDateChange}
                maximumDate={new Date()}
                accentColor="#00C48C"
              />
            </View>
          </View>

          {/* Gender with Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && styles.dropdownFocused]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={genderOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select gender" : "..."}
              value={formData.gender}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setFormData({ ...formData, gender: item.value });
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <Ionicons
                  style={styles.icon}
                  color={isFocus ? "#00C48C" : "#64748B"}
                  name="person-outline"
                  size={20}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
  },
  datePickerContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    alignItems: "flex-start",
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#00C48C",
    borderRadius: 10,
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
});
