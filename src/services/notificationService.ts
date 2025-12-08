export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

export const sendNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
};

export const calculateTimeRemaining = (departureTime: string): { minutes: number; isToday: boolean } | null => {
    const now = new Date();
    const [hours, minutes] = departureTime.split(':').map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);

    let diff = departure.getTime() - now.getTime();

    if (diff < 0) {
        return null;
    }

    return {
        minutes: Math.floor(diff / 1000 / 60),
        isToday: true
    };
};
