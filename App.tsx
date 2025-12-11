import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from './src/screens/SplashScreen';
import { RootStackParamList } from './src/types/navigation';
import { ConnectionScreen } from './src/screens/LoginPages/ConnectionScreen';
import { WelcomeInfluenceurScreen } from './src/screens/EkanwePages/WelcomeInfluenceurScreen';
import { WelcomeCommercantScreen } from './src/screens/EkanwePages/WelcomeCommercantScreen';
import { CreatorTypeInfluenceurScreen } from './src/screens/EkanwePages/CreatorTypeInfluenceurScreen';
import { ConceptInfluenceurScreen } from './src/screens/EkanwePages/ConceptInfluenceurScreen';
import { LoginOrConnectScreen } from './src/screens/LoginPages/LoginOrConnectScreen';
import { LoginScreen } from './src/screens/LoginPages/LoginScreen';
import { RegisterScreen } from './src/screens/LoginPages/RegisterScreen';
import { ValidateInscriptionScreen } from './src/screens/LoginPages/ValidateInscriptionScreen';
import { RegistrationStepOneScreen } from './src/screens/LoginPages/RegistrationStepOneScreen';
import { InterestStepScreen } from './src/screens/LoginPages/InterestStepScreen';
import { SocialConnectScreen } from './src/screens/LoginPages/SocialConnectScreen';
import { PortfolioStepScreen } from './src/screens/LoginPages/PortfolioStepScreen';
import { RegistrationCompleteScreen } from './src/screens/LoginPages/RegistrationCompleteScreen';
import { DealsInfluenceurScreen } from './src/screens/InfluenceurPages/DealsInfluenceurScreen';
import { SuivisDealsInfluenceurScreen } from './src/screens/InfluenceurPages/SuivisDealsInfluenceurScreen';
import { DiscussionInfluenceurScreen } from './src/screens/InfluenceurPages/DiscussionInfluenceurScreen';
import { SaveDealsInfluenceurScreen } from './src/screens/InfluenceurPages/SaveDealsInfluenceurScreen';
import { ProfileInfluenceurScreen } from './src/screens/InfluenceurPages/ProfileInfluenceurScreen';
//import { ChatInfluenceurScreen } from './src/screens/InfluenceurPages/ChatInfluenceurScreen';
import { DealDetailsInfluenceurScreen } from './src/screens/InfluenceurPages/DealDetailsInfluenceurScreen';
import { DealsSeeMoreInfluenceurScreen } from './src/screens/InfluenceurPages/DealsSeeMoreInfluenceurScreen';
import { ConceptCommercantScreen } from './src/screens/EkanwePages/ConceptCommercantScreen';
import { CreatorCommercantScreen } from './src/screens/EkanwePages/CreatorCommercantScreen';
import { DealsPageCommercantScreen } from './src/screens/CommercantPages/DealsCommercantScreen';
import { ForgotPasswordScreen } from './src/screens/LoginPages/ForgotPasswordScreen';
import { UserProvider } from './src/context/UserContext';
import { DealsCreationScreen } from './src/screens/CommercantPages/DealsCreationScreen';
import { ProfileCommercantScreen } from './src/screens/CommercantPages/ProfileCommercantScreen';
import { SuiviDealsCommercantScreen } from './src/screens/CommercantPages/SuiviDealsCommercantScreen';
import { DiscussionCommercantScreen } from './src/screens/CommercantPages/DiscussionCommercantScreen';
import { DashboardCommercantScreen } from './src/screens/CommercantPages/DashboardCommercantScreen';
import { NotificationInfluenceurScreen } from './src/screens/InfluenceurPages/NotificationInfluenceurScreen';
import { DealsDetailsCommercantScreen } from './src/screens/CommercantPages/DealsDetailsCommercantScreen';
import { NotificationsCommercantScreen } from './src/screens/CommercantPages/NotificationsCommercantScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ReviewCommercantScreen } from './src/screens/CommercantPages/ReviewCommercantScreen';
import { ReviewInfluenceurScreen } from './src/screens/InfluenceurPages/ReviewInfluenceurScreen';
import * as Notifications from 'expo-notifications';
import { ProfilPublicScreen } from './src/screens/CommercantPages/ProfilPublicScreen';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/firebase/firebase';
import { usePushNotifications } from './usePushNotifications';
import { DealsEditScreen } from './src/screens/CommercantPages/DealsEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  useEffect(() => {
    const user = auth.currentUser;
    if (user && expoPushToken) {
      setDoc(doc(db, "users", user.uid), { expoPushToken }, { merge: true });
    }
  }, [expoPushToken]);
  useEffect(() => {
    const handleNotification = (data: any) => {
      const screen = data.screen as keyof RootStackParamList | undefined;

      const params: Record<string, any> = {};
      if (data.dealId) params.dealId = data.dealId;
      if (data.userId) params.userId = data.userId;
      if (data.influenceurId) params.influenceurId = data.influenceurId;
      if (data.chatId) params.chatId = data.chatId;
      if (data.receiverId) params.receiverId = data.receiverId;

      const tryNavigate = () => {
        if (!navigationRef.current?.isReady()) {
          setTimeout(tryNavigate, 50);
          return;
        }

        if (screen) {
          navigationRef.current.navigate(
            screen as never,
            Object.keys(params).length ? (params as never) : undefined
          );
        }
      };

      tryNavigate();
    };

    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        const data = response.notification.request.content.data || {};
        handleNotification(data);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data || {};
        handleNotification(data);
      }
    );

    return () => subscription.remove();
  }, []);


  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Connection" component={ConnectionScreen} />
          <Stack.Screen name="WelcomeInfluenceur" component={WelcomeInfluenceurScreen} />
          <Stack.Screen name="WelcomeCommercant" component={WelcomeCommercantScreen} />
          {/*<Stack.Screen name="App" component={AppNavigator} /> */}
          <Stack.Screen name="CreatorTypeInfluenceur" component={CreatorTypeInfluenceurScreen} />
          <Stack.Screen name="ConceptInfluenceur" component={ConceptInfluenceurScreen} />
          <Stack.Screen name="LoginOrConnect" component={LoginOrConnectScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='ValidateInscription' component={ValidateInscriptionScreen} />
          <Stack.Screen name='RegistrationStepOne' component={RegistrationStepOneScreen} />
          <Stack.Screen name='InterestStep' component={InterestStepScreen} />
          <Stack.Screen name='SocialConnect' component={SocialConnectScreen} />
          <Stack.Screen name='PortfolioStep' component={PortfolioStepScreen} />
          <Stack.Screen name='RegistrationComplete' component={RegistrationCompleteScreen} />
          <Stack.Screen name='DealsInfluenceur' component={DealsInfluenceurScreen} />
          <Stack.Screen name='SuivisDealsInfluenceur' component={SuivisDealsInfluenceurScreen} />
          <Stack.Screen name='DiscussionInfluenceur' component={DiscussionInfluenceurScreen} />
          <Stack.Screen name='SaveDealsInfluenceur' component={SaveDealsInfluenceurScreen} />
          <Stack.Screen name='ProfileInfluenceur' component={ProfileInfluenceurScreen} />
          {/* <Stack.Screen name='ChatInfluenceur' component={ChatInfluenceurScreen} />*/}
          <Stack.Screen name='DealsDetailsInfluenceur' component={DealDetailsInfluenceurScreen} />
          <Stack.Screen name='DealsSeeMoreInfluenceur' component={DealsSeeMoreInfluenceurScreen} />
          <Stack.Screen name='ConceptCommercant' component={ConceptCommercantScreen} />
          <Stack.Screen name='CreatorCommercant' component={CreatorCommercantScreen} />
          <Stack.Screen name='DealsCommercant' component={DealsPageCommercantScreen} />
          <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
          <Stack.Screen name='DealsCreation' component={DealsCreationScreen} />
          <Stack.Screen name='ProfileCommercant' component={ProfileCommercantScreen} />
          <Stack.Screen name='SuiviDealsCommercant' component={SuiviDealsCommercantScreen} />
          <Stack.Screen name='DiscussionCommercant' component={DiscussionCommercantScreen} />
          <Stack.Screen name='DashboardCommercant' component={DashboardCommercantScreen} />
          <Stack.Screen name='NotificationInfluenceur' component={NotificationInfluenceurScreen} />
          <Stack.Screen name='DealsDetailsCommercant' component={DealsDetailsCommercantScreen} />
          <Stack.Screen name='NotificationsCommercant' component={NotificationsCommercantScreen} />
          <Stack.Screen name='ReviewCommercant' component={ReviewCommercantScreen} />
          <Stack.Screen name='ReviewInfluenceur' component={ReviewInfluenceurScreen} />
          <Stack.Screen name='ProfilPublic' component={ProfilPublicScreen} />
          <Stack.Screen name='Chat' component={ChatScreen} />
          <Stack.Screen name="DealsEdit" component={DealsEditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

