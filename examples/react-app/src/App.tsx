import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { ethers } from "ethers";
import { Chain, HashiBridge } from "hashi-api-client";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { hasOwnProperty } from "./utils";

const hashi = new HashiBridge();

function App() {
    const [errors, setErrors] = useState<string[]>([]);
    const [ethAddress, setEthAddress] = useState("");
    const [tezAddress, setTezAddress] = useState("");

    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenId, setTokenId] = useState(0);
    const [destinationAddress, setDestinationAddress] = useState("");

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
            setErrors((err) =>
                err.concat(["Please install the Metamask browser extension"])
            );
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
            /*hashi
                .approveAndLock(
                    source,
                    tokenFromAddressAndId(tokenAddress, tokenId, source),
                    destinationAddress
                )
                .then((ok) => alert(ok))
                .catch((reason) => {
                    console.log(reason);
                });*/
            /*hashi
                .wrapToken(
                    target,
                    {
                        status: Status.Locked,
                        destination: "",
                        metadata: "",
                        tokenContract: "345675f432",
                        tokenId: 44,
                        timestamp: 3456345,
                    },
                    []
                )
                .then(console.log)
                .catch(console.log);*/
            /*hashi
                .proveTokenStatus(
                    Chain.Tezos,
                    Chain.Ethereum,
                    {
                        tokenId: 2,
                        tokenContract: "GRYHYGERGDSFGEZ",
                        timestamp: 345678543,
                    },
                    Status.Locked
                )
                .then(console.log);*/
            /*hashi
                .burnToken(
                    source,
                    {
                        tokenContract: "345675432",
                        tokenId: 44,
                        timestamp: 3456345,
                    },
                    "4567685432"
                )
                .then(() => console.log("done"))
                .catch(console.log);*/
        },
        [tokenAddress, tokenId, destinationAddress]
    );

    return (
        <div className="main-div">
            {errors.length > 0 && (
                <div className="errors">
                    {errors.map((err) => (
                        <p key={err}>{err}</p>
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
        </div>
    );
}

export default App;
