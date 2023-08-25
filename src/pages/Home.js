import { useAccount } from 'wagmi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import nftABI from '../utils/nftAbi.json'
import { nftAddress } from '../constants'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useUser } from '../context/UserContext'
import axios from 'axios'
import 'tailwindcss/tailwind.css'

const Home = () => {
    const account = useAccount()
    const { user } = useUser()
    const [nfts, setNfts] = useState([])
    const [toAddress, setToAddress]=useState(0)

    const fetchContractRead = async () => {
        const web3Provider = new Web3(window.ethereum);
        const tmp = new web3Provider.eth.Contract(nftABI, nftAddress)
        const balance = await tmp.methods.balanceOf(account.address).call();
        let res=[];
        for(let i=0; i<balance; i++){
            const tokenId=await tmp.methods.tokenOfOwnerByIndex(account.address, i).call();
            const tokenURI=await tmp.methods.tokenURI(tokenId).call();
            const uriData=await axios.get(tokenURI);
            res.push({
                selected: false,
                identifier: tokenId,
                uri: uriData.data
            })
        }
        setNfts(res);
        console.log(res);
    };

    useEffect(() => {
        if (account.address !== undefined && nfts.length === 0) {
            fetchContractRead();
        }
        if (account.address === undefined && nfts.length > 0) {
            setNfts([])
        }
    }, [account.address, nfts, fetchContractRead, setNfts]);

    const handleAddressChange=(event)=>{
        setToAddress(event.target.value);
    }

    const transferNFTs = async () => {
        const web3Provider = new Web3(window.ethereum);
        const gasPrice=web3Provider.utils.toWei('130', 'gwei');
        const tmp = new web3Provider.eth.Contract(nftABI, nftAddress)
        for(let i=0; i<nfts.length; i++){
            if(nfts[i].selected===false)
                continue;
            try {
                await tmp.methods
                    .safeTransferFrom(account.address, toAddress, nfts[i].identifier)
                    .send({
                        from: account.address, 
                        gasPrice: gasPrice
                })
            }
            catch(e) {
                console.log(e);
            }
        }
        
        await tmp.methods.totalSupply().call()
        fetchContractRead();
    }

    const handleTransferNFT= () => {
        if(account.address===undefined){
            alert('Connect your wallet to transfer')
            return
        }
        transferNFTs();
    }

    return (
        <div className="min-h-screen" data-theme="wireframe">
            <Header/>
            <div className="hero min-h-screen">
                <div className="hero-content text-center flex flex-col">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold pb-4">Hello there, {user}</h1>
                        {account.address !== undefined &&
                            <>
                                {nfts.length > 0 &&
                                    <div>
                                        <p>There are {nfts.length} nfts in your wallet</p>
                                        <div className='flex gap-4 pt-12 justify-center'>
                                            {
                                                nfts.map((nft, ind) => (nft.identifier!=='0' &&
                                                    <div className='border border-red'>
                                                        <img alt="QR" style={{ width: '256px' }} key={ind} src={`${nft.uri.image_url}`} />
                                                        <input type="checkbox" value={nft.selected===false ? false : true} onClick={()=>(nft.selected===false ? nft.selected=true : nft.selected=false)} className='w-4 h-4'/>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                }
                            </>}
                    </div>
                    <p className="py-6 text-xl font-normal leading-normal mt-0 mb-2">
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Receiver Address</label>
                                <input type="text" value={toAddress} onChange={handleAddressChange} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Wallet Address" required/>
                                <button className="btn btn-sm btn-info ml-3 normal-case" onClick={handleTransferNFT}>Transfer</button>
                            </div>
                        </div>
                    </p>
                    {/* <div className="flex flex-col items-center pt-[5%] gap-2">
                        <button onClick={handleMint} className="bg-red-500 text-white px-4 py-2 rounded-lg">Mint your own NFT</button>
                    </div> */}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home