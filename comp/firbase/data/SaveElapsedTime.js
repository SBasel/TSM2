import db from './firestoreInit';
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function saveElapsedTimeToFirestore(projectId, additionalTime) {
    const projectRef = doc(db, 'projects', projectId);

    // Holen Sie die aktuelle verstrichene Zeit des Projekts aus der Datenbank
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
        const currentElapsedTime = projectSnap.data().elapsedTime || 0;
        
        // Addieren Sie die aktuelle verstrichene Zeit zur zusätzlichen Zeit
        const newElapsedTime = currentElapsedTime + additionalTime;

        // Aktualisieren Sie das Dokument mit der neuen verstrichenen Zeit
        await updateDoc(projectRef, { elapsedTime: newElapsedTime });
    } else {
        console.error(`Project with ID ${projectId} does not exist.`);
    }
}