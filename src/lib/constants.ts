// StacksVault Constants
// Contract deployment details and configuration

export const NETWORK_TYPE = process.env.NEXT_PUBLIC_NETWORK || 'testnet';

// Contract addresses — update after deployment
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = 'stacks-vault';

// Stacks API endpoints
export const STACKS_API_URL = NETWORK_TYPE === 'mainnet'
  ? 'https://stacks-node-api.mainnet.stacks.co'
  : 'https://stacks-node-api.testnet.stacks.co';

// Explorer URLs
export const EXPLORER_URL = NETWORK_TYPE === 'mainnet'
  ? 'https://explorer.stacks.co'
  : 'https://explorer.stacks.co/?chain=testnet';

// Minimum deposit (1 STX = 1,000,000 micro-STX)
export const MIN_DEPOSIT_USTX = 1_000_000;
export const STX_DECIMALS = 6;

// Formatting helpers
export const microStxToStx = (microStx: number): number => {
  return microStx / Math.pow(10, STX_DECIMALS);
};

export const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * Math.pow(10, STX_DECIMALS));
};

export const formatStx = (microStx: number): string => {
  return microStxToStx(microStx).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

// Approximate blocks per day on Stacks (Stacks produces ~144 blocks/day)
export const BLOCKS_PER_DAY = 144;

export const daysToBlocks = (days: number): number => {
  return Math.floor(days * BLOCKS_PER_DAY);
};

export const blocksToDays = (blocks: number): number => {
  return Math.round(blocks / BLOCKS_PER_DAY);
};
