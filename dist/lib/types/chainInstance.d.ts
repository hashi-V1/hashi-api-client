/**
 * Represents the information needed for each chain
 * Instance is the instance that will enable hashi to contact the chain
 * Address is the address of the signer (public key) it should be allowed to transfer the token
 */
export declare type ChainInstance = {
    instance: any;
    address: string;
};
