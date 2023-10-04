import {getAuth, onAuthStateChanged} from "firebase/auth";
import {firebaseApp} from "../firebase.settings";

const auth = getAuth(firebaseApp);

export const onAuthStateChangeListener = (callback) => {
  return onAuthStateChanged(auth, callback)
}