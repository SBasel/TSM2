import { firebaseApp } from "../firebase.settings.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

export const createNewUserWithEmailAndPassword = (email, password) => {
  try {
    return createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error);
  }
};

export const signInThisUserWithEmailAndPassword = (email, password) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error);
  }
};
