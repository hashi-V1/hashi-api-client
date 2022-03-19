import { Chain } from "./types/chain";
import { Token } from "./types/token";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
    rpc: string;
    lockerContract: string;
    wrapperContract: string;
    indexerUrl?: string;
};

/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
export const chainConfig: { [key in Chain]: ChainConfigType } = {
    [Chain.Tezos]: {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1S1W5GtQqUYXGYoLEX4NvKvCiqquKvSrjY",
        wrapperContract: "KT1Kxv27kcQ2C1ieEm87TsyK3KV2oUQ44btn",
        indexerUrl: "https://api.hangzhou2net.tzkt.io/v1/tokens/balances",
    },
    [Chain.Ethereum]: {
        rpc: "",
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
        wrapperContract: "0x43a31963eb24ef0cf9d35e2ba463589ff6f9efc4",
    },
};

/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
export const nodesConfig: string[] = [
    "http://localhost:3030/proof",
    "http://localhost:3030/proof",
];

export const ipfsNodes: string[] = [
    "https://ipfs.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
];

export function getUrlFromIpfs(ipfsUrl: string) {
    const node = ipfsNodes[Math.round(Math.random() * (ipfsNodes.length - 1))];
    return `${node}${ipfsUrl.replace("ipfs://", "")}`;
}

export function isTokenWrapped(token: Token, chain: Chain) {
    return chainConfig[chain].wrapperContract === token.tokenContract;
}
