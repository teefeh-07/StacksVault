'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect, UserData } from '@stacks/connect';

// Types
export interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    userData: UserData | null;
    stxAddress: string | null;
}

interface WalletContextType extends WalletState {
    connect: () => void;
    disconnect: () => void;
    userSession: UserSession;
}

// App configuration for Stacks wallet
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
        userData: null,
        stxAddress: null,
    });

    // Check for existing session on mount
    useEffect(() => {
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
            const stxAddress = network === 'mainnet'
                ? userData.profile?.stxAddress?.mainnet
                : userData.profile?.stxAddress?.testnet;

            setState({
                isConnected: true,
                isConnecting: false,
                userData,
                stxAddress: stxAddress || null,
            });
        }
    }, []);

    // Connect wallet
    const connect = useCallback(() => {
        setState(prev => ({ ...prev, isConnecting: true }));

        showConnect({
            appDetails: {
                name: 'StacksVault',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
            },
            redirectTo: '/',
            onFinish: () => {
                const userData = userSession.loadUserData();
                const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
                const stxAddress = network === 'mainnet'
                    ? userData.profile?.stxAddress?.mainnet
                    : userData.profile?.stxAddress?.testnet;

                setState({
                    isConnected: true,
                    isConnecting: false,
                    userData,
                    stxAddress: stxAddress || null,
                });
            },
            onCancel: () => {
                setState(prev => ({ ...prev, isConnecting: false }));
            },
            userSession,
        });
    }, []);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        userSession.signUserOut();
        setState({
            isConnected: false,
            isConnecting: false,
            userData: null,
            stxAddress: null,
        });
    }, []);

    return (
        <WalletContext.Provider value={{ ...state, connect, disconnect, userSession }}>
            {children}
        </WalletContext.Provider>
    );
}

// Hook for consuming wallet context
export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
