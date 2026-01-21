import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { userAPI } from '../api/client';

export default function DashboardScreen() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboard = async () => {
        try {
            const response = await userAPI.getDashboard();
            setData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboard();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome Back!</Text>
                <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            </View>

            {/* Notifications */}
            {data?.notifications?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    {data.notifications.map((notif) => (
                        <View key={notif.id} style={styles.notificationCard}>
                            <Text style={styles.notificationText}>{notif.message}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    date: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    time: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '500',
    },
    room: {
        fontSize: 14,
        color: '#64748b',
    },
    deadlineCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    dueDate: {
        fontSize: 14,
        color: '#ef4444',
        marginTop: 4,
    },
    notificationCard: {
        backgroundColor: '#fff1f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#fecdd3',
    },
    notificationText: {
        color: '#be123c',
        fontSize: 14,
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
});
