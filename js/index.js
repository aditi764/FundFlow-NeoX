let web3, contract;
const contractAddress = "0xE6A94BC029C4e99065Ca6FE0ED1c492985b58DEA";  // Replace with your contract address
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			}
		],
		"name": "CampaignCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goalAmount",
				"type": "uint256"
			}
		],
		"name": "createCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			}
		],
		"name": "fundCampaign",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "funder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Funded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "campaignId",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "campaigns",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCampaigns",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "goalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "currentAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "completed",
						"type": "bool"
					}
				],
				"internalType": "struct Crowdfunding.Campaign[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable().catch(console.error);
} else {
    alert("Please install MetaMask to use this DApp");
}

contract = new web3.eth.Contract(abi, contractAddress);

async function createCampaign(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goalAmount = web3.utils.toWei(document.getElementById("goalAmount").value, "ether");

    const accounts = await web3.eth.getAccounts();
    contract.methods.createCampaign(title, description, goalAmount).send({ from: accounts[0] })
        .on('transactionHash', function(hash) {
            console.log("Transaction hash:", hash);
        })
        .on('receipt', function(receipt) {
            console.log("Receipt:", receipt);
            showNotification("Campaign created successfully!");
            loadCampaigns();
        })
        .on('error', function(error) {
            console.error(error);
            alert("An error occurred while creating the campaign.");
        });
        
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.background = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Removes the notification after 3 seconds
}


async function fundCampaign(event) {
    event.preventDefault();
    const campaignId = document.getElementById("campaignId").value;
    const fundAmount = web3.utils.toWei(document.getElementById("fundAmount").value, "ether");

    const accounts = await web3.eth.getAccounts();
    contract.methods.fundCampaign(campaignId).send({ from: accounts[0], value: fundAmount })
        .on('transactionHash', function(hash) {
            console.log("Transaction hash:", hash);
        })
        .on('receipt', function(receipt) {
            console.log("Receipt:", receipt);
            showNotification("Campaign funded successfully!");
            loadCampaigns();
        })
        .on('error', function(error) {
            console.error(error);
            alert("An error occurred while funding the campaign.");
        });
}

async function withdrawFunds(event) {
    event.preventDefault();
    const campaignId = document.getElementById("withdrawCampaignId").value;

    const accounts = await web3.eth.getAccounts();
    contract.methods.withdrawFunds(campaignId).send({ from: accounts[0] })
        .on('transactionHash', function(hash) {
            console.log("Transaction hash:", hash);
        })
        .on('receipt', function(receipt) {
            console.log("Receipt:", receipt);
            showNotification("Funds withdrawn successfully!");
        })
        .on('error', function(error) {
            console.error(error);
            alert("An error occurred while withdrawing the funds.");
        });
}


document.getElementById("createCampaignForm").addEventListener("submit", createCampaign);
document.getElementById("fundCampaignForm").addEventListener("submit", fundCampaign);
document.getElementById("withdrawForm").addEventListener("submit", withdrawFunds);
