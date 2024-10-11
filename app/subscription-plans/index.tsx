import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width,height } = Dimensions.get('window');

const SubscriptionPlanScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <View style={styles.container}>
      <View style={styles.giftContainer}>
        <LottieView
          source={require('../../assets/animations/gift.json')}
          autoPlay
          loop
          style={styles.giftAnimation}
        />
      </View>
      <Text style={styles.title}>Unlock the All Courses with CodeBox Pro</Text>
      <View style={styles.plansContainer}>
        <TouchableOpacity 
          style={[styles.planButton, selectedPlan === 'monthly' && styles.selectedPlan]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <Text style={[styles.planDuration, selectedPlan === 'monthly' && styles.selectedText]}>1 Month</Text>
          <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.selectedText]}>$2.99 / Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.planButton, selectedPlan === 'yearly' && styles.selectedPlan]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <Text style={[styles.planDuration, selectedPlan === 'yearly' && styles.selectedText]}>1 Year</Text>
          <Text style={[styles.planPrice, selectedPlan === 'yearly' && styles.selectedText]}>$23.99 / Year</Text>
          <Text style={styles.savings}>19% saving</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.enrollButton}>
        <Text style={styles.enrollButtonText}>START TO ENROLL NOW</Text>
      </TouchableOpacity>
      <Text style={styles.securePayment}>Secured by STRIPE PAYMENT</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5D3FD3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  giftContainer: {
    width: width * 0.75,
    height: height*0.3,
    marginBottom: 20,
  },
  giftAnimation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  planButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    width: width * 0.43,
    alignItems: 'center',
  },
  selectedPlan: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  planDuration: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 14,
    color: 'white',
  },
  selectedText: {
    color: 'white',
  },
  savings: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
  enrollButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  enrollButtonText: {
    color: '#5D3FD3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securePayment: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});

export default SubscriptionPlanScreen;