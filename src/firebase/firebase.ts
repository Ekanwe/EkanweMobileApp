import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseSenderId,
  appId: extra.firebaseAppId,
  measurementId: extra.firebaseMeasurementId
};

const app = initializeApp(firebaseConfig);
//const auth = initializeAuth(app, {
//  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//});
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { db, storage, functions, auth };
