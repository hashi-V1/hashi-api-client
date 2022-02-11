import {
    approveAndLockEthereum,
    setChainSignerEthereum,
} from "./chains/ethereum";
import { approveAndLockTezos, setChainSignerTezos } from "./chains/tezos";
import { Chain } from "./types/chain";
import { Token } from "./types/token";

/**
 * Main class of the Hashi Protocol bridge.
 */
export class HashiBridge {
    /**
     * Map containing instances for each chain.
     */
    private chainsInstances: Map<Chain, any>;

    /**
     * Constructor
     */
    constructor() {
        this.chainsInstances = new Map<Chain, any>();
    }

    /**
     * Saves the signer to use for a chain.
     * @param chain The signer's chain
     * @param signer The corresponding signer
     */
    setChainSigner(chain: Chain, signer: any) {
        switch (chain) {
            case Chain.Tezos:
                this.chainsInstances.set(
                    chain,
                    setChainSignerTezos(chain, signer)
                );
                break;
            case Chain.Ethereum:
                this.chainsInstances.set(
                    chain,
                    setChainSignerEthereum(chain, signer)
                );
                break;
        }
    }

    /**
     * Approves and locks at the same time a token.
     * @param chain The token's current chain.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     */
    approveAndLock(
        chain: Chain,
        token: Token,
        destinationAddress: string
    ): Promise<number | undefined> {
        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(
                "Signer has not been defined for this chain."
            );
        }

        switch (chain) {
            case Chain.Tezos:
                return approveAndLockTezos(
                    chain,
                    token,
                    instance,
                    destinationAddress
                );
            case Chain.Ethereum:
                return approveAndLockEthereum(
                    chain,
                    token,
                    instance,
                    destinationAddress
                );
        }
    }
}
