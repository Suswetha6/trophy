import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { projectAPI } from '../api/client';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function FeedScreen({ navigation }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // newest, most_starred

    const fetchProjects = async () => {
        try {
            const response = await projectAPI.getProjects({ sort_by: sortBy });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [sortBy]);

    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProjects();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.starContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.starCount}>{item.star_count}</Text>
                </View>
            </View>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            <View style={styles.techStack}>
                {item.tech_stack && item.tech_stack.split(',').map((tech, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tech.trim()}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.author}>By {item.owner ? item.owner.name : 'Unknown'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, sortBy === 'newest' && styles.activeFilter]}
                    onPress={() => setSortBy('newest')}
                >
                    <Text style={[styles.filterText, sortBy === 'newest' && styles.activeFilterText]}>Newest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, sortBy === 'most_starred' && styles.activeFilter]}
                    onPress={() => setSortBy('most_starred')}
                >
                    <Text style={[styles.filterText, sortBy === 'most_starred' && styles.activeFilterText]}>Top Rated</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={projects}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#f3f4f6',
    },
    activeFilter: {
        backgroundColor: '#6366f1',
    },
    filterText: {
        color: '#4b5563',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        flex: 1,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    starCount: {
        marginLeft: 4,
        fontWeight: 'bold',
        color: '#b45309',
    },
    description: {
        color: '#4b5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    techStack: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        color: '#4338ca',
        fontSize: 12,
        fontWeight: '500',
    },
    author: {
        fontSize: 12,
        color: '#9ca3af',
    },
});
