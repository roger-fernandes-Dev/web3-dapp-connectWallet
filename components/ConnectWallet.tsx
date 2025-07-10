'use client'
import { useState } from "react";
import { ethers } from "ethers"

declare global{
  interface window{
    ethereum?: any;
  }
}
export default function Home() {
  

  const [wallet, setWallet] = useState<string | null>(null)
  const [balance, setBalance] = useState<any | null>(null)
  
  //função que conecta a carteira
  async function connectWallet(){
    //verifica se a metamask esta instalada
    if(!window.ethereum){
      alert("Metamesk não encontrada!")
      return
    }


    try{
      /**
       * cria um provedor que permite conversar com a blockchain via navegador
       * pede permissão ao usuário para acessar as contas da carteira
       * pega o primeiro endereço da lista de contas
       * salva o endereço no estado
       * busca o saldo da carteira em wei 
       * converte wei para ETH
       * salva o saldo formatado no estado
       * se der erro, mostra no console
       */
      const provider = new ethers.BrowserProvider(window.ethereum)

      const accounts = await provider.send("eth_requestAccounts", [])
      const userAddress = accounts[0]
      setWallet(userAddress)
      const rawBalance = await provider.getBalance(userAddress)
      const formattedBalance = Number(ethers.formatEther(rawBalance)).toFixed(4)
      console.log("Endereço conectado:", userAddress);
console.log("Saldo bruto em wei:", rawBalance.toString());
console.log("Saldo em ETH formatado:", formattedBalance);
      setBalance(formattedBalance)
    }catch(err){
      console.log("Erro ao conectar", err)
    }
  }

  return (

      <div className="p-4 rounded-lg shadow bg-white max-w-md mx-auto text-center">
      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Conectar Carteira
        </button>
      ) : (
        <div>
          <p className="text-green-700 break-all">
            <strong>Carteira conectada:</strong> {wallet}
          </p>
          {balance && (
            <p className="mt-2 text-gray-800">
              <strong>Saldo:</strong> {balance} ETH
            </p>
          )}
        </div>
      )}
    </div>

  );
}
