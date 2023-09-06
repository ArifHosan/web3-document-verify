
import ABI from '../contracts/DocumentVerification.json';
import EthereumService from './etherService';

const contractAddress = "0x071Ac9573257D5007d15C7a41DC83Fd92c0fdBE5";

const ContractService = {
    getContract: async (web3) => {
        const account = await EthereumService.getPrimaryAccount(web3);
        return new Promise((resolve, reject) => {
            const contract = new web3.eth.Contract(ABI.abi, contractAddress, {
                from: account
            });
            resolve(contract)
        })
    },
    sendTransation: async (params) => {
        return new Promise((resolve, reject) => {
            window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [params],
            }).then((result) => {
                resolve(result)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    setupListeners: async (web3, contract, eventHandler, errorHandler) => {
        const account = await EthereumService.getPrimaryAccount(web3);
        contract.events.allEvents({ filter: { _from: account } }, (error, event) => {
            if (error) {
                errorHandler(error)
            } else {
                eventHandler(event)
            }
        })
    },
    estimateGas: async (web3, params) => {
        return new Promise((resolve, reject) => {
            web3.eth.estimateGas(params).then((gasAmount) => {
                console.log(gasAmount)
                resolve(gasAmount)
            }).catch((error) => {
                reject(error)
            })
        })
    },

}
export default ContractService;