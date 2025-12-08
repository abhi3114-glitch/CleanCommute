export interface CommuteEntry {
    id: string;
    name: string;
    departureTime: string; // "HH:MM" 24h format
    activeDays: number[]; // 0=Sunday, 1=Monday, ... 6=Saturday
    isActive: boolean;
    reminderTime: number; // minutes before departure
}


export interface CommuteState {
    commutes: CommuteEntry[];
    addCommute: (commute: Omit<CommuteEntry, 'id'>) => void;
    removeCommute: (id: string) => void;
    toggleCommute: (id: string) => void;
    updateCommute: (id: string, commute: Partial<CommuteEntry>) => void;
    importData: (data: CommuteEntry[]) => void;
    exportData: () => void;
}

