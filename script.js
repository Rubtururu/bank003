document.addEventListener('DOMContentLoaded', async () => {
    const bnbBalanceElement = document.getElementById('bnbBalance');
    const gooBalanceElement = document.getElementById('gooBalance');
    const gooProductionElement = document.getElementById('gooProduction');
    const unitsContainer = document.getElementById('units-container');
    const upgradesContainer = document.getElementById('upgrades-container');

    let bnbBalance = 0;
    let gooBalance = 0;
    let gooProduction = 0;

    const units = [
        { id: 1, name: 'Unit 1', bnbCost: 0.01, gooCost: 100, production: 1 },
        { id: 2, name: 'Unit 2', bnbCost: 0.02, gooCost: 200, production: 2 },
        // Add more units as needed
    ];

    const upgrades = [
        { id: 1, name: 'Upgrade 1', gooCost: 50, effect: 'Increase production by 10%' },
        { id: 2, name: 'Upgrade 2', gooCost: 100, effect: 'Increase production by 20%' },
        // Add more upgrades as needed
    ];

    async function connectWallet() {
        if (window.ethereum) {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                updateBNBBalance(account);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    async function updateBNBBalance(account) {
        bnbBalance = await web3.eth.getBalance(account);
        bnbBalance = web3.utils.fromWei(bnbBalance, 'ether');
        bnbBalanceElement.textContent = parseFloat(bnbBalance).toFixed(4);
    }

    function updateBalances() {
        gooBalanceElement.textContent = gooBalance;
        gooProductionElement.textContent = gooProduction;
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
            // Lógica para comprar con BNB
            try {
                const accounts = await web3.eth.getAccounts();
                await web3.eth.sendTransaction({
                    from: accounts[0],
                    to: '0x9ba22e3b9dfF0cBAbc1CF7CcB540f1333dA8Fde5',
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

    window.buyUnitWithGoo = function(id) {
        const unit = units.find(u => u.id === id);
        if (gooBalance >= unit.gooCost) {
            gooBalance -= unit.gooCost;
            gooProduction += unit.production;
            updateBalances();
        } else {
            alert('Not enough Goo');
        }
    }

    window.buyUpgrade = function(id) {
        const upgrade = upgrades.find(u => u.id === id);
        if (gooBalance >= upgrade.gooCost) {
            gooBalance -= upgrade.gooCost;
            gooProduction *= 1.1;  // Example effect
            updateBalances();
        } else {
            alert('Not enough Goo');
        }
    }

    function claimGoo() {
        gooBalance += gooProduction;
        updateBalances();
    }

    function distributeDividends() {
        alert('Dividends distributed!');
    }

    document.getElementById('claimGoo').addEventListener('click', claimGoo);
    document.getElementById('distributeDividends').addEventListener('click', distributeDividends);

    await connectWallet();
    renderUnits();
    renderUpgrades();
    updateBalances();
});
