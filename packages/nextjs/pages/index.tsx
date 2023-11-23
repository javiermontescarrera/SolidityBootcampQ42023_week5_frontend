import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useNetwork, useSignMessage } from "wagmi";
import { useContractRead } from "wagmi";
import React from "react";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Team 9 - Lottery</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo></WalletInfo>
      <RandomWord></RandomWord>
    </>
  );
}
function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Connected to the network {chain?.name}</p>
        <Wallet address={address as `0x${string}`}></Wallet>
        <WalletAction></WalletAction>
        {/* <TokenInfo address={address as `0x${string}`}></TokenInfo> */}
        <ApiData address={address as `0x${string}`}></ApiData>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}
function Wallet(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Your account address is </h2>
        <p>{params.address}</p>
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

// function TokenInfo(params: { address: `0x${string}` }) {
//   return (
//     <div className="card w-96 bg-primary text-primary-content mt-4">
//       <div className="card-body">
//         <h2 className="card-title">Testing useContractRead wagmi hook</h2>
//         <TokenName address={params.address}></TokenName>
//         <TokenBalance address={params.address}></TokenBalance>
//       </div>
//     </div>
//   );
// }

// function TokenName(params: { address: `0x${string}` }) {
//   const { data, isError, isLoading } = useContractRead({
//     address: params.address,
//     abi: [
//       {
//         constant: true,
//         inputs: [],
//         name: "name",
//         outputs: [
//           {
//             name: "",
//             type: "string",
//           },
//         ],
//         payable: false,
//         stateMutability: "view",
//         type: "function",
//       },
//     ],
//     functionName: "name",
//   });

//   const name = typeof data === "string" ? data : 0;

//   if (isLoading) return <div>Fetching name…</div>;
//   if (isError) return <div>Error fetching name</div>;
//   return <div>Token name: {name}</div>;
// }

// function TokenBalance(params: { address: `0x${string}` }) {
//   const { data, isError, isLoading } = useContractRead({
//     address: params.address,
//     abi: [
//       {
//         constant: true,
//         inputs: [
//           {
//             name: "_owner",
//             type: "address",
//           },
//         ],
//         name: "balanceOf",
//         outputs: [
//           {
//             name: "balance",
//             type: "uint256",
//           },
//         ],
//         payable: false,
//         stateMutability: "view",
//         type: "function",
//       },
//     ],
//     functionName: "balanceOf",
//     args: [params.address],
//   });

//   const balance = typeof data === "number" ? data : 0;

//   if (isLoading) return <div>Fetching balance…</div>;
//   if (isError) return <div>Error fetching balance</div>;
//   return <div>Balance: {balance}</div>;
// }

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing API Coupling</h2>
      </div>
    </div>
  );
}

function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}

export default Home;
