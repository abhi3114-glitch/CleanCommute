import { useState, useEffect } from 'react';
import type { CommuteEntry, CommuteState } from '../types';

const STORAGE_KEY = 'clean-commute-data';

export const useCommutes = (): CommuteState => {
    const [commutes, setCommutes] = useState<CommuteEntry[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(commutes));
    }, [commutes]);

    const addCommute = (commute: Omit<CommuteEntry, 'id'>) => {
        // Default reminderTime to 5 if not specified (though it should be)
        const newCommute = {
            ...commute,
            id: crypto.randomUUID(),
            reminderTime: commute.reminderTime || 5
        };
        setCommutes(prev => [...prev, newCommute]);
    };

    const updateCommute = (id: string, updated: Partial<CommuteEntry>) => {
        setCommutes(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    };

    const removeCommute = (id: string) => {
        setCommutes(prev => prev.filter(c => c.id !== id));
    };

    const toggleCommute = (id: string) => {
        setCommutes(prev => prev.map(c =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
        ));
    };

    const importData = (data: CommuteEntry[]) => {
        const validData = data.filter(c => c.id && c.name && c.departureTime);
        setCommutes(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const newEntries = validData.filter(c => !existingIds.has(c.id));
            return [...prev, ...newEntries];
        });
    };

    const exportData = () => {
        const dataStr = JSON.stringify(commutes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `commute-schedule-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { commutes, addCommute, removeCommute, toggleCommute, updateCommute, importData, exportData };
};
