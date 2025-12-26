import { Dimensions, StyleSheet, View } from "react-native";

// We get the screen width to make sure the bar doesn't collapse in the header
const { width } = Dimensions.get("window");

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.barContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              // If index is 0 and currentStep is 1, the first bar lights up
              index < currentStep
                ? styles.segmentCompleted
                : styles.segmentIncomplete,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    // This ensures the header title area is filled correctly
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.5,
    marginTop: 20,
    marginHorizontal: 30, // Takes up 50% of the screen width
  },
  barContainer: {
    height: 6,
    flexDirection: "row",
    gap: 6, // Space between the segments
    flex: 1,
  },
  segment: {
    flex: 1, // This is key: it makes segments share the space equally
    height: 4,
    borderRadius: 2,
  },
  segmentIncomplete: {
    // Using a semi-transparent white looks better on dark headers
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  segmentCompleted: {
    backgroundColor: "#00C48C", // Bolt Green
  },
});
