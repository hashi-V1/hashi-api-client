import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { hasOwnProperty } from "./utils";

function App() {
    const [error, setError] = useState<string[]>([]);
    const [ethAddress, setEthAddress] = useState("");
    const [tezAddress, setTezAddress] = useState("");

    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");

    useEffect(() => {
        const options = {
            name: "Hashi Example app",
            preferredNetwork: NetworkType.HANGZHOUNET,
        };
        const wallet = new BeaconWallet(options);

        if (typeof wallet.client.getActiveAccount() === "undefined") {
            wallet
                .requestPermissions({
                    network: {
                        type: NetworkType.HANGZHOUNET,
                    },
                })
                .then(() => wallet.getPKH().then(setTezAddress));
        } else {
            wallet.getPKH().then(setTezAddress);
        }
    }, []);

    useEffect(() => {
        if (
            !hasOwnProperty(window, "ethereum") ||
            !(window.ethereum as ethers.providers.ExternalProvider)
        ) {
            setError((err) =>
                err.concat(["Please install the Metamask browser extension"])
            );
            return;
        }

        let signer: Signer;
        const provider = new ethers.providers.Web3Provider(
            window.ethereum as ethers.providers.ExternalProvider
        );
        provider
            .send("eth_requestAccounts", [3])
            .then(() => {
                signer = provider.getSigner();
                return signer.getAddress();
            })
            .then(setEthAddress);
    }, []);

    return (
        <div className="main-div">
            {error.length > 0 && (
                <div className="errors">
                    {error.map((err) => (
                        <p>{error}</p>
                    ))}
                </div>
            )}

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
                        onChange={(event) => setTokenId(event.target.value)}
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
                <button>Bridge to Tezos</button>
                <button>Bridge to Ethereum</button>
            </div>
        </div>
    );
}

export default App;
