import { useEffect, useState } from 'react';
import type { CommuteEntry } from '../types';
import { calculateTimeRemaining, sendNotification, requestNotificationPermission } from '../services/notificationService';
import { Trash2, Bell, BellOff, Edit2 } from 'lucide-react';

interface Props {
    commutes: CommuteEntry[];
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
    onEdit: (entry: CommuteEntry) => void;
}

export default function CommuteList({ commutes, onRemove, onToggle, onEdit }: Props) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Check for notifications
    useEffect(() => {
        if (Notification.permission !== "granted") {
            requestNotificationPermission();
        }

        commutes.forEach(commute => {
            if (!commute.isActive) return;
            const todayDay = new Date().getDay();
            if (!commute.activeDays.includes(todayDay)) return;

            const remaining = calculateTimeRemaining(commute.departureTime);
            const notifyTime = commute.reminderTime || 5;

            if (remaining && remaining.isToday && remaining.minutes === notifyTime) {
                if (new Date().getSeconds() < 10) {
                    sendNotification("Time to leave!", `Your ${commute.name} leaves in ${notifyTime} minutes!`);
                }
            }
        });
    }, [now, commutes]);

    const sortedCommutes = [...commutes].sort((a, b) => {
        // Sort by time
        return a.departureTime.localeCompare(b.departureTime);
    });

    // Identify Next Up
    const nextUpId = sortedCommutes.find(c => {
        const remaining = calculateTimeRemaining(c.departureTime);
        const isToday = c.activeDays.includes(new Date().getDay());
        return isToday && c.isActive && remaining && remaining.isToday;
    })?.id;


    if (commutes.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No commutes added yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedCommutes.map(commute => {
                const remaining = calculateTimeRemaining(commute.departureTime);
                const todayDay = new Date().getDay();
                const isActiveToday = commute.activeDays.includes(todayDay);
                const isNextUp = commute.id === nextUpId;

                // Format countdown
                let countdownText = "Not scheduled for today";
                let isUrgent = false;

                if (isActiveToday && remaining) {
                    if (remaining.isToday) {
                        const hours = Math.floor(remaining.minutes / 60);
                        const minutes = remaining.minutes % 60;
                        countdownText = `Leaves in ${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
                        isUrgent = remaining.minutes <= (commute.reminderTime || 15);
                    }
                } else if (isActiveToday && !remaining) {
                    countdownText = "Departed";
                }

                return (
                    <div
                        key={commute.id}
                        className="glass-panel"
                        style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: isNextUp ? '1px solid var(--primary-color)' : 'var(--surface-border)',
                            boxShadow: isNextUp ? 'var(--primary-glow)' : 'none',
                            transform: isNextUp ? 'scale(1.02)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: isNextUp ? '1.5rem' : '1.25rem' }}>{commute.name}</h3>
                                <span style={{
                                    fontSize: '0.8rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {commute.departureTime}
                                </span>
                                {isNextUp && <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase' }}>Next Up</span>}
                            </div>
                            <div style={{
                                color: isUrgent ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: isUrgent ? 700 : 400,
                                fontSize: isNextUp ? '1.1rem' : '1rem'
                            }}>
                                {countdownText}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => onEdit(commute)}
                                className="btn-danger"
                                style={{ color: 'var(--text-primary)', borderColor: 'transparent', padding: '8px' }}
                                title="Edit"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => onToggle(commute.id)}
                                style={{ color: commute.isActive ? 'var(--success-color)' : 'var(--text-secondary)' }}
                                title={commute.isActive ? "Notifications Active" : "Notifications Paused"}
                            >
                                {commute.isActive ? <Bell size={20} /> : <BellOff size={20} />}
                            </button>
                            <button
                                onClick={() => onRemove(commute.id)}
                                className="btn-danger"
                                style={{ padding: '8px', border: 'none' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
