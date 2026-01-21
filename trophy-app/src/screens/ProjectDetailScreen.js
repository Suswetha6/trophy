import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { projectAPI } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailScreen({ route, navigation }) {
    const { projectId } = route.params;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starring, setStarring] = useState(false);

    const fetchProject = async () => {
        try {
            const response = await projectAPI.getProject(projectId);
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
            Alert.alert('Error', 'Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const handleStar = async () => {
        setStarring(true);
        try {
            const response = await projectAPI.starProject(projectId);
            // Update local state
            setProject(prev => ({
                ...prev,
                star_count: response.data.starred ? prev.star_count + 1 : prev.star_count - 1
            }));
        } catch (error) {
            console.error('Error starring project:', error);
        } finally {
            setStarring(false);
        }
    };

    const openLink = (url) => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{project.title}</Text>
                <TouchableOpacity
                    style={styles.starButton}
                    onPress={handleStar}
                    disabled={starring}
                >
                    <Ionicons name="star" size={24} color="#FFD700" />
                    <Text style={styles.starCount}>{project.star_count}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.author}>By {project.owner ? project.owner.name : 'Unknown'}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{project.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tech Stack</Text>
                <View style={styles.techStack}>
                    {project.tech_stack && project.tech_stack.split(',').map((tech, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tech.trim()}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.linksContainer}>
                {project.github_link ? (
                    <TouchableOpacity
                        style={[styles.linkButton, styles.githubButton]}
                        onPress={() => openLink(project.github_link)}
                    >
                        <Ionicons name="logo-github" size={20} color="#fff" />
                        <Text style={styles.linkText}>View on GitHub</Text>
                    </TouchableOpacity>
                ) : null}

                {project.demo_link ? (
                    <TouchableOpacity
                        style={[styles.linkButton, styles.demoButton]}
                        onPress={() => openLink(project.demo_link)}
                    >
                        <Ionicons name="globe-outline" size={20} color="#fff" />
                        <Text style={styles.linkText}>View Demo</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        flex: 1,
        marginRight: 10,
    },
    starButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    starCount: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#b45309',
    },
    author: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
    },
    techStack: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 10,
        marginBottom: 8,
    },
    tagText: {
        color: '#4338ca',
        fontSize: 14,
        fontWeight: '500',
    },
    linksContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
    },
    githubButton: {
        backgroundColor: '#24292f',
    },
    demoButton: {
        backgroundColor: '#6366f1',
    },
    linkText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
});
