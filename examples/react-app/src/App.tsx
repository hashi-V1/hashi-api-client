import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ethers } from "ethers";
import { Chain, HashiBridge, progressConstants, Token } from "hashi-api-client";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { hasOwnProperty } from "./utils";

const hashi = new HashiBridge();

function App() {
    const [ethAddress, setEthAddress] = useState("");
    const [tezAddress, setTezAddress] = useState("");

    const [indexedTokens, setIndexedTokens] = useState<Token[]>([]);
    const [selectedToken, setSelectedToken] = useState<Token | undefined>();

    const [destinationAddress, setDestinationAddress] = useState("");
    const [progress, setProgress] = useState(
        "Please select a token and a destination address"
    );
    const [wrappedText, setWrappedText] = useState("");

    useEffect(() => {
        if (tezAddress !== "") return;
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
    });

    useEffect(() => {
        if (ethAddress) return;
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
    });

    const bridge = useCallback(() => {
        if (typeof selectedToken === "undefined") return;

        const target =
            selectedToken.chain === Chain.Tezos ? Chain.Ethereum : Chain.Tezos;

        hashi
            .bridge(target, selectedToken, destinationAddress, (p) =>
                setProgress(progressConstants[p])
            )
            .then((wrapped) =>
                setWrappedText(
                    `(${wrapped.tokenContract} - ${wrapped.tokenId})`
                )
            )
            .catch(alert);
    }, [selectedToken, destinationAddress]);

    const refreshTokens = useCallback(() => {
        if (tezAddress === "") return;
        hashi
            .getTokensForAccount(Chain.Tezos, tezAddress)
            .then(setIndexedTokens);
    }, [tezAddress]);
    useEffect(refreshTokens, [refreshTokens]);

    return (
        <div className="main-div">
            <section>
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
            </section>

            <section>
                <input
                    type="text"
                    className="destinationInput"
                    onChange={(event) =>
                        setDestinationAddress(event.target.value)
                    }
                    placeholder="Destination address"
                />

                <button onClick={bridge}>
                    Bridge{" "}
                    {selectedToken && selectedToken.name
                        ? selectedToken.name
                        : "token"}
                </button>
                <button onClick={refreshTokens}>Refresh tokens</button>
            </section>

            {(progress || wrappedText) && (
                <section>
                    <p>
                        {progress} {wrappedText}
                    </p>
                </section>
            )}

            <section>
                <div className="tokenlist">
                    {indexedTokens.map((token) => (
                        <button
                            onClick={() => setSelectedToken(token)}
                            className={[
                                "token",
                                selectedToken === token ? "selected" : "",
                            ].join(" ")}
                            key={`${token.uid}`}
                        >
                            <img src={token.imageUrl ?? "/token.png"} alt="" />
                            <h4>
                                {token.name ?? token.uid}
                                {token.symbol ? `(${token.symbol})` : ""}
                            </h4>

                            <p>{token.description}</p>

                            <h3>{token.wrapped ? "WRAPPED" : ""}</h3>
                            <h2>{token.chain}</h2>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default App;
