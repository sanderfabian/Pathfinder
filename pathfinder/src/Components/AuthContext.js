// Import createContext and useContext from React
import { createContext, useContext, useEffect, useState } from "react";

// Import necessary dependencies from firebase
import { auth, firestore } from "../firebase";
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateEmail, updatePassword, sendEmailVerification } from 'firebase/auth';

// Create a context for user authentication
const UserAuthContext = createContext();

// Define the AuthProvider component
export const UserAuthProvider = ({ children }) => {
    // Define state variables to store user information, loading state, and pathway information
    const [user, setUser] = useState();
    const [moreUserInfo, setMoreUserInfo] = useState();
    const [loading, setLoading] = useState(true); // Include loading state here
    const [hasPathway, setHasPathway] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    

    // Define functions to handle user authentication actions
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        return signOut(auth);
    }

    const sendPwdResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const changeEmail = (email) => {
        return updateEmail(user, email);
    }

    const changePassword = (password) => {
        return updatePassword(user, password);
    }

    const emailVerification = (user) => {
        return sendEmailVerification(user);
    }

   // UseEffect hook to handle authentication state changes
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setLoading(true); // Set loading to true while authentication and data fetching are in progress
        if (currentUser) {
            try {
                setUser(currentUser);
                const userDocRef = doc(firestore, 'User', currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    setMoreUserInfo(userDocSnapshot.data());
                    localStorage.setItem('Username', userDocSnapshot.data().Username);

                    // Check if the user has a pathway
                    const pathwayCollectionRef = collection(firestore, 'User', currentUser.uid, 'Pathway');
                    const pathwaySnapshot = await getDocs(pathwayCollectionRef);

                    setHasPathway(!pathwaySnapshot.empty);

                    // Check if the user is an admin
                    const isAdmin = userDocSnapshot.data().IsAdmin || false; // Default to false if attribute doesn't exist
                    setIsAdmin(isAdmin);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Set loading to false once data fetching is completed
            }
        } else {
            setUser(null);
            setMoreUserInfo(null);
            localStorage.removeItem('UID');
            setHasPathway(false); // Set pathway state to false if user is not logged in
            setIsAdmin(false); // Set isAdmin to false if user is not logged in
            setLoading(false); // Set loading to false if user is not logged in
        }
    });
    return () => unsubscribe();
}, []);

    // Custom method to get loading state
    const getLoading = () => {
        return loading;
    }

    // Provide the user authentication context to the app
    return (
        <UserAuthContext.Provider value={{ createUser, user, moreUserInfo, hasPathway,isAdmin, loading, login, logout,setHasPathway, sendPwdResetEmail, changeEmail, changePassword, emailVerification,createUser, getLoading }}>
            {children}
        </UserAuthContext.Provider>
    );
}

// Custom hook to access user authentication context
export const useUserAuth = () => useContext(UserAuthContext);
