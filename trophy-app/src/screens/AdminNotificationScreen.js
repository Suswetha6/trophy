import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { alertsAPI } from '../api/client';

export default function AdminNotificationScreen({ navigation }) {
    const [message, setMessage] = useState('');
    const [targetGroup, setTargetGroup] = useState('all');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter a message');
            return;
        }

        setLoading(true);
        try {
            await alertsAPI.broadcast({
                message,
                target_group: targetGroup,
                channels: ['in-app']
            });
            Alert.alert('Success', 'Notification sent successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error sending notification:', error);
            Alert.alert('Error', 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter notification message..."
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Target Group</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={targetGroup}
                            onValueChange={setTargetGroup}
                            style={styles.picker}
                            enabled={!loading}
                        >
                            <Picker.Item label="All Users" value="all" />
                            <Picker.Item label="CS Students" value="branch_cs" />
                            <Picker.Item label="1st Year" value="year_1" />
                        </Picker>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSend}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Sending...' : 'Send Notification'}
                        </Text>
                    </TouchableOpacity>
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
        padding: 20,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        height: 120,
    },
    pickerContainer: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        marginBottom: 24,
    },
    picker: {
        height: 50,
    },
    button: {
        backgroundColor: '#6366f1',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
