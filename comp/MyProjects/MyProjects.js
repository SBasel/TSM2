import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { auth } from '../firbase/firebase.settings';
import db from '../firbase/data/firestoreInit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faTrash, faPen, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { saveElapsedTimeToFirestore } from '../firbase/data/SaveElapsedTime';
import { TimeInput } from './TimeInput'
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";


export function MyProjects() {
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTimestamp, setStartTimestamp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timingProjectId, setTimingProjectId] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedTime, setEditedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);



    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const getElapsedTime = () => {
        if (!startTimestamp) return 0;
        return Math.floor((Date.now() - startTimestamp) / 1000); 
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

    const handleStartStop = async (projectIdFromCard) => {
        const projectIdToUse = projectIdFromCard || selectedProject.id;
        

        if (timingProjectId) {
            await stopTimerAndSave(timingProjectId);
            setStartTimestamp(null);
            setTimingProjectId(null);
        } else {
            setStartTimestamp(Date.now());
            setElapsedTime(1);
            setTimingProjectId(projectIdToUse);
        }
    };



    const handleProjectPress = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
};


    const stopTimerAndSave = async (projectId) => {


    setIsLoading(true);
    const elapsed = getElapsedTime();
    await saveElapsedTimeToFirestore(projectId, elapsed);
    
    await fetchProjects(); 

    const updatedProject = projects.find(project => project.id === projectId);
    setSelectedProject(updatedProject);
    
    setElapsedTime(0);
    setIsLoading(false);
};



    const closeModal = () => {
    setModalVisible(false);
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

    const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'green';
        case 'in_progress':
            return 'yellow';
        case 'cancelled':
            return 'red';
        default:
            return 'grey'; // Für unbekannte Statuswerte
    }
};
const openEditModal = (project) => {
        const hours = Math.floor(project.elapsedTime / 3600);
        const minutes = Math.floor((project.elapsedTime % 3600) / 60);
        const seconds = project.elapsedTime % 60;

        setEditedTime({ hours, minutes, seconds });
        setSelectedProject(project);
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
  setIsEditModalVisible(false);
};

const handleSave = async () => {
    // Convert the editedTime back to seconds
    const totalTimeInSeconds = (editedTime.hours * 3600) + (editedTime.minutes * 60) + editedTime.seconds;

    if (!selectedProject) {
        console.error("No project selected.");
        return;
    }

    // Update the elapsedTime for the selected project in Firestore
    const projectRef = doc(db, 'projects', selectedProject.id);
    await updateDoc(projectRef, {
        elapsedTime: totalTimeInSeconds
    });

    closeEditModal();
    fetchProjects(); 
};

const confirmDelete = (projectId) => {
    setProjectToDelete(projectId);
    setIsDeleteModalVisible(true);
};




const deleteFromFirestore = async (projectId) => {
    if (!projectId) return;

    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef); 
      fetchProjects(); 
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
};

    return (
    <View style={styles.container}>
        <Text style={styles.header}>Meine Projekte:</Text>
        <FlatList
            data={projects}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProjectPress(item)}>
                    <View style={styles.projectCard}>
                        <View style={styles.projectCardHeader}>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]}></View>
                            <Text style={styles.projectCardTitle}>{item.projectName}</Text>
                        </View>
                        <View style={styles.projectCardContent}>
                            <Text style={styles.projectCardTime}>Zeit: {formatTime(item.elapsedTime || 0)}</Text>
                            <Text style={styles.projectCardElapsedTime}>
                            {timingProjectId === item.id && formatTime(elapsedTime)}
                        </Text>
                            <View style={styles.projectCardButtons}>
                                <TouchableOpacity onPress={() => handleStartStop(item.id)}>
                                    <FontAwesomeIcon 
                                        icon={timingProjectId === item.id ? faStop : faPlay} 
                                        size={20} 
                                        style={styles.iconButton} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openEditModal(item)}>
                                <FontAwesomeIcon icon={faPen} size={20} style={styles.iconButton} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} size={20} style={styles.iconButton} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
                        onPress={closeModal}>
                        <FontAwesomeIcon icon={faTimes} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Name: {selectedProject.projectName}</Text>
                    <Text style={styles.modalText}>Startdatum: {selectedProject.startDate}</Text>
                    <Text style={styles.modalText}>Enddatum: {selectedProject.endDate}</Text>
                    <Text style={styles.modalText}>Typ: {selectedProject.selectedProjectType}</Text>
                    <Text style={styles.modalText}>Sprachen: {selectedProject.selectedLanguages.join(', ')}</Text>
                    <Text style={styles.elapsedTimeListItem}>Zeit: {formatTime(selectedProject.elapsedTime || 0)}</Text>
                    <Text style={styles.elapsedTimeText}>{formatTime(elapsedTime)}</Text>
                    <TouchableOpacity style={styles.startStopButton} onPress={() => handleStartStop(null)}>
                    <Text>{startTimestamp ? "Stop" : "Start"}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )}
         {selectedProject && (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={closeEditModal}>
      <View style={styles.editModalContainer}>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={closeEditModal}>
            <FontAwesomeIcon icon={faTimes} size={24} />
        </TouchableOpacity>

        <Text>Edit Time</Text>
        <TimeInput
          value={editedTime.hours}
          onChange={(hours) => setEditedTime({ ...editedTime, hours })}
          placeholder="Hours"
        />
        <TimeInput
          value={editedTime.minutes}
          onChange={(minutes) => setEditedTime({ ...editedTime, minutes })}
          placeholder="Minutes"
        />
        <TimeInput
          value={editedTime.seconds}
          onChange={(seconds) => setEditedTime({ ...editedTime, seconds })}
          placeholder="Seconds"
        />
        <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}>
            <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
)}
{projectToDelete && (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View style={styles.confirmDeleteCenteredView}>
            <View style={styles.confirmDeleteModalView}>
                <Text style={styles.confirmDeleteModalText}>Sind Sie sicher, dass Sie das Projekt löschen möchten?</Text>
                <View style={styles.confirmDeleteButtonContainer}>
                    <TouchableOpacity
                        style={styles.confirmDeleteCancelButton}
                        onPress={() => setIsDeleteModalVisible(false)}>
                        <Text>Abbrechen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmDeleteDeleteButton}
                        onPress={() => {
                            deleteFromFirestore(projectToDelete);
                            setIsDeleteModalVisible(false);
                        }}>
                        <Text style={styles.confirmDeleteDeleteText}>Löschen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
)}
    </View>
);}

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
    projectCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        backgroundColor: 'white'
    },
    projectCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    projectCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    projectCardTime: {
        fontSize: 14
    },
    projectCardButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconButton: {
        marginHorizontal: 5,
        color: '#333'
    },
    projectCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
        marginVertical: -5, 
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
    },
    editModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 250, 250, 1)',
    },
    confirmDeleteCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    confirmDeleteModalView: {
        width: '80%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    confirmDeleteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    confirmDeleteCancelButton: {
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },
    confirmDeleteDeleteButton: {
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },
    confirmDeleteDeleteText: {
        color: 'white',
    },
    confirmDeleteModalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
    },
});



