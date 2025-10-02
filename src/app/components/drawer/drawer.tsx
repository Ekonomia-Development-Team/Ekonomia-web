"use client";
import React, { useState } from 'react';
import Button from '../ui/button';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '100%',
                        background: '#fff',
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                        }}
                        onClick={onClose}
                        aria-label="Close drawer"
                    >
                        ×
                    </button>
                    <div style={{ marginTop: 48, padding: 16 }}>{children}</div>
                </div>
            )}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 999,
                    }}
                />
            )}
        </>
    );
};


import { useRouter } from 'next/navigation';

export default function DrawerDemo() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <div>
            <button onClick={() => setOpen(true)}>Open Drawer</button>
            <Drawer isOpen={open} onClose={() => setOpen(false)}>
                <Button onClick={() => router.push('/dashboard')}>Close Drawer</Button>
            </Drawer>
        </div>
    );
}