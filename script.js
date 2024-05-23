document.addEventListener('DOMContentLoaded', async () => {
    const bnbBalanceElement = document.getElementById('bnbBalance');
    const gooBalanceElement = document.getElementById('gooBalance');
    const gooProductionElement = document.getElementById('gooProduction');
    const unitsContainer = document.getElementById('units-container');
    const upgradesContainer = document.getElementById('upgrades-container');

    let bnbBalance = 0;
    let gooBalance = 0;
    let gooProduction = 0;
  
    const contractAddress = '0x9ba22e3b9dfF0cBAbc1CF7CcB540f1333dA8Fde5';
    const abi = [[{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"getGooProduction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numUpgrades","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastGooProductionUpdate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitGooProductionIncreases","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unitId","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"buyUnit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"goo","type":"uint256"},{"name":"class","type":"uint256"},{"name":"unit","type":"uint256"},{"name":"value","type":"uint256"},{"name":"prereq","type":"uint256"}],"name":"addUpgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upgradeInfo","outputs":[{"name":"upgradeId","type":"uint256"},{"name":"gooCost","type":"uint256"},{"name":"upgradeClass","type":"uint256"},{"name":"unitId","type":"uint256"},{"name":"upgradeValue","type":"uint256"},{"name":"prerequisiteUpgrade","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"existingPlayer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalGooProduction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitGooProductionMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nextSnapshotTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastGooSaveTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"unitInfo","outputs":[{"name":"unitId","type":"uint256"},{"name":"baseGooCost","type":"uint256"},{"name":"gooCostIncreaseHalf","type":"uint256"},{"name":"baseGooProduction","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"goo","type":"uint256"},{"name":"gooIncreaseHalf","type":"uint256"},{"name":"production","type":"uint256"}],"name":"addUnit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"unitsOwned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numProdUnits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"snapshotDailyGooResearchFunding","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gamePrizePool","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"updateGamePrizePool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gooBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            updateBNBBalance(account);
            window.contract = new web3.eth.Contract(abi, contractAddress);
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('Please install MetaMask!');
    }

    async function updateBNBBalance(account) {
        bnbBalance = await web3.eth.getBalance(account);
        bnbBalance = web3.utils.fromWei(bnbBalance, 'ether');
        bnbBalanceElement.textContent = parseFloat(bnbBalance).toFixed(4);
    }

    async function updateGooBalance() {
        try {
            gooBalance = await contract.methods.gooBalanceOf(ethereum.selectedAddress).call();
            gooBalanceElement.textContent = gooBalance;
        } catch (error) {
            console.error(error);
        }
    }

    async function updateGooProduction() {
        try {
            gooProduction = await contract.methods.gooProductionOf(ethereum.selectedAddress).call();
            gooProductionElement.textContent = gooProduction;
        } catch (error) {
            console.error(error);
        }
    }

    function updateBalances() {
        updateGooBalance();
        updateGooProduction();
    }

    function createUnitElement(unit) {
        const unitElement = document.createElement('div');
        unitElement.className = 'unit';
        unitElement.innerHTML = `
            <h3>${unit.name}</h3>
            <p>BNB Cost: ${unit.bnbCost} BNB</p>
            <p>Goo Cost: ${unit.gooCost} Goo</p>
            <p>Production: ${unit.production} Goo/s</p>
            <button onclick="buyUnit(${unit.id})">Buy with BNB</button>
            <button onclick="buyUnitWithGoo(${unit.id})">Buy with Goo</button>
        `;
        return unitElement;
    }

    function createUpgradeElement(upgrade) {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>Cost: ${upgrade.gooCost} Goo</p>
            <p>Effect: ${upgrade.effect}</p>
            <button onclick="buyUpgrade(${upgrade.id})">Buy</button>
        `;
        return upgradeElement;
    }

    function renderUnits() {
        unitsContainer.innerHTML = '';
        units.forEach(unit => {
            unitsContainer.appendChild(createUnitElement(unit));
        });
    }

    function renderUpgrades() {
        upgradesContainer.innerHTML = '';
        upgrades.forEach(upgrade => {
            upgradesContainer.appendChild(createUpgradeElement(upgrade));
        });
    }

    window.buyUnit = async function(id) {
        const unit = units.find(u => u.id === id);
        if (parseFloat(bnbBalance) >= unit.bnbCost) {
            try {
                const accounts = await web3.eth.getAccounts();
                await web3.eth.sendTransaction({
                    from: accounts[0],
                    to: contractAddress,
                    value: web3.utils.toWei(unit.bnbCost.toString(), 'ether')
                });
                gooProduction += unit.production;
                updateBalances();
                alert(`Successfully bought ${unit.name} with BNB`);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Not enough BNB');
        }
    }

    window.buyUnitWithGoo = async function(id) {
        const unit = units.find(u => u.id === id);
        if (gooBalance >= unit.gooCost) {
            try {
                await contract.methods.buyUnitWithGoo(id).send({ from: ethereum.selectedAddress });
                gooBalance -= unit.gooCost;
                gooProduction += unit.production;
                updateBalances();
                alert(`Successfully bought ${unit.name} with Goo`);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Not enough Goo');
        }
    }

    window.buyUpgrade = async function(id) {
        const upgrade = upgrades.find(u => u.id === id);
        if (gooBalance >= upgrade.gooCost) {
            try {
                await contract.methods.buyUpgrade(id).send({ from: ethereum.selectedAddress });
                gooBalance -= upgrade.gooCost;
                gooProduction *= 1.1;  // Example effect
                updateBalances();
                alert(`Successfully bought ${upgrade.name}`);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Not enough Goo');
        }
    }

    document.getElementById('claimGoo').addEventListener('click', async () => {
        try {
            await contract.methods.claimGoo().send({ from: ethereum.selectedAddress });
            updateBalances();
        } catch (error) {
            console.error(error);
        }
    });

    document.getElementById('distributeDividends').addEventListener('click', async () => {
        try {
            await contract.methods.distributeDividends().send({ from: ethereum.selectedAddress });
            alert('Dividends distributed');
        } catch (error) {
            console.error(error);
        }
    });

    const units = [
        { id: 1, name: 'Farmer', bnbCost: 0.01, gooCost: 100, production: 1 },
        { id: 2, name: 'Miner', bnbCost: 0.05, gooCost: 500, production: 5 },
    ];

    const upgrades = [
        { id: 1, name: 'Better Tools', gooCost: 1000, effect: 'Increase production by 10%' },
        { id: 2, name: 'Advanced Training', gooCost: 5000, effect: 'Increase production by 50%' },
    ];

    renderUnits();
    renderUpgrades();
    updateBalances();
});
