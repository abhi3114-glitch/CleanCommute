import { useState, useRef } from 'react';
import CommuteForm from './components/CommuteForm';
import CommuteList from './components/CommuteList';
import { useCommutes } from './hooks/useCommutes';
import type { CommuteEntry } from './types';
import { Download, Plus, X, Upload } from 'lucide-react';

function App() {
    const { commutes, addCommute, removeCommute, toggleCommute, updateCommute, importData, exportData } = useCommutes();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEdit = (entry: CommuteEntry) => {
        setEditingId(entry.id);
        setShowForm(true);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (Array.isArray(data)) {
                    importData(data);
                    alert('Schedule imported successfully!');
                }
            } catch (err) {
                alert('Failed to import file. Invalid JSON.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        CleanCommute
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Never miss your bus again.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleImport}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Import Schedule"
                    >
                        <Upload size={20} />
                    </button>
                    <button
                        onClick={exportData}
                        style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Export Schedule"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </header>

            <main>
                {showForm ? (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <CommuteForm
                            onAdd={(c) => { addCommute(c); setShowForm(false); }}
                            isEditing={!!editingId}
                            initialData={editingId ? commutes.find(c => c.id === editingId) : null}
                            onUpdate={(id, data) => { updateCommute(id, data); setShowForm(false); setEditingId(null); }}
                            onCancel={() => { setShowForm(false); setEditingId(null); }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); }}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: 'var(--primary-color)',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        <Plus size={20} /> Add New Commute
                    </button>
                )}

                <CommuteList
                    commutes={commutes}
                    onRemove={removeCommute}
                    onToggle={toggleCommute}
                    onEdit={handleEdit}
                />
            </main>
        </div>
    );
}

export default App;
