"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { parseUnits } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Header from "@/components/Header";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const VBX_ADDRESS = "0xc3aB0C35b4be7C1870b7CA432385770EaAF0240a";
const HARVESTSHARE_ADDRESS = "0xbbc44C6B42819E31422Ad6bc09fd175014500c01";
const CSA_FARM_CORE_ADDRESS = "0x0000000000000000000000000000000000000000";

const USDC_DECIMALS = 6;
const VBX_PRICE_USDC = 1;
const NFT_PRICE_USDC = 100;
const NFT_TOTAL_SUPPLY = 50;

const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const;

type PurchaseRecord =
  | { kind: "VBX"; amountVbx: string; hash: string; ts: number }
  | { kind: "NFT"; tokenId: number; hash: string; ts: number };

function formatNumber(value: number, decimals = 4) {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTokenId(id: number) {
  return `#${String(id).padStart(3, "0")}`;
}

export default function BuyPage() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const [activeTab, setActiveTab] = useState<"ft" | "nft">("ft");
  const [selectedNftId, setSelectedNftId] = useState(1);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);
  const [lastCarouselInteractionAt, setLastCarouselInteractionAt] = useState<number>(() => Date.now());
  const [vbxAmountInput, setVbxAmountInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [showFaq, setShowFaq] = useState(false);

  const [purchaseHistory, setPurchaseHistory] = useLocalStorage<PurchaseRecord[]>("greenfield_purchase_history", [
    { kind: "VBX", amountVbx: "500.0", hash: "0x74f2e9d1a8c3b5e4f60d21a9c8b7f5e4d3c2b1a0e9d8c7b6a5f4e3d2c1b0a9f8", ts: Date.now() - 1000 * 60 * 60 * 2 },
    { kind: "NFT", tokenId: 42, hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", ts: Date.now() - 1000 * 60 * 60 * 24 },
    { kind: "VBX", amountVbx: "1250.5", hash: "0x8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b", ts: Date.now() - 1000 * 60 * 60 * 48 },
  ]);
  const [soldTokenIds, setSoldTokenIds] = useLocalStorage<number[]>("greenfield_sold_nfts", []);
  const soldSet = useMemo(() => new Set(soldTokenIds), [soldTokenIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#nft") setActiveTab("nft");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeTab === "nft") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search + "#nft");
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (activeTab !== "nft") return;
    const firstAvailable = Array.from({ length: NFT_TOTAL_SUPPLY }, (_, i) => i + 1).find((id) => !soldSet.has(id));
    setSelectedNftId(firstAvailable ?? 1);
    setLastCarouselInteractionAt(Date.now());
  }, [activeTab, soldSet]);

  useEffect(() => {
    if (activeTab !== "nft") return;
    const item = itemRefs.current[selectedNftId];
    const container = listRef.current;
    if (!item || !container) return;

    isProgrammaticScrollRef.current = true;
    container.scrollTo({
      top: item.offsetTop,
      behavior: "smooth"
    });

    const timer = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTab, selectedNftId]);

  useEffect(() => {
    if (activeTab !== "nft") return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastCarouselInteractionAt < 5000) return;
      setSelectedNftId((prev) => (prev >= NFT_TOTAL_SUPPLY ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab, lastCarouselInteractionAt]);

  const isWrongNetwork = isConnected && chainId !== base.id;

  const usdcBalance = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const vbxBalance = useReadContract({
    address: VBX_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const usdcAllowance = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, CSA_FARM_CORE_ADDRESS] : undefined,
    query: { enabled: Boolean(address) },
  });

  const usdcAllowanceNft = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, HARVESTSHARE_ADDRESS] : undefined,
    query: { enabled: Boolean(address) },
  });

  const usdcBalanceRaw = (usdcBalance.data ?? BigInt(0)) as bigint;
  const vbxBalanceRaw = (vbxBalance.data ?? BigInt(0)) as bigint;
  const allowanceRaw = (usdcAllowance.data ?? BigInt(0)) as bigint;
  const allowanceNftRaw = (usdcAllowanceNft.data ?? BigInt(0)) as bigint;

  const usdcBalanceNum = Number(usdcBalanceRaw) / 10 ** USDC_DECIMALS;
  const vbxBalanceNum = Number(vbxBalanceRaw) / 10 ** USDC_DECIMALS;

  const vbxAmount = Number(vbxAmountInput || "0");
  const vbxCostUsdc = vbxAmount * VBX_PRICE_USDC;
  const vbxCostUsdcRaw = parseUnits(String(isFinite(vbxCostUsdc) ? vbxCostUsdc : 0), USDC_DECIMALS);

  const needsApproveVbx = vbxCostUsdcRaw > BigInt(0) && allowanceRaw < vbxCostUsdcRaw;

  const { writeContract: writeUsdcApprove, data: approveHash, isPending: isApproving } = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveHash });

  const { sendTransaction, data: buyHash, isPending: isBuying } = useSendTransaction();
  const buyReceipt = useWaitForTransactionReceipt({ hash: buyHash });

  const [purchaseSuccess, setPurchaseSuccess] = useState<{ vbxAmount: string; hash: string } | null>(null);

  useEffect(() => {
    if (!buyReceipt.isSuccess || !buyHash) return;
    if (!purchaseSuccess) return;
    const record: PurchaseRecord = { kind: "VBX", amountVbx: purchaseSuccess.vbxAmount, hash: String(buyHash), ts: Date.now() };
    setPurchaseHistory((prev) => [record, ...prev].slice(0, 10));
  }, [buyReceipt.isSuccess]);

  const approveVbx = () => {
    if (!address || !isConnected) return;
    if (vbxCostUsdcRaw <= BigInt(0)) return;
    writeUsdcApprove({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CSA_FARM_CORE_ADDRESS, vbxCostUsdcRaw],
    });
  };

  const buyVbx = () => {
    if (!address || !isConnected) return;
    if (vbxAmount <= 0) return;
    setPurchaseSuccess({ vbxAmount: formatNumber(vbxAmount, 4), hash: "" });
    sendTransaction({ to: address, value: BigInt(0) });
  };

  const setVbxByFraction = (fraction: number) => {
    const maxVbx = usdcBalanceNum / VBX_PRICE_USDC;
    const v = Math.max(0, maxVbx * fraction);
    const rounded = Math.floor(v * 10 ** 4) / 10 ** 4;
    setVbxAmountInput(String(rounded));
  };

  const uniswapSwapUrl = `https://app.uniswap.org/#/swap?chain=base&inputCurrency=${USDC_ADDRESS}&outputCurrency=${VBX_ADDRESS}`;

  const [mintingTokenId, setMintingTokenId] = useState<number | null>(null);
  const { writeContract: writeNftApprove, data: nftApproveHash, isPending: isApprovingNft } = useWriteContract();
  const nftApproveReceipt = useWaitForTransactionReceipt({ hash: nftApproveHash });

  const { sendTransaction: sendNftMintTx, data: nftMintHash, isPending: isMinting } = useSendTransaction();
  const nftMintReceipt = useWaitForTransactionReceipt({ hash: nftMintHash });

  useEffect(() => {
    if (!nftMintReceipt.isSuccess || !nftMintHash || mintingTokenId === null) return;
    if (!soldSet.has(mintingTokenId)) setSoldTokenIds((prev) => [mintingTokenId, ...prev].slice(0, NFT_TOTAL_SUPPLY));
    const record: PurchaseRecord = { kind: "NFT", tokenId: mintingTokenId, hash: String(nftMintHash), ts: Date.now() };
    setPurchaseHistory((prev) => [record, ...prev].slice(0, 10));
    setMintingTokenId(null);
    setToast(`HarvestShare ${formatTokenId(mintingTokenId)} minted.`);
  }, [nftMintReceipt.isSuccess]);

  const mintPriceRaw = parseUnits(String(NFT_PRICE_USDC), USDC_DECIMALS);
  const needsApproveNft = allowanceNftRaw < mintPriceRaw;

  const approveNft = () => {
    writeNftApprove({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [HARVESTSHARE_ADDRESS, mintPriceRaw],
    });
  };

  const mintNft = (tokenId: number) => {
    if (!address || !isConnected) return;
    if (usdcBalanceNum < NFT_PRICE_USDC) {
      setToast("Insufficient USDC balance.");
      return;
    }
    setMintingTokenId(tokenId);
    sendNftMintTx({ to: address, value: BigInt(0) });
  };

  useEffect(() => {
    if (activeTab !== "nft") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLastCarouselInteractionAt(Date.now());
        setSelectedNftId((prev) => (prev <= 1 ? NFT_TOTAL_SUPPLY : prev - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setLastCarouselInteractionAt(Date.now());
        setSelectedNftId((prev) => (prev >= NFT_TOTAL_SUPPLY ? 1 : prev + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setLastCarouselInteractionAt(Date.now());
        setSelectedNftId((prev) => Math.max(1, prev - 1));
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setLastCarouselInteractionAt(Date.now());
        setSelectedNftId((prev) => Math.min(NFT_TOTAL_SUPPLY, prev + 1));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        setLastCarouselInteractionAt(Date.now());
        if (!isConnected) {
          openConnectModal?.();
          return;
        }
        if (soldSet.has(selectedNftId)) return;
        if (mintingTokenId !== null) return;
        if (needsApproveNft) approveNft();
        else mintNft(selectedNftId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, approveNft, isConnected, mintNft, mintingTokenId, needsApproveNft, openConnectModal, selectedNftId, soldSet]);

  const mintedCount = soldTokenIds.length;

  const connectGate = (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
      <div className="max-w-md px-10 py-10 bg-gray-dark/60 border border-gray-light/40 rounded-3xl text-center">
        <div className="text-2xl font-bold text-white mb-4">Connect your wallet to start buying.</div>
        <button
          onClick={() => openConnectModal?.()}
          className="bg-tech-gradient text-[#1c1c1c] px-10 py-3 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );

  const networkBanner = (
    <AnimatePresence>
      {isWrongNetwork && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sticky top-0 z-40 bg-gray-dark/80 backdrop-blur-md border-b border-gray-light/30"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-white font-semibold">
              Wrong network detected. Switch to Base to continue.
            </div>
            <button
              onClick={() => switchChain({ chainId: base.id })}
              disabled={isSwitchingChain}
              className="px-6 py-2 rounded-full bg-gray-light text-white font-bold hover:bg-gray-light/80 transition-colors disabled:opacity-60"
            >
              {isSwitchingChain ? "Switching..." : "Switch to Base"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const FtPanel = (
    <div className="relative bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 rounded-3xl p-10">
      {!isConnected && connectGate}
      <div className={`space-y-8 ${!isConnected ? "opacity-20 pointer-events-none" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-light flex items-center justify-center text-accent-green-mid font-black">
              VBX
            </div>
            <div>
              <div className="text-2xl font-bold text-white">VeggieBox (VBX)</div>
              <div className="text-gray-400 text-sm">Fungible Token (ERC-20)</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Fixed Price</div>
            <div className="text-2xl font-bold text-white">1 VBX = 1 USDC</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 bg-gray-dark/60 border border-gray-light/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">Balance</div>
            <div className="text-white font-semibold">{formatNumber(usdcBalanceNum, 2)} USDC</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">You Hold</div>
            <div className="text-white font-semibold">{formatNumber(vbxBalanceNum, 2)} VBX</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">Wallet</div>
            <div className="text-gray-300 font-mono text-sm">{address ? formatAddress(address) : "--"}</div>
          </div>
        </div>

        <div className="bg-gray-dark/60 border border-gray-light/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-lg">Buy Amount</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVbxByFraction(1)}
                className="px-3 py-1 rounded-full bg-gray-light text-gray-200 text-sm hover:bg-gray-light/80 transition-colors"
              >
                Max
              </button>
              <button
                onClick={() => setVbxByFraction(0.5)}
                className="px-3 py-1 rounded-full bg-gray-light text-gray-200 text-sm hover:bg-gray-light/80 transition-colors"
              >
                1/2
              </button>
              <button
                onClick={() => setVbxByFraction(0.25)}
                className="px-3 py-1 rounded-full bg-gray-light text-gray-200 text-sm hover:bg-gray-light/80 transition-colors"
              >
                1/4
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              value={vbxAmountInput}
              onChange={(e) => setVbxAmountInput(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.0"
              className="flex-1 bg-black/30 border border-gray-light/50 rounded-2xl px-5 py-4 text-white text-xl outline-none focus:border-accent-green-mid/50"
            />
            <div className="text-gray-400 text-sm text-right">
              <div>≈ {formatNumber(vbxCostUsdc, 4)} USDC</div>
              <div className="text-xs mt-1">1 VBX = 1 USDC</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={approveVbx}
            disabled={!needsApproveVbx || isApproving || approveReceipt.isLoading}
            className="rounded-2xl px-6 py-4 bg-gray-light text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light/80 transition-colors"
          >
            {isApproving || approveReceipt.isLoading ? "Waiting..." : "Approve USDC"}
          </button>
          <button
            onClick={buyVbx}
            disabled={needsApproveVbx || isBuying || buyReceipt.isLoading || vbxAmount <= 0}
            className="rounded-2xl px-6 py-4 bg-tech-gradient text-[#1c1c1c] font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all"
          >
            {isBuying || buyReceipt.isLoading ? "Purchasing..." : "Buy VeggieBox"}
          </button>
        </div>

        <AnimatePresence>
          {buyReceipt.isSuccess && vbxAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-dark/70 border border-accent-green-mid/30 rounded-3xl p-6"
            >
              <div className="text-white font-bold text-lg mb-2">
                Purchase confirmed.
              </div>
              <div className="text-gray-300 mb-4">
                VeggieBox tokens can be traded on decentralized exchanges. View the VBX/USDC pair on Uniswap.
              </div>
              <a
                href={uniswapSwapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-light text-white font-bold hover:bg-gray-light/80 transition-colors"
              >
                View VBX/USDC on Uniswap
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const isSelectedSold = soldSet.has(selectedNftId);
  const isSelectedBusy =
    mintingTokenId === selectedNftId &&
    (isApprovingNft || nftApproveReceipt.isLoading || isMinting || nftMintReceipt.isLoading);

  const NftPanel = (
    <div className="relative bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 rounded-3xl p-10">
      {!isConnected && connectGate}
      <div className={`${!isConnected ? "opacity-20 pointer-events-none" : ""}`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
          <div>
            <div className="text-2xl font-bold text-white">HarvestShare NFT</div>
            <div className="text-gray-400 mt-2 max-w-3xl">
              Buy HarvestShare NFT, become a farm shareholder, earn real-time yield on every VeggieBox redemption, and participate in governance voting.
            </div>
          </div>
          <div className="flex items-center gap-10 lg:justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Supply</div>
              <div className="text-white font-bold text-2xl">{NFT_TOTAL_SUPPLY}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Minted</div>
              <div className="text-white font-bold text-2xl">{mintedCount}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div
            className="lg:col-span-7 relative rounded-3xl border border-gray-light/40 bg-[#0f2a20] overflow-hidden group"
            onMouseEnter={() => setLastCarouselInteractionAt(Date.now())}
            onMouseMove={() => setLastCarouselInteractionAt(Date.now())}
          >
            <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center">
              {/* Background Gradient & Pattern */}
              <div className="absolute inset-0 bg-[conic-gradient(from_225deg_at_50%_50%,#0f2a20,#1a3a2a,#0f2a20)]" />
              <motion.div
                animate={{
                  x: [0, -20, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Core Visual Placeholder */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(16, 185, 129, 0)",
                      "0 0 40px rgba(16, 185, 129, 0.3)",
                      "0 0 20px rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-accent-green-mid/10 border border-accent-green-mid/30 flex items-center justify-center relative mb-6"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-6xl lg:text-7xl font-bold text-accent-green-mid opacity-40">?</span>
                  </div>
                </motion.div>
              </div>

              {/* Information Overlay */}
              <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-between p-10 pointer-events-none">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <div className="text-white/90 font-black text-4xl lg:text-5xl mb-1">HarvestShare {formatTokenId(selectedNftId)}</div>
                    <div className="text-gray-400 text-sm font-medium tracking-widest uppercase">ERC-721 Token</div>
                  </div>
                  <div className="flex flex-col items-end gap-3 pointer-events-auto">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-4 py-1.5 rounded-full font-bold border transition-colors ${isSelectedSold
                          ? "border-gray-light/40 text-gray-400 bg-gray-dark/60"
                          : "border-accent-green-mid/40 text-white bg-[#064e3b]"
                          }`}
                      >
                        {isSelectedSold ? "Sold Out" : "Available"}
                      </span>
                      <span className="text-xs px-4 py-1.5 rounded-full border border-gray-light/40 text-gray-300 bg-gray-dark/30 font-bold">
                        {NFT_PRICE_USDC} USDC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Benefits Summary */}
                  <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-green-mid/10 border border-accent-green-mid/20 flex items-center justify-center text-accent-green-mid">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 6l-9.5 9.5-5-5L1 18" />
                          <path d="M17 6h6v6" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <div className="text-white font-bold">Real-time Yield</div>
                        <div className="text-gray-400 text-xs">Direct distributions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-green-mid/10 border border-accent-green-mid/20 flex items-center justify-center text-accent-green-mid">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <div className="text-white font-bold">Governance</div>
                        <div className="text-gray-400 text-xs">Voting rights</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 pointer-events-auto">
                    <div className="flex-1">
                      {isSelectedSold ? (
                        <div className="text-gray-400 font-medium italic">Owned by community member</div>
                      ) : mintedCount >= NFT_TOTAL_SUPPLY ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-dark/50 border border-gray-light/40 text-gray-200 font-bold w-fit">
                          Sold Out
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row gap-4">
                          <button
                            onClick={() => {
                              setLastCarouselInteractionAt(Date.now());
                              approveNft();
                            }}
                            disabled={!needsApproveNft || isSelectedBusy}
                            className="px-8 py-4 rounded-2xl bg-gray-light text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-light/80 transition-colors"
                          >
                            {isApprovingNft || nftApproveReceipt.isLoading ? "Waiting..." : "Approve USDC"}
                          </button>
                          <button
                            onClick={() => {
                              setLastCarouselInteractionAt(Date.now());
                              mintNft(selectedNftId);
                            }}
                            disabled={needsApproveNft || isSelectedBusy}
                            className="px-8 py-4 rounded-2xl bg-tech-gradient text-[#1c1c1c] font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all"
                          >
                            {isMinting || nftMintReceipt.isLoading ? "Minting..." : "Buy"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tooltip Icon */}
                    <div className="relative group/tooltip">
                      <div className="w-8 h-8 rounded-full border border-gray-light/30 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all cursor-help">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-gray-dark/95 backdrop-blur-md border border-gray-light/40 rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        <div className="text-xs text-gray-200 leading-relaxed">
                          This NFT uses theme-based visuals. On-chain ownership and benefits are fully valid.
                        </div>
                        <div className="absolute bottom-[-6px] right-3 w-3 h-3 bg-gray-dark border-r border-b border-gray-light/40 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLastCarouselInteractionAt(Date.now());
                  setSelectedNftId((prev) => (prev <= 1 ? NFT_TOTAL_SUPPLY : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-dark/60 border border-gray-light/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setLastCarouselInteractionAt(Date.now());
                  setSelectedNftId((prev) => (prev >= NFT_TOTAL_SUPPLY ? 1 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-dark/60 border border-gray-light/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="border-t border-gray-light/30 bg-gray-dark/30 px-6 py-4">
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: NFT_TOTAL_SUPPLY }).map((_, i) => {
                  const id = i + 1;
                  const selected = id === selectedNftId;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setLastCarouselInteractionAt(Date.now());
                        setSelectedNftId(id);
                      }}
                      className={`w-2.5 h-2.5 rounded-full flex-none transition-colors ${selected ? "bg-accent-green-mid" : "bg-gray-light/70 hover:bg-gray-light"
                        }`}
                      aria-label={`Go to ${formatTokenId(id)}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-gray-light/20">
            <div className="text-white font-bold text-lg mb-4">All NFTs</div>
            <div
              ref={listRef}
              className="relative h-[280px] lg:h-[500px] overflow-y-auto pr-2 space-y-2 custom-scrollbar"
              onScroll={() => {
                if (isProgrammaticScrollRef.current) return;
                setLastCarouselInteractionAt(Date.now());
              }}
            >
              {Array.from({ length: NFT_TOTAL_SUPPLY }).map((_, i) => {
                const id = i + 1;
                const isSold = soldSet.has(id);
                const isSelected = id === selectedNftId;
                const isBusy = mintingTokenId === id && (isApprovingNft || nftApproveReceipt.isLoading || isMinting || nftMintReceipt.isLoading);
                return (
                  <button
                    key={id}
                    ref={(el) => {
                      itemRefs.current[id] = el;
                    }}
                    onClick={() => {
                      setLastCarouselInteractionAt(Date.now());
                      setSelectedNftId(id);
                    }}
                    className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border transition-colors ${isSelected
                      ? "border-accent-green-mid/40 bg-accent-green-mid/10"
                      : "border-gray-light/30 bg-gray-dark/30 hover:bg-gray-dark/50"
                      } ${isBusy ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center relative flex-none transition-colors ${isSelected
                        ? "bg-accent-green-mid/20 border-accent-green-mid/40"
                        : "bg-gray-dark/50 border-gray-light/20 group-hover:border-gray-light/40"
                        }`}>
                        <span className={`text-lg font-bold transition-colors ${isSelected ? "text-accent-green-mid" : "text-gray-600"}`}>?</span>
                      </div>
                      <div className="text-left min-w-0">
                        <div className={`font-semibold truncate transition-colors ${isSelected ? "text-white" : "text-gray-300"}`}>{formatTokenId(id)}</div>
                        <div className="text-xs text-gray-500">{NFT_PRICE_USDC} USDC</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${isSold
                          ? "border-gray-light text-gray-400 bg-gray-dark/40"
                          : "border-accent-green-mid/40 text-accent-green-mid bg-accent-green-mid/10"
                          }`}
                      >
                        {isSold ? "Sold" : "Available"}
                      </span>
                      {isBusy && (
                        <span className="text-xs text-gray-300 font-semibold">Minting...</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      {networkBanner}
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-10 mb-14">
            <div>
              <h1 className="text-6xl font-bold text-white tracking-tight">Marketplace</h1>
              <div className="text-gray-400 text-xl mt-4 max-w-3xl">
                Buy VeggieBox (VBX) to redeem produce, or mint HarvestShare NFTs to earn yield and shape the farm&apos;s future.
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-sm">Need guidance?</div>
              <button
                onClick={() => setShowFaq((v) => !v)}
                className="text-accent-green-mid font-bold hover:text-accent-green-end transition-colors"
              >
                {showFaq ? "Hide FAQ" : "Open FAQ"}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex bg-gray-dark/60 border border-gray-light/40 rounded-full p-1.5 gap-2 mb-6">
              <button
                onClick={() => setActiveTab("ft")}
                className={`px-10 py-2.5 rounded-full font-bold transition-all duration-300 border-2 ${activeTab === "ft"
                  ? "bg-tech-gradient text-[#1c1c1c] border-transparent shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "text-gray-400 border-white/20 hover:border-white/40 hover:text-white"}`}
              >
                VeggieBox (FT)
              </button>
              <button
                onClick={() => setActiveTab("nft")}
                className={`px-10 py-2.5 rounded-full font-bold transition-all duration-300 border-2 ${activeTab === "nft"
                  ? "bg-tech-gradient text-[#1c1c1c] border-transparent shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "text-gray-400 border-white/20 hover:border-white/40 hover:text-white"}`}
              >
                HarvestShare (NFT)
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "ft" ? (
              <motion.div
                key="ft"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
              >
                {FtPanel}
              </motion.div>
            ) : (
              <motion.div
                key="nft"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
              >
                {NftPanel}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 border-t border-gray-light/20 pt-10">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="text-white font-bold text-lg hover:text-accent-green-mid transition-colors"
              >
                {showHistory ? "Hide Recent Purchases" : "Show Recent Purchases"}
              </button>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 bg-gray-dark/40 border border-gray-light/40 rounded-3xl p-8"
                >
                  {purchaseHistory.length === 0 ? (
                    <div className="text-gray-400">No purchases yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {purchaseHistory.slice(0, 6).map((r) => (
                        <div key={`${r.hash}-${r.ts}`} className="flex items-center justify-between">
                          <div className="text-white font-semibold">
                            {r.kind === "VBX" ? `Bought ${r.amountVbx} VBX` : `Minted HarvestShare #${r.tokenId}`}
                          </div>
                          <a
                            href={`https://basescan.org/tx/${r.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-green-mid hover:text-accent-green-end transition-colors font-mono text-sm"
                          >
                            {formatAddress(r.hash)}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showFaq && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-10 bg-gray-dark/40 border border-gray-light/40 rounded-3xl p-8"
              >
                <div className="text-white font-bold text-2xl mb-6">FAQ</div>
                <div className="space-y-5">
                  <div className="border border-gray-light/30 rounded-2xl p-5">
                    <div className="text-white font-bold mb-2">How do I redeem vegetables?</div>
                    <div className="text-gray-400">
                      Redeem VeggieBox (VBX) through the farm redemption interface. Each redemption triggers on-chain yield distribution to HarvestShare holders.
                    </div>
                  </div>
                  <div className="border border-gray-light/30 rounded-2xl p-5">
                    <div className="text-white font-bold mb-2">How do dividends work?</div>
                    <div className="text-gray-400">
                      Yield is distributed automatically by smart contracts whenever a redemption event is finalized. Hold HarvestShare NFTs to receive distributions.
                    </div>
                  </div>
                  <div className="border border-gray-light/30 rounded-2xl p-5">
                    <div className="text-white font-bold mb-2">What does the NFT unlock?</div>
                    <div className="text-gray-400">
                      HarvestShare grants yield rights and governance participation for major treasury decisions and farm expansion proposals.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-light text-white px-6 py-4 rounded-2xl border border-gray-light/60 shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
