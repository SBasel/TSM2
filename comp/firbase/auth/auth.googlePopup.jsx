import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase.settings.js";


const provider = new GoogleAuthProvider();

// Sorgt dafür, dass der User einen Google Account auswählen muss
provider.setCustomParameters({
  prompt: "select_account"
});

export const SignInWithGooglePopup = async (navigation) => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in was successful:", result);
    navigation.navigate('UserArea', { screen: 'TSM2.0' });
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

