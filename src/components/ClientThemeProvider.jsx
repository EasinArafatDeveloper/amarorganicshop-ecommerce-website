"use client";

import { useEffect } from 'react';

export default function ClientThemeProvider() {
    useEffect(() => {
        const fetchAndApplyColors = async () => {
            try {
                const res = await fetch('/api/public-settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.primaryColor) {
                        document.documentElement.style.setProperty('--brand-primary', data.primaryColor);
                    }
                    if (data.secondaryColor) {
                        document.documentElement.style.setProperty('--brand-secondary', data.secondaryColor);
                    }
                }
            } catch (err) {
                console.error("Failed to load theme settings");
            }
        };

        fetchAndApplyColors();
    }, []);

    return null; // This component handles side effects only
}
