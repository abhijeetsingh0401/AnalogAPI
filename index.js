import express from 'express'
import Web3 from 'web3'
// import { newKitFromWeb3 ,newKit,CeloContract} from '@celo/contractkit'


// import privateKeyToAddress from "@celo/utils/lib/address.js";

const MPContractAddress = "0x3FCa5663E099EA5063ebd317B512810efA55e882"
const app = express();
const PORT = 8080
const web3 = new Web3("https://rpc.testnet.mantle.xyz/")
console.log(web3.eth.getNodeInfo())
//89ede4bf8dbbc81f6af21a41419f188036507b2e8d328cc73c6eb57696f17ac3
console.log(web3.eth.accounts.wallet.add('1c158d5e7b8d6a4075ce30e293a20f79bd2b9457c1e4114442f4f045ef757bf3'))
const json =   [
    {
      "inputs": [],
      "name": "totalVoteDown",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalVoteUp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteDown",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteUp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votedec",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteinc",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

let contract = new web3.eth.Contract(json, MPContractAddress);
console.log(contract.defaultBlock)
async function voteUp() {


	  let txObject = await contract.methods.voteUp()
	  const receipt = await txObject
	 .send({
	
	   from: '0x8CF6CB2672b8A8423D34F3973689b656715c6eC9',
	   gas: await txObject.estimateGas(),
	 })
	
	
	  console.log(receipt)
	  return receipt
	
	}
async function voteDown() {


		let txObject = await contract.methods.voteDown()
		const receipt = await txObject
		.send({
	
		from: '0x8CF6CB2672b8A8423D34F3973689b656715c6eC9',
		gas: await txObject.estimateGas(),
		})
	
	
		console.log(receipt)
		return receipt
	
	}
async function getVoteDown() {

	  let txObject = await contract.methods.totalVoteDown()
	  const receipt = await txObject.call()
	
	
	  console.log(receipt)
	  return receipt
	
	}
// let contract
async function getVoteUp() {
  let txObject = await contract.methods.totalVoteUp()
  const receipt = await txObject
 .call()

  console.log(receipt)
  return receipt

}
 app.get('/totalvotedown', async (req, res) => {

	const detailofnft= await  getVoteDown()
	 
	 res.send(detailofnft)
	 })
app.get('/votedown', async (req, res) => {

const detailofnft= await  voteDown()
	console.log(detailofnft.blockHash)
	res.send(detailofnft.blockHash)
	})
app.get('/voteup', async (req, res) => {

	const detailofnft= await  voteUp()
		console.log(detailofnft.blockHash)
		res.send(detailofnft.blockHash)
		})
	
 app.get('/totalvoteup', async (req, res) => {

 const detailofnft= await  getVoteUp()
	 
 res.send(detailofnft)
  })
  
  app.listen(process.env.PORT || PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))