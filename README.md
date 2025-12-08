# CleanCommute

Bus/Train Reminder App - Never miss your daily commute again.

## Features

- **Route Management**: Add multiple commute routes with custom names.
- **Schedule**: Set departure times and active days (e.g., Mon-Fri).
- **Custom Reminders**: Choose to be reminded 5, 10, 15, 30, or 60 minutes before departure.
- **Countdown**: Real-time countdown timer to your next departure.
- **Next Up**: Visual highlighting for your immediate next commute.
- **Offline First**: All data is stored locally on your device. Works without internet.
- **Installable (PWA)**: Can be installed on mobile devices for a native app-like experience.
- **Data Portability**: Export your schedule to JSON and import it on other devices.

## Tech Stack

- React
- TypeScript
- Vite
- LocalStorage
- Notification API
- Vanilla CSS with Glassmorphism design

## Setup to Run Locally

1. Clone the repository.
   
2. Install dependencies.
   ```bash
   npm install
   ```
   
3. Run the development server.
   ```bash
   npm run dev
   ```
   
4. Build for production.
   ```bash
   npm run build
   ```

## Usage

1. **Add Commute**: Click "Add New Commute", enter the route name, departure time, reminder preference, and select active days.
2. **Edit**: Click the edit icon to modify any existing commute.
3. **Permissions**: Allow Notifications when prompted to receive arrival alerts.
4. **Import/Export**: Use the cloud download/upload icons to backup or transfer your schedule.

## License

MIT
