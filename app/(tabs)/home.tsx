import { StyleSheet,View, Text } from 'react-native'
import React from 'react'
//Check kar
const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Fixed typo here
  },
});

export default Page