import { useState, useEffect } from 'react';
import type { CommuteEntry } from '../types';

interface Props {
    onAdd: (commute: Omit<CommuteEntry, 'id'>) => void;
    initialData?: CommuteEntry | null;
    isEditing?: boolean;
    onUpdate?: (id: string, data: Partial<CommuteEntry>) => void;
    onCancel?: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REMINDER_OPTIONS = [5, 10, 15, 30, 60];

export default function CommuteForm({ onAdd, initialData, isEditing, onUpdate, onCancel }: Props) {
    const [name, setName] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [reminderTime, setReminderTime] = useState(5);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDepartureTime(initialData.departureTime);
            setSelectedDays(initialData.activeDays);
            setReminderTime(initialData.reminderTime || 5);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !departureTime || selectedDays.length === 0) return;

        if (isEditing && initialData && onUpdate) {
            onUpdate(initialData.id, {
                name,
                departureTime,
                activeDays: selectedDays,
                reminderTime
            });
        } else {
            onAdd({
                name,
                departureTime,
                activeDays: selectedDays,
                isActive: true,
                reminderTime
            });
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setDepartureTime('');
        setReminderTime(5);
    };

    const toggleDay = (dayIndex: number) => {
        setSelectedDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        );
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '16px' }}>{isEditing ? 'Edit Commute' : 'Add Commute'}</h2>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Route Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Bus to Work"
                    className="input-field"
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Departure Time</label>
                    <input
                        type="time"
                        value={departureTime}
                        onChange={e => setDepartureTime(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Remind Me Before</label>
                    <select
                        value={reminderTime}
                        onChange={e => setReminderTime(Number(e.target.value))}
                        className="input-field"
                        style={{ appearance: 'none' }} // Custom styling for select if needed
                    >
                        {REMINDER_OPTIONS.map(min => (
                            <option key={min} value={min}>{min} minutes</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Active Days</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {DAYS.map((day, index) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(index)}
                            style={{
                                background: selectedDays.includes(index) ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                color: selectedDays.includes(index) ? '#0f172a' : 'var(--text-secondary)',
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    {isEditing ? 'Save Changes' : 'Add Reminder'}
                </button>
                {isEditing && onCancel && (
                    <button type="button" className="btn-danger" onClick={onCancel} style={{ padding: '0 20px', color: 'var(--text-primary)', borderColor: 'var(--text-secondary)' }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
