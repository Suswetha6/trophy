import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { projectAPI } from '../api/client';

export default function CreateProjectScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description) {
            Alert.alert('Error', 'Title and Description are required');
            return;
        }

        setLoading(true);
        try {
            await projectAPI.createProject({
                title,
                description,
                tech_stack: techStack,
                github_link: githubLink,
                demo_link: demoLink,
                image_urls: '[]' // Placeholder for now
            });
            Alert.alert('Success', 'Project created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating project:', error);
            Alert.alert('Error', 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Project Title *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Trophy App"
                />

                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your project..."
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Tech Stack (comma separated)</Text>
                <TextInput
                    style={styles.input}
                    value={techStack}
                    onChangeText={setTechStack}
                    placeholder="e.g. React Native, FastAPI, PostgreSQL"
                />

                <Text style={styles.label}>GitHub Link</Text>
                <TextInput
                    style={styles.input}
                    value={githubLink}
                    onChangeText={setGithubLink}
                    placeholder="https://github.com/..."
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Demo Link</Text>
                <TextInput
                    style={styles.input}
                    value={demoLink}
                    onChangeText={setDemoLink}
                    placeholder="https://..."
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Publish Project</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#6366f1',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
