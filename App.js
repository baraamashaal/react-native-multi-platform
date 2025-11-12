/**
 * React Native Web Complex Form Example
 *
 * This application demonstrates the challenges of building
 * complex web forms with React Native Web including:
 * - Multi-step forms with validation
 * - Dependent dropdowns
 * - Save as draft functionality
 * - Data listing with pagination and sorting
 *
 * See comments throughout for specific challenges encountered
 */

import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, Alert, TouchableOpacity, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import JobApplicationForm from './src/components/JobApplicationForm';
import ApplicationsList from './src/components/ApplicationsList';
import ApplicationsListResponsive from './src/components/ApplicationsListResponsive';

export default function App() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editingApplication, setEditingApplication] = useState(null);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [useResponsive, setUseResponsive] = useState(false);

  const handleSubmitApplication = (data) => {
    console.log('Application submitted:', data);

    /**
     * CHALLENGE #11: Alert vs Toast
     * React Native has Alert, but it's not great UX on web
     * We'd want a toast notification library, but most don't work with RN Web
     */
    if (Platform.OS === 'web') {
      alert('Application submitted successfully!');
    } else {
      Alert.alert('Success', 'Application submitted successfully!');
    }

    setView('list');
    setEditingApplication(null);
  };

  const handleSaveDraft = (data) => {
    const draft = {
      ...data,
      id: editingApplication?.id || Date.now(),
      status: 'draft',
      savedAt: new Date().toISOString(),
    };

    setSavedDrafts(prev => {
      const existingIndex = prev.findIndex(d => d.id === draft.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = draft;
        return updated;
      }
      return [...prev, draft];
    });

    console.log('Draft saved:', draft);

    if (Platform.OS === 'web') {
      alert('Draft saved successfully!');
    } else {
      Alert.alert('Success', 'Draft saved successfully!');
    }
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setView('form');
  };

  const handleDeleteApplication = (id) => {
    /**
     * CHALLENGE #12: Confirmation Dialogs
     * Alert.alert with buttons works on mobile but not web
     * Need different approach for each platform
     */
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this application?')) {
        console.log('Deleting application:', id);
        alert('Application deleted');
      }
    } else {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this application?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => console.log('Deleting application:', id)
          }
        ]
      );
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/*
          CHALLENGE #13: Navigation
          React Native uses React Navigation, but we'd use React Router on web
          This creates a disconnect in how navigation works
        */}
        <View style={styles.navigation}>
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navButton, view === 'list' && styles.navButtonActive]}
              onPress={() => setView('list')}
              // CHALLENGE: Can't use proper <button> elements
            >
              <Text style={[
                styles.navButtonText,
                view === 'list' && styles.navButtonTextActive
              ]}>
                Applications List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, view === 'form' && styles.navButtonActive]}
              onPress={() => {
                setEditingApplication(null);
                setView('form');
              }}
            >
              <Text style={[
                styles.navButtonText,
                view === 'form' && styles.navButtonTextActive
              ]}>
                New Application
              </Text>
            </TouchableOpacity>

            {view === 'list' && (
              <TouchableOpacity
                style={[styles.navButton, styles.toggleButton]}
                onPress={() => setUseResponsive(!useResponsive)}
              >
                <Text style={styles.navButtonText}>
                  {useResponsive ? '🔄 Fixed' : '🔄 Responsive'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {view === 'list' ? (
            useResponsive ? (
              <ApplicationsListResponsive
                onEdit={handleEditApplication}
                onDelete={handleDeleteApplication}
              />
            ) : (
              <ApplicationsList
                onEdit={handleEditApplication}
                onDelete={handleDeleteApplication}
              />
            )
          ) : (
            <JobApplicationForm
              onSubmit={handleSubmitApplication}
              onSaveDraft={handleSaveDraft}
              initialData={editingApplication}
            />
          )}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navigation: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 20,
    /**
     * CHALLENGE #14: Shadow/Elevation inconsistencies
     */
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }
    })
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    /**
     * CHALLENGE #15: Hover states
     * No built-in hover support, need to use onMouseEnter/Leave on web
     */
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  navButtonActive: {
    backgroundColor: '#1976d2',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  navButtonTextActive: {
    color: '#fff',
  },
  toggleButton: {
    backgroundColor: '#4caf50',
  },
  content: {
    flex: 1,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
});
