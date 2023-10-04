import { collection, addDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase.settings";

const db = getFirestore(firebaseApp);

export const addProjectToFirestore = async (projectData) => {
    try {
        const docRef = await addDoc(collection(db, "projects"), projectData);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

