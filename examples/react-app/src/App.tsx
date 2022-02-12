import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ethers } from "ethers";
import {
    Chain,
    HashiBridge,
    Progress,
    progressConstants,
    tokenFromAddressAndId,
} from "hashi-api-client";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { hasOwnProperty } from "./utils";

const hashi = new HashiBridge();

function App() {
    const [ethAddress, setEthAddress] = useState("");
    const [tezAddress, setTezAddress] = useState("");

    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenId, setTokenId] = useState(0);
    const [destinationAddress, setDestinationAddress] = useState("");
    const [progress, setProgress] = useState("");

    useEffect(() => {
        const options = {
            name: "Hashi Example app",
            preferredNetwork: NetworkType.HANGZHOUNET,
        };
        const wallet = new BeaconWallet(options);

        (typeof wallet.client.getActiveAccount() === "undefined"
            ? wallet.requestPermissions({
                  network: {
                      type: NetworkType.HANGZHOUNET,
                  },
              })
            : Promise.resolve()
        )
            .then(() => wallet.getPKH())
            .then((pkh) => {
                setTezAddress(pkh);
                hashi.setChainSigner(Chain.Tezos, wallet);
            });
    }, []);

    useEffect(() => {
        if (
            !hasOwnProperty(window, "ethereum") ||
            !(window.ethereum as ethers.providers.ExternalProvider)
        ) {
            alert("Please install the Metamask browser extension");
            return;
        }

        const provider = new ethers.providers.Web3Provider(
            window.ethereum as ethers.providers.ExternalProvider
        );
        provider.send("eth_requestAccounts", [3]).then(async () => {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setEthAddress(address);
            hashi.setChainSigner(Chain.Ethereum, signer);
        });
    }, []);

    const bridgeToChain = useCallback(
        (source: Chain, target: Chain) => {
            try {
                // tokenFromAddressAndId throws if any of its parameters is not valid.
                const token = tokenFromAddressAndId(
                    tokenAddress,
                    tokenId,
                    source
                );

                hashi
                    .bridge(
                        source,
                        target,
                        token,
                        destinationAddress,
                        (p: Progress) => setProgress(progressConstants[p])
                    )
                    .then(console.log)
                    .catch(alert);
            } catch (e) {
                alert(e);
            }
        },
        [tokenAddress, tokenId, destinationAddress]
    );

    return (
        <div className="main-div">
            <div>
                {ethAddress !== "" ? (
                    <span>Connected ({ethAddress})</span>
                ) : (
                    <span>Please connect Metamask</span>
                )}
                {tezAddress !== "" ? (
                    <span>Connected ({tezAddress})</span>
                ) : (
                    <span>Please connect Temple</span>
                )}
            </div>

            <div>
                <label htmlFor="token_address">
                    Token address
                    <input
                        id="token_address"
                        value={tokenAddress}
                        onChange={(event) =>
                            setTokenAddress(event.target.value)
                        }
                    />
                </label>
                <label htmlFor="token_id">
                    Token id
                    <input
                        id="token_id"
                        type="number"
                        value={tokenId}
                        onChange={(event) =>
                            setTokenId(parseInt(event.target.value))
                        }
                    />
                </label>
                <label htmlFor="destination_address">
                    Destination address
                    <input
                        id="destination_address"
                        value={destinationAddress}
                        onChange={(event) =>
                            setDestinationAddress(event.target.value)
                        }
                    />
                </label>
            </div>

            <div>
                <button
                    onClick={() => bridgeToChain(Chain.Ethereum, Chain.Tezos)}
                >
                    Bridge to Tezos
                </button>
                <button
                    onClick={() => bridgeToChain(Chain.Tezos, Chain.Ethereum)}
                >
                    Bridge to Ethereum
                </button>
            </div>

            <div>{progress}</div>
        </div>
    );
}

export default App;
