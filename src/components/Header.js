import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'

export default function Header() {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();

    const { isConnected } = useAccount();

    return (
        <div className="navbar text-neutral-content bg-gray-800">
            <div className="flex-1 ml-3 text-gray-50">
                
            </div>

            <div className="navbar-end">
                {isConnected ?
                    (<><button className="btn btn-sm btn-info ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-error ml-3 normal-case " onClick={openChainModal}>Chain</button></>)
                    :
                    (<button className="btn btn-sm btn-error ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)
                }
            </div>
        </div >
    )
}
