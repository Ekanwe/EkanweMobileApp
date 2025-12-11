import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
}

export const usePushNotifications = (): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true, shouldShowBanner: true, shouldShowList: true, shouldShowAlert: true, shouldSetBadge: true,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    async function registerForPushNotificationsAsync(): Promise<string | undefined> {
        try {
            if (!Device.isDevice) {
                return undefined;
            }
            const perm = await Notifications.getPermissionsAsync();
            
            let finalStatus = perm.status;
            if (perm.status !== "granted") {
                const request = await Notifications.requestPermissionsAsync();
                finalStatus = request.status;
            }
            if (finalStatus !== "granted") {
                return undefined;
            }
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            const tokenObj = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : {});
            const token = (tokenObj as any)?.data ?? tokenObj;
            
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                });
            }

            return typeof token === "string" ? token : undefined;
        } catch (err) {
            return undefined;
        }
    }

    useEffect(() => {
        let mounted = true;
        registerForPushNotificationsAsync()
            .then((token) => {
                if (!mounted) return;
                console.log("registerForPushNotificationsAsync.then token ->", token);
                if (token) setExpoPushToken(token);
            })
            .catch((e) => {
                console.error("registerForPushNotificationsAsync promise error ->", e);
            });

        notificationListener.current = Notifications.addNotificationReceivedListener((n) => {
            setNotification(n);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((r) => {
            console.log("notification response ->", r);
        });

        return () => {
            mounted = false;
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return { expoPushToken, notification };
};
