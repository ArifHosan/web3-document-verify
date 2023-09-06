
import { ethers } from 'ethers';

// const { ethereum } = window;
const NETWORK_ID = 11155111;
const EthereumService =  {
    getPrimaryAccount: async (web3) => {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts().then((accounts) => {
                if (accounts.length > 0) {
                    resolve(accounts[0])
                } else {
                    reject(null)
                }
            })
        })
    },
    getBalance: async (web3, account) => {
        if(!account) return Promise.reject("Account is not defined")
        return new Promise((resolve, reject) => {
            Promise.all([
                web3.eth.net.getId(),
                web3.eth.getBalance(account)
            ]).then(([networkId, balance]) => {
                if (networkId !== NETWORK_ID) {
                    reject("Invalid network")
                }
                const balanceInEth = ethers.utils.formatEther(balance);
                resolve(parseFloat(balanceInEth).toFixed(3))
            }).catch((error) => {
                reject(error)
            })
        })
    },
    authenticateMetamask: async () => {
        return new Promise((resolve, reject) => {
            if (window.ethereum) {                
                window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
                    if (accounts.length > 0) {
                        resolve(accounts[0])
                    }
                    else {
                        reject(null)
                    }
                }).catch((error) => {
                    reject(error)
                })
            } else {
                reject(null)
            }
        })
    },
}
export default EthereumService;