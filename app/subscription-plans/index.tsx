import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import LottieView from "lottie-react-native";
import {
  StripeProvider,
  useStripe,
  CardField,
} from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { addSubscription } from "@/services/subscriptionService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";

const { width, height } = Dimensions.get("window");

const SubscriptionPlanScreen: React.FC = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [isPaymentViewVisible, setPaymentViewVisible] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ card?: string }>({});
  const user = useSelector((state: RootState) => state.user);
  const userId = user.userId || "";
  const dispatch = useDispatch();

  const getAmount = () => {
    return selectedPlan === "monthly" ? 299 : 2399; // Amount in cents
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(
        `https://new-exp-stripe.vercel.app/payment-sheet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: getAmount() }),
        }
      );

      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      throw new Error("Failed to fetch payment sheet params");
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Your Merchant Name",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true, // Modify based on your requirements
        appearance: {
          colors: {
            primary: "#5D3FD3",
          },
        },
      });

      if (!error) {
        setPaymentViewVisible(true);
      } else {
        Alert.alert("Error", error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handlePayment = async () => {

    if (!isPaymentViewVisible) {
      await initializePaymentSheet();
      return;
    }


    setLoading(true);
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        const stripeSubscriptionId = "sub_XXXXXXXXXXXXXXXX"; // Replace with actual ID
        await addSubscription(userId, selectedPlan, stripeSubscriptionId);

        Alert.alert("Success", "Your subscription was successful!");
        dispatch(
          setUser({
            userId: user.userId || "",
            username: user.username || "",
            userEmail: user.userEmail || "",
            token: user.token,
            profile: user.profile,
            isSubscribed: true,
          })
        );

        setPaymentViewVisible(false);

        Alert.alert("Success", "Your subscription was successful!");
        setPaymentViewVisible(false);

        setTimeout(() => {
          router.push("/(tabs)"); // Replace with your desired route
        }, 2000);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollPress = () => {
    initializePaymentSheet();
  };

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPEPUBLISHABLE_KEY}
    >
      <View style={styles.container}>
        <View style={styles.giftContainer}>
          <LottieView
            source={require("../../assets/animations/gift.json")}
            autoPlay
            loop
            style={styles.giftAnimation}
          />
        </View>
        <Text style={styles.title}>Unlock All Courses with CodeBox Pro</Text>
        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === "monthly" && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <Text
              style={[
                styles.planDuration,
                selectedPlan === "monthly" && styles.selectedText,
              ]}
            >
              1 Month
            </Text>
            <Text
              style={[
                styles.planPrice,
                selectedPlan === "monthly" && styles.selectedText,
              ]}
            >
              $2.99 / Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === "yearly" && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlan("yearly")}
          >
            <Text
              style={[
                styles.planDuration,
                selectedPlan === "yearly" && styles.selectedText,
              ]}
            >
              1 Year
            </Text>
            <Text
              style={[
                styles.planPrice,
                selectedPlan === "yearly" && styles.selectedText,
              ]}
            >
              $23.99 / Year
            </Text>
            <Text style={styles.savings}>19% saving</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.enrollButton}
          // onPress={handleEnrollPress}
          onPress={handlePayment}
        >
          <Text style={styles.enrollButtonText}>START TO ENROLL NOW</Text>
        </TouchableOpacity>
        <Text style={styles.securePayment}>Secured by STRIPE PAYMENT</Text>

        {/* Payment Modal Overlay */}
        {/* {isPaymentViewVisible && (
          <View style={styles.overlay}>
            <View style={styles.paymentContainer}>
              <Text style={styles.modalTitle}>Enter Payment Details</Text>
              <View style={styles.cardFieldContainer}>
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{ number: "4242 4242 4242 4242" }}
                  cardStyle={styles.card}
                  style={styles.cardContainer}
                  onCardChange={(cardDetails) => {
                    // Add any validation you need based on cardDetails
                    if (!cardDetails.complete) {
                      setErrors({ card: "Please enter valid card details." });
                    } else {
                      setErrors({});
                    }
                  }}
                />
                {errors.card && (
                  <Text style={styles.errorText}>{errors.card}</Text>
                )}
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handlePayment}
                >
                  <Text style={styles.submitButtonText}>Pay Now</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPaymentViewVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
      </View>
    </StripeProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D3FD3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  selectedText: {
    color: "white",
  },
  giftContainer: {
    width: width * 0.75,
    height: height * 0.3,
    marginBottom: 20,
  },
  giftAnimation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  planButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "48%",
    alignItems: "center",
  },
  selectedPlan: {
    backgroundColor: "#e0e0e0",
  },
  planDuration: {
    fontSize: 18,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "400",
  },
  savings: {
    fontSize: 14,
    color: "green",
  },
  enrollButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  enrollButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  securePayment: {
    color: "white",
    fontSize: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentContainer: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardFieldContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F6F6F6",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
  },
  cardContainer: {
    height: 50,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#5D3FD3",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "red",
  },
});

export default SubscriptionPlanScreen;
