import { useAccount } from 'wagmi'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Header from '../components/Header'
import axios from "axios";

const Login = () => {
    const {isConnected} = useAccount()

    return (
        <div className="min-h-screen relative" data-theme="wireframe">
            <ToastContainer />
            <Header/>
            <div className="flex flex-col items-center pt-[5%] gap-2">
                {
                    isConnected ? (<>sss</>) : (<div>Not connected</div>)
                }
            </div>
        </div >
    )
}

export default Login