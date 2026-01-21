import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.details}>{user.branch} • Year {user.year}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                    {user.skills && user.skills.split(',').map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                            <Text style={styles.skillText}>{skill.trim()}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Badges</Text>
                {user.badges && user.badges.length > 0 ? (
                    <View style={styles.badgesContainer}>
                        {user.badges.map((badge, index) => (
                            <View key={index} style={styles.badge}>
                                <Ionicons name="trophy" size={24} color="#FFD700" />
                                <View style={styles.badgeInfo}>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No badges yet. Publish a project to earn one!</Text>
                )}
            </View>

            {user.is_admin && (
                <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() => navigation.navigate('AdminNotification')}
                >
                    <Ionicons name="megaphone" size={20} color="#fff" />
                    <Text style={styles.adminButtonText}>Send Notification</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#f3f4f6',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    details: {
        fontSize: 16,
        color: '#6b7280',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillTag: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    skillText: {
        color: '#4338ca',
        fontWeight: '500',
    },
    badgesContainer: {
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        padding: 12,
        borderRadius: 12,
    },
    badgeInfo: {
        marginLeft: 12,
        flex: 1,
    },
    badgeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#92400e',
    },
    badgeDesc: {
        fontSize: 14,
        color: '#b45309',
    },
    emptyText: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    logoutButton: {
        margin: 20,
        padding: 16,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#dc2626',
        fontWeight: 'bold',
        fontSize: 16,
    },
    adminButton: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        backgroundColor: '#6366f1',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});
