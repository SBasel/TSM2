import db from './firestoreInit';
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function saveElapsedTimeToFirestore(projectId, additionalTime) {
    try {
        const projectRef = doc(db, 'projects', projectId);

        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
            const currentElapsedTime = projectSnap.data().elapsedTime || 0;
            
            const newElapsedTime = currentElapsedTime + additionalTime;

            await updateDoc(projectRef, { elapsedTime: newElapsedTime });
        } else {
            console.error(`Project with ID ${projectId} does not exist.`);
        }
    } catch (error) {
        console.error("Error updating elapsed time in Firestore: ", error);
    }
}
