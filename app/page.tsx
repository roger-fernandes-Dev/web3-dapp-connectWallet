import SendEth from '@/components/SendEth'
import ConnectWallet from '../components/ConnectWallet'
export default function Home(){
  return(
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <ConnectWallet />
      <SendEth />
    </main>
  )
}