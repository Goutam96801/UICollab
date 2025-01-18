import React, { useContext, useState } from "react";
import { BadgeCent, CirclePlus, Gift, Send } from "lucide-react";
import { UserContext } from "../../App";

function Store() {
  let {
    userAuth: { access_token, contributor_points },
  } = useContext(UserContext);

  const [state, setState] = useState("redeem");

  return (
    <>
      <div className="bg-gradient-to-b relative from-purple-400/60 h-[calc(100vh-100px)] w-full p-12 flex justify-center flex-col items-center gap-4">
        <p className="absolute top-0 right-12 px-4 py-1.5 rounded-b border-b border-r border-l flex gap-2 border-gray-400/90">
          Your Coins:{" "}
          <p className="flex gap-1 text-teal-500 font-semibold items-center">
            <BadgeCent size={20} />
            {contributor_points}
          </p>
        </p>
        <div className="flex justify-center">
          <BadgeCent size={100} className="text-teal-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 text-5xl">
              UI
            </span>
            Collab <span className="text-gray-400/50 font-semibold">Store</span>
          </h1>
        </div>
        <div>
          <p className="text-base text-center p-4">
            Shop in our store or redeem our products for free by using
            CollabCoins.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-full border-dashed border-gray-300/80 border-[1px] flex gap-1 items-center ${
              state === "redeem" ? "bg-purple-400 text-teal-200" : ""
            }`}
            onClick={() => setState("redeem")}
          >
            <Gift size={20} />
            Redeem
          </button>
          <button
            className={`px-4 py-2 rounded-full border-dashed border-gray-300/80 border-[1px] flex gap-1 items-center ${
              state === "earn" ? "bg-purple-400 text-teal-200" : ""
            }`}
            onClick={() => setState("earn")}
          >
            <CirclePlus size={20} />
            Earn CollabCoin
          </button>
          <button
            className={`px-4 py-2 rounded-full border-dashed border-gray-300/80 border-[1px] flex gap-1 items-center ${
              state === "order" ? "bg-purple-400 text-teal-200" : ""
            }`}
            onClick={() => setState("order")}
          >
            <Send size={20} />
            View Orders
          </button>
        </div>
      </div>
      {state === "redeem" && <div></div>}
      {state === "earn" && <div></div>}
      {state === "order" && <div></div>}
    </>
  );
}

export default Store;
