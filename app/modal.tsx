import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text>This is a modal screen for additional settings and information.</Text>
      <Button mode="contained" style={styles.button}>
        Save Settings
      </Button>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#10b981',
  },
});