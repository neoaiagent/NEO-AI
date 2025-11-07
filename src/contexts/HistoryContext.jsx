
import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        try {
            const localData = localStorage.getItem('generationHistory');
            const parsedData = localData ? JSON.parse(localData) : [];
            // Revoke old blob URLs to prevent memory leaks
            parsedData.forEach(item => {
                if (item.result?.url?.startsWith('blob:')) {
                    // This is tricky because we can't revoke them on load
                    // as they might be in use. This is a simplified approach.
                    // A better approach would be to revoke them when the component unmounts.
                }
            });
            return parsedData;
        } catch (error) {
            console.error("Error reading history from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Error saving history to localStorage", error);
        }
    }, [history]);

    const addHistoryItem = (item) => {
        setHistory(prevHistory => [item, ...prevHistory]);
    };

    const getHistoryItem = (id) => {
        return history.find(item => item.id === id);
    }

    const value = {
        history,
        addHistoryItem,
        getHistoryItem
    };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
