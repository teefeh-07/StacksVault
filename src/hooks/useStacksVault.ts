'use client';

import { useCallback } from 'react';
import {
    openContractCall,
    ContractCallOptions,
} from '@stacks/connect';
import {
    uintCV,
    stringAsciiCV,
    principalCV,
    cvToJSON,
    ClarityValue,
} from '@stacks/transactions';
import { useWallet } from '@/context/WalletContext';
import {
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
    STACKS_API_URL,
    stxToMicroStx,
} from '@/lib/constants';

// Types for vault data
export interface VaultData {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: number;
    createdAt: number;
    isCompleted: boolean;
    isWithdrawn: boolean;
    totalDeposits: number;
}

export interface PlatformStats {
    totalVaults: number;
    totalLocked: number;
    totalGoalsCompleted: number;
    totalUsers: number;
}

// Hook for interacting with the StacksVault contract
export function useStacksVault() {
    const { stxAddress, userSession } = useWallet();

    // ============================================================
    // Read-Only Functions (fetch data from blockchain)
    // ============================================================

    // Fetch a specific vault's data
    const getVault = useCallback(async (owner: string, vaultId: number): Promise<VaultData | null> => {
        try {
            const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-vault`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: owner,
                    arguments: [
                        cvToHex(principalCV(owner)),
                        cvToHex(uintCV(vaultId)),
                    ],
                }),
            });

            const data = await response.json();
            if (!data.okay || data.result === '0x09') return null; // none

            const result = cvToJSON(hexToCV(data.result));
            if (result.type === 'none') return null;

            const vault = result.value;
            return {
                name: vault.name.value,
                targetAmount: parseInt(vault['target-amount'].value),
                currentAmount: parseInt(vault['current-amount'].value),
                deadline: parseInt(vault.deadline.value),
                createdAt: parseInt(vault['created-at'].value),
                isCompleted: vault['is-completed'].value,
                isWithdrawn: vault['is-withdrawn'].value,
                totalDeposits: parseInt(vault['total-deposits'].value),
            };
        } catch (error) {
            console.error('Error fetching vault:', error);
            return null;
        }
    }, []);

    // Fetch user's vault count
    const getUserVaultCount = useCallback(async (user: string): Promise<number> => {
        try {
            const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-user-vault-count`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: user,
                    arguments: [cvToHex(principalCV(user))],
                }),
            });

            const data = await response.json();
            if (!data.okay) return 0;

            const result = cvToJSON(hexToCV(data.result));
            return parseInt(result.value);
        } catch (error) {
            console.error('Error fetching vault count:', error);
            return 0;
        }
    }, []);

    // Fetch all vaults for current user
    const getUserVaults = useCallback(async (): Promise<VaultData[]> => {
        if (!stxAddress) return [];

        const count = await getUserVaultCount(stxAddress);
        const vaults: VaultData[] = [];

        for (let i = 0; i < count; i++) {
            const vault = await getVault(stxAddress, i);
            if (vault) vaults.push(vault);
        }

        return vaults;
    }, [stxAddress, getUserVaultCount, getVault]);

    // Fetch platform statistics
    const getPlatformStats = useCallback(async (): Promise<PlatformStats> => {
        try {
            const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-platform-stats`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: CONTRACT_ADDRESS,
                    arguments: [],
                }),
            });

            const data = await response.json();
            if (!data.okay) {
                return { totalVaults: 0, totalLocked: 0, totalGoalsCompleted: 0, totalUsers: 0 };
            }

            const result = cvToJSON(hexToCV(data.result));
            const stats = result.value;
            return {
                totalVaults: parseInt(stats['total-vaults'].value),
                totalLocked: parseInt(stats['total-locked'].value),
                totalGoalsCompleted: parseInt(stats['total-goals-completed'].value),
                totalUsers: parseInt(stats['total-users'].value),
            };
        } catch (error) {
            console.error('Error fetching platform stats:', error);
            return { totalVaults: 0, totalLocked: 0, totalGoalsCompleted: 0, totalUsers: 0 };
        }
    }, []);

    // ============================================================
    // Write Functions (transactions that modify blockchain state)
    // ============================================================

    // Create a new savings vault
    const createVault = useCallback(async (
        name: string,
        targetAmountStx: number,
        deadlineBlocks: number,
    ): Promise<void> => {
        const options: ContractCallOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-vault',
            functionArgs: [
                stringAsciiCV(name),
                uintCV(stxToMicroStx(targetAmountStx)),
                uintCV(deadlineBlocks),
            ],
            appDetails: {
                name: 'StacksVault',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
            },
            onFinish: (data) => {
                console.log('Vault created! TX ID:', data.txId);
            },
        };

        await openContractCall(options);
    }, []);

    // Deposit STX into a vault
    const deposit = useCallback(async (
        vaultId: number,
        amountStx: number,
    ): Promise<void> => {
        const options: ContractCallOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'deposit',
            functionArgs: [
                uintCV(vaultId),
                uintCV(stxToMicroStx(amountStx)),
            ],
            appDetails: {
                name: 'StacksVault',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
            },
            onFinish: (data) => {
                console.log('Deposit successful! TX ID:', data.txId);
            },
        };

        await openContractCall(options);
    }, []);

    // Withdraw from a completed vault
    const withdraw = useCallback(async (vaultId: number): Promise<void> => {
        const options: ContractCallOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'withdraw',
            functionArgs: [uintCV(vaultId)],
            appDetails: {
                name: 'StacksVault',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
            },
            onFinish: (data) => {
                console.log('Withdrawal successful! TX ID:', data.txId);
            },
        };

        await openContractCall(options);
    }, []);

    // Emergency withdraw after deadline
    const emergencyWithdraw = useCallback(async (vaultId: number): Promise<void> => {
        const options: ContractCallOptions = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'emergency-withdraw',
            functionArgs: [uintCV(vaultId)],
            appDetails: {
                name: 'StacksVault',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
            },
            onFinish: (data) => {
                console.log('Emergency withdrawal successful! TX ID:', data.txId);
            },
        };

        await openContractCall(options);
    }, []);

    return {
        getVault,
        getUserVaultCount,
        getUserVaults,
        getPlatformStats,
        createVault,
        deposit,
        withdraw,
        emergencyWithdraw,
    };
}

// ============================================================
// Utility: Hex <-> Clarity Value Conversions
// ============================================================

function cvToHex(cv: ClarityValue): string {
    const { serializeCV } = require('@stacks/transactions');
    const serialized = serializeCV(cv);
    return `0x${Buffer.from(serialized).toString('hex')}`;
}

function hexToCV(hex: string): ClarityValue {
    const { deserializeCV } = require('@stacks/transactions');
    const buffer = Buffer.from(hex.replace('0x', ''), 'hex');
    return deserializeCV(buffer);
}
