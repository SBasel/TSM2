import {getAuth, signOut} from "firebase/auth";
import {firebaseApp} from "../firebase.settings.js";

const auth = getAuth(firebaseApp);


export const SignOutUser = () => {
  return signOut(auth)
}

