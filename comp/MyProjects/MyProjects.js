import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../firbase/firebase.settings';
import db from '../firbase/data/firestoreInit';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { saveElapsedTimeToFirestore } from '../firbase/data/SaveElapsedTime';

export function MyProjects() {
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTimestamp, setStartTimestamp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const getElapsedTime = () => {
        if (!startTimestamp) return 0;
        return Math.floor((Date.now() - startTimestamp) / 1000); // in Sekunden
    };

    const fetchProjects = async () => {
    if (!userId) {
        console.error("User ID not available.");
        return;
    }

    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('userId', '==', userId));
    
    onSnapshot(q, (querySnapshot) => {
        const projectsList = [];
        let updatedProject = null;
        
        querySnapshot.forEach(doc => {
            const project = {
                id: doc.id,
                ...doc.data()
            };
            
            if (project.id === selectedProject?.id) {
                updatedProject = project;
            }
            
            projectsList.push(project);
        });

        setProjects(projectsList);

        // Wenn ein aktualisiertes Projekt gefunden wurde, setzen Sie selectedProject
        if (updatedProject) {
            setSelectedProject(updatedProject);
        }
    });
};


    useEffect(() => {
        if (userId) {
            fetchProjects();
        }
    }, [userId]);

    useEffect(() => {
        let timer;
        if (startTimestamp) {
            timer = setInterval(() => {
                setElapsedTime(getElapsedTime());
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTimestamp]);

    const handleStartStop = async () => {
        if (startTimestamp) {
            await stopTimerAndSave();
            setStartTimestamp(null);
        } else {
            setStartTimestamp(Date.now());
            setElapsedTime(1);
        }
    };

    const handleProjectPress = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
};


    const stopTimerAndSave = async () => {
    setIsLoading(true);
    const elapsed = getElapsedTime();
    await saveElapsedTimeToFirestore(selectedProject.id, elapsed);
    
    await fetchProjects(); // Nach diesem Aufruf ist die projects-Liste aktualisiert

    // Suchen Sie das gerade aktualisierte Projekt in der projects-Liste
    const updatedProject = projects.find(project => project.id === selectedProject.id);

    // Aktualisieren Sie den Wert von selectedProject mit den neuen Daten
    setSelectedProject(updatedProject);
    
    setElapsedTime(0);
    setIsLoading(false);
};

    const closeModalAndReset = async () => {
    setModalVisible(false);
    setStartTimestamp(null); // Stellen Sie sicher, dass dieser Aufruf hier ist
    await stopTimerAndSave();
};


    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meine Projekte:</Text>
            <FlatList
                data={projects}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProjectPress(item)}>
                        <Text style={styles.projectName}>{item.projectName}</Text>
                        <Text style={styles.elapsedTimeListItem}>Zeit: {formatTime(item.elapsedTime || 0)}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedProject && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                        setElapsedTime(0);
                    }}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeModalAndReset}>
                            <FontAwesomeIcon icon={faTimes} size={24} />
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Name: {selectedProject.projectName}</Text>
                        <Text style={styles.modalText}>Startdatum: {selectedProject.startDate}</Text>
                        <Text style={styles.modalText}>Enddatum: {selectedProject.endDate}</Text>
                        <Text style={styles.modalText}>Typ: {selectedProject.selectedProjectType}</Text>
                        <Text style={styles.modalText}>Sprachen: {selectedProject.selectedLanguages.join(', ')}</Text>
                        <Text style={styles.elapsedTimeListItem}>Zeit: {formatTime(selectedProject.elapsedTime || 0)}</Text>
                        <Text style={styles.elapsedTimeText}>{formatTime(elapsedTime)}</Text>
                        <TouchableOpacity style={styles.startStopButton} onPress={handleStartStop}>
                            <Text>{startTimestamp ? "Stop" : "Start"}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    projectName: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 250, 250, 1)',
    },
    modalText: {
        fontSize: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 40, 
        right: 40,
    },
    elapsedTimeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: '3rem'
    },
    startStopButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        marginBottom: 10
    },
    elapsedTimeListItem: {
        fontSize: 14,
        marginLeft: 10,
        color: 'grey'
    }
});
