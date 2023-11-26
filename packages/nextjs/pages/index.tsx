import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useNetwork, useSignMessage } from "wagmi";
import { useContractRead } from "wagmi";
import React from "react";

let lotteryStatus = "closed";
let txInProgress = false;

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Team 9 - Lottery</span>
          </h1>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <LotteryStatus></LotteryStatus>
      <WalletInfo></WalletInfo>
      <LotteryAdmin></LotteryAdmin>
      <BetZone></BetZone>
      {/* <RandomWord></RandomWord> */}
    </>
  );
}

function LotteryStatus() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/lottery-status")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading Lottery Status...</p>;
  if (!data) return <p>No lottery information</p>;

  lotteryStatus = data.result.toLowerCase();

  return (
    <div>
      <p>Lottery Status: {data.result}</p>
    </div>
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
        {/* <WalletAction></WalletAction>
        <ApiData address={address as `0x${string}`}></ApiData> */}
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

function LotteryAdmin() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (address)
    return (
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-body">
          <h2 className="card-title">Lottery Admin</h2>
          <OpenBets></OpenBets>
          <CloseLottery></CloseLottery>
          <RefreshButton></RefreshButton>
        </div>
      </div>
    );
}

function OpenBets() {
  const [data, setData] = useState<{ result: boolean }>();
  const [lotteryDuration, setLotteryDuration] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isOpenBetsSuccesfull, setOpenBetsStatus] = useState(false);
  const [hashValue, setHashValue] = useState("");
    
  if (isLoading) return <p>Opening bets...</p>;

  if(lotteryStatus == "closed") {
    if (!data)
      return (
        <div className="flex items-center flex-col flex-grow">
          {/* <h2 className="card-title">Vote</h2> */}
          <p>Open Bets</p>
          <div className="form-control w-full max-w-xs my-4">
            <input
              type="number"
              min="1"
              placeholder="Type here the lottery duration (min)"
              className="input input-bordered w-full max-w-xs"
              value={lotteryDuration}
              onChange={e => setLotteryDuration(e.target.value)}
            />
          </div>
          <button
            className="btn btn-active btn-neutral"
            disabled={isLoading}
            onClick={() => {
              setLoading(true);
              txInProgress = true;
              const objDuration = { duration: ( Number(lotteryDuration) * 60) }
              fetch("http://localhost:3001/open-bets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objDuration),
              })
                .then(res => res.json())
                .then(data => {
                  console.log(`body: ${objDuration}`);
                  setData(data);
                  setLoading(false);
                  if (data.result.success) {
                  setHashValue(data.result.transactionHash);
                  setOpenBetsStatus(true);
                  }
                  txInProgress = false;
                });
            }}
          >
            Open Bets
          </button>
        </div>
      );

    return (
      <div>
        <p>
          {isOpenBetsSuccesfull
            ? "Opening Bets succesfull, transaction hash: " + hashValue
            : "I'm sorry, there was an error."}
        </p>
      </div>
    );
  }
}

function CloseLottery() {
  const [data, setData] = useState<{ result: boolean }>();
  const [isLoading, setLoading] = useState(false);
  const [isCloseLotterySuccesfull, setCloseLotteryStatus] = useState(false);
  const [hashValue, setHashValue] = useState("");

  if (isLoading) return <p>Closing the lottery...</p>;

  if(lotteryStatus != "closed") {
    if (!data)
      return (
        <div className="flex items-center flex-col flex-grow">
          <button
            className="btn btn-active btn-neutral"
            disabled={isLoading}
            onClick={() => {
              setLoading(true);
              txInProgress = true;
              fetch("http://localhost:3001/close-lottery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              })
                .then(res => res.json())
                .then(data => {
                  setData(data);
                  setLoading(false);
                  if (data.result.success) {
                    setHashValue(data.result.transactionHash);
                    setCloseLotteryStatus(true);
                  }
                  txInProgress = false;
                });
            }}
          >
            Close Lottery
          </button>
        </div>
      );
  
    return (
      <div>
        <p>
          {isCloseLotterySuccesfull
            ? "Close Lottery succesfull, transaction hash: " + hashValue
            : "I'm sorry, maybe it's too ealy. Try again later."}
        </p>
      </div>
    );
  }
}

function RefreshButton() {
  return (
    <button 
      className="btn btn-active btn-neutral"
      disabled={txInProgress}
      onClick={() => {
        window.location.reload();
      }}
      >
        Refresh Page
    </button>
  );
}

function BetZone() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (address)
    return (
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-body">
          <h2 className="card-title">Bet Zone</h2>
          <TokenBalance></TokenBalance>
        </div>
      </div>
    );
}

function TokenBalance() {
  const { address } = useAccount();
  const [data, setData] = useState<{ result: boolean }>();
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <div>Fetching token balance…</div>;
  
  if (!data)
    return (
      <div className="flex items-center flex-col flex-grow">
        
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() => {
            setLoading(true);
            fetch("http://localhost:3001/token-balance/" + address, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            })
              .then(res => res.json())
              .then(data => {
                setData(data);
                setLoading(false);
              });
          }}
        >
          Show Token Balance
        </button>
      </div>
    );

  return (
    <div>
      <p>
        {data.result
          ? "Your current token balance is: " + data.result
          : "I'm sorry, ther was an error."}
      </p>
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
