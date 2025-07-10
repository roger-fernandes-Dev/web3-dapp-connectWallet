'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function SendEth() {
  const [walletAddress, setWalletAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask não encontrada.");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts[0]);
  }

  useEffect(() => {
    connectWallet();
  }, []);

  async function sendTransaction() {
    if (!window.ethereum) {
      alert("MetaMask não encontrada.");
      return;
    }
    if (!ethers.isAddress(toAddress)) {
      alert("Endereço inválido.");
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Valor inválido.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setStatus("Enviando a transação...");

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });

      setStatus("Transação enviada! Aguardando confirmação...");
      await tx.wait();

      setStatus(`✅ Transação confirmada! Hash: ${tx.hash}`);
    } catch (err: any) {
      console.error("Erro ao enviar:", err);
      setStatus("❌ Erro ao enviar a transação");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Enviar ETH</h2>

      {/* Mostra seu próprio endereço (remetente) */}
      <input
        type="text"
        value={walletAddress}
        readOnly
        className="w-full p-2 mb-3 border rounded bg-gray-100"
      />

      {/* Campo para digitar o destino */}
      <input
        type="text"
        placeholder="Endereço de destino"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* Valor em ETH */}
      <input
        type="text"
        placeholder="Quantidade em ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <button
        onClick={sendTransaction}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Enviar
      </button>

      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
