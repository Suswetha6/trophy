import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    branch: 'Computer Science',
    year: 1,
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);

  const handleSignup = async () => {
    // Validation
    if (!formData.email || !formData.name || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert(
        'Signup Failed',
        error.response?.data?.detail || 'Could not create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Trophy and showcase your work</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="College Email *"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters) *"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry
            editable={!loading}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Branch</Text>
            <Picker
              selectedValue={formData.branch}
              onValueChange={(value) => updateField('branch', value)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Computer Science" value="Computer Science" />
              <Picker.Item label="Information Technology" value="Information Technology" />
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Mechanical" value="Mechanical" />
              <Picker.Item label="Civil" value="Civil" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Year</Text>
            <Picker
              selectedValue={formData.year}
              onValueChange={(value) => updateField('year', value)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="1st Year" value={1} />
              <Picker.Item label="2nd Year" value={2} />
              <Picker.Item label="3rd Year" value={3} />
              <Picker.Item label="4th Year" value={4} />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Skills (e.g., Python, React, Java)"
            value={formData.skills}
            onChangeText={(value) => updateField('skills', value)}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 5,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    color: '#64748b',
    fontSize: 16,
  },
  loginLink: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});