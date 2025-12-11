import { CpuIcon } from "lucide-react-native";

export const sendNotificationToToken = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: token,
        sound: "default",
        title,
        body,
        data,
      }),
    });

    const result = await res.json();
    console.log("Expo Push response =>", result);

    return result;
  } catch (err) {
    console.log("Erreur envoi notification:", err);
    return null;
  }
};
