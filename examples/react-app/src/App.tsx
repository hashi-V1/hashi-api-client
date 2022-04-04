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

        (async () => {
            const options = {
                name: "Hashi Example app",
                preferredNetwork: NetworkType.HANGZHOUNET,
            };
            const wallet = new BeaconWallet(options);

            if (!(await wallet.client.getActiveAccount())) {
                await wallet.requestPermissions({
                    network: {
                        type: NetworkType.HANGZHOUNET,
                    },
                });
            }

            hashi.setChainSigner(Chain.Hangzhounet, wallet);
            setTezAddress(await wallet.getPKH());
        })();
    }, [tezAddress]);

    useEffect(() => {
        if (ethAddress) return;
        if (
            !hasOwnProperty(window, "ethereum") ||
            !(window.ethereum as ethers.providers.ExternalProvider)
        ) {
            alert("Please install the Metamask browser extension");
            return;
        }

        (async () => {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum as ethers.providers.ExternalProvider
            );
            await provider.send("eth_requestAccounts", [3]);

            const signer = provider.getSigner();
            hashi.setChainSigner(Chain.Ropsten, signer);

            setEthAddress(await signer.getAddress());
        })();
    });

    const bridge = useCallback(() => {
        if (typeof selectedToken === "undefined") {
            alert("Please select a token");
            return;
        }

        const target =
            selectedToken.chain === Chain.Hangzhounet
                ? Chain.Ropsten
                : Chain.Hangzhounet;

        hashi
            .bridge(target, selectedToken, destinationAddress, (p) =>
                setProgress(progressConstants[p])
            )
            .then(
                (t) => `(${t.newToken.tokenContract} - ${t.newToken.tokenId})`
            )
            .then(setWrappedText)
            .catch(alert);
    }, [selectedToken, destinationAddress]);

    const unbridge = useCallback(() => {
        if (typeof selectedToken === "undefined") {
            alert("Please select a token");
            return;
        }

        const target =
            selectedToken.chain === Chain.Hangzhounet
                ? Chain.Ropsten
                : Chain.Hangzhounet;

        hashi
            .unbridge(target, selectedToken, destinationAddress, (p) =>
                setProgress(progressConstants[p])
            )
            .catch(alert);
    }, [selectedToken, destinationAddress]);

    const refreshTokens = useCallback(async () => {
        let tokens: Token[] = [];

        if (tezAddress) {
            tokens = tokens.concat(
                await hashi.getTokensForAccount(Chain.Hangzhounet, tezAddress)
            );
        }

        if (ethAddress) {
            tokens = tokens.concat(
                await hashi.getTokensForAccount(Chain.Ropsten, ethAddress)
            );
        }

        setIndexedTokens(tokens);
    }, [tezAddress, ethAddress]);
    useEffect(() => {
        refreshTokens();
    }, [refreshTokens]);

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

                <button onClick={unbridge}>
                    Unbridge{" "}
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
                                selectedToken?.uid === token.uid
                                    ? "selected"
                                    : "",
                            ].join(" ")}
                            key={`${token.uid}`}
                        >
                            <img src={token.imageUrl ?? "/token.png"} alt="" />
                            <h4>
                                {token.name ?? token.uid}{" "}
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
