const web3 = require('web3');

// Set up Web3 provider
const provider = new web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');
const web3Instance = new web3(provider);

// Set up contract instance
const contractAddress = '0x9ba22e3b9dfF0cBAbc1CF7CcB540f1333dA8Fde5';
const contractABI = [{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"getGooProduction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numUpgrades","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastGooProductionUpdate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitGooProductionIncreases","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unitId","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"buyUnit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"goo","type":"uint256"},{"name":"class","type":"uint256"},{"name":"unit","type":"uint256"},{"name":"value","type":"uint256"},{"name":"prereq","type":"uint256"}],"name":"addUpgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upgradeInfo","outputs":[{"name":"upgradeId","type":"uint256"},{"name":"gooCost","type":"uint256"},{"name":"upgradeClass","type":"uint256"},{"name":"unitId","type":"uint256"},{"name":"upgradeValue","type":"uint256"},{"name":"prerequisiteUpgrade","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"existingPlayer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalGooProduction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitGooProductionMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nextSnapshotTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastGooSaveTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"unitInfo","outputs":[{"name":"unitId","type":"uint256"},{"name":"baseGooCost","type":"uint256"},{"name":"gooCostIncreaseHalf","type":"uint256"},{"name":"baseGooProduction","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"goo","type":"uint256"},{"name":"gooIncreaseHalf","type":"uint256"},{"name":"production","type":"uint256"}],"name":"addUnit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitsOwned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numProdUnits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"snapshotDailyGooResearchFunding","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gamePrizePool","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"updateGamePrizePool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gooBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]; // Replace with the contract ABI
const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

// Get game stats
contractInstance.methods.gamePrizePool().call().then(result => {
    document.getElementById('game-prize-pool').innerHTML = web3Instance.utils.fromWei(result, 'ether') + ' BNB';
});

contractInstance.methods.totalGooProduction().call().then(result => {
    document.getElementById('total-goo-production').innerHTML = result;
});

contractInstance.methods.nextSnapshotTime().call().then(result => {
    document.getElementById('next-snapshot-time').innerHTML = new Date(result * 1000).toLocaleString();
});

// Get player stats
contractInstance.methods.gooBalance().call().then(result => {
    document.getElementById('goo-balance').innerHTML = web3Instance.utils.fromWei(result, 'ether');
});

contractInstance.methods.unitsOwned().call().then(result => {
    document.getElementById('units-owned').innerHTML = result;
});

contractInstance.methods.gooProduction().call().then(result => {
    document.getElementById('goo-production').innerHTML = result;
});

// Deposit BNB
document.getElementById('deposit-btn').addEventListener('click', () => {
    contractInstance.methods.deposit().send({ value: web3Instance.utils.toWei('1', 'ether') });
});

// Buy unit
document.getElementById('buy-unit-btn').addEventListener('click', () => {
    contractInstance.methods.buyUnit().send();
});

// Update game prize pool
document.getElementById('update-game-prize-pool-btn').addEventListener('click', () => {
    contractInstance.methods.updateGamePrizePool().send();
});
