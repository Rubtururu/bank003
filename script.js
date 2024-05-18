document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contractAddress = '0xDc76eaDcB7fa498Ba36E9A3dC04299aF51933d97'; // Dirección del contrato desplegado
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimDividends","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"ceoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dividendsStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"firstDepositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserAvailableDividends","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendsPaymentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDividendsPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTreasuryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDividends","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDividendsClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];

        updateStats(); // Actualizar estadísticas iniciales

        // Event listeners para los botones de depositar, retirar y reclamar dividendos
        document.getElementById('deposit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('deposit-amount').value;
            await contract.methods.deposit().send({ from: userAccount, value: web3.utils.toWei(amount, 'ether') });
            updateStats();
            document.getElementById('deposit-amount').value = ''; // Limpiar el campo después del depósito
        });

        document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('withdraw-amount').value;
            await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
            updateStats();
            document.getElementById('withdraw-amount').value = ''; // Limpiar el campo después del retiro
        });

        document.getElementById('claim-dividends').addEventListener('click', async () => {
            await contract.methods.claimDividends().send({ from: userAccount });
            updateStats();
        });

        async function updateStats() {
            // Obtenemos las estadísticas del contrato
            const totalDeposits = await contract.methods.totalDeposits().call();
            const totalTreasuryPool = await contract.methods.totalTreasuryPool().call();
            const totalDividendsPool = await contract.methods.totalDividendsPool().call();
            const firstDepositTime = await contract.methods.firstDepositTime().call(); // Obtener el tiempo del primer depósito
            const contractBalance = await contract.methods.getContractBalance().call();

            // Obtenemos las estadísticas del usuario
            const userDeposits = await contract.methods.userDeposits(userAccount).call();
            const userWithdrawals = await contract.methods.userWithdrawals(userAccount).call();
            const userDividendsToday = await contract.methods.getUserAvailableDividends(userAccount).call();
            const userCurrentDeposit = parseInt(userDeposits) - parseInt(userWithdrawals); // Convertir a números antes de la resta
            const userTotalWithdrawals = userWithdrawals;
            const userTotalDividends = await contract.methods.userDividendsClaimed(userAccount).call();

            // Actualizamos los elementos HTML con las estadísticas obtenidas
            document.getElementById('user-address').innerText = userAccount; // Mostrar la dirección del usuario
            document.getElementById('total-deposits').innerText = web3.utils.fromWei(totalDeposits, 'ether');
            document.getElementById('total-treasury-pool').innerText = web3.utils.fromWei(totalTreasuryPool, 'ether');
            document.getElementById('total-dividends-pool').innerText = web3.utils.fromWei(totalDividendsPool, 'ether');
            document.getElementById('first-deposit-time').innerText = new Date(firstDepositTime * 1000).toLocaleString(); // Mostrar el tiempo del primer depósito
            document.getElementById('contract-balance').innerText = web3.utils.fromWei(contractBalance, 'ether');
            document.getElementById('user-deposits').innerText = web3.utils.fromWei(userDeposits, 'ether');
            document.getElementById('user-withdrawals').innerText = web3.utils.fromWei(userWithdrawals, 'ether');
            document.getElementById('contract-balance').innerText = web3.utils.fromWei(contractBalance, 'ether');
            document.getElementById('user-dividends-today').innerText = web3.utils.fromWei(userDividendsToday, 'ether');
            document.getElementById('user-current-deposit').innerText = web3.utils.fromWei(userCurrentDeposit.toString(), 'ether'); // Convertir a cadena antes de mostrar
            document.getElementById('user-total-withdrawals').innerText = web3.utils.fromWei(userTotalWithdrawals, 'ether');
            document.getElementById('user-total-dividends').innerText = web3.utils.fromWei(userTotalDividends, 'ether');

            // Calcular el tiempo restante hasta el próximo pago de dividendos en tiempo real
            const tiempoRestanteParaPago = calcularTiempoRestanteParaPago(firstDepositTime);

            // Mostrar el tiempo restante en el contador de cuenta regresiva
            document.getElementById('countdown-timer').innerText = `${tiempoRestanteParaPago.horas}h ${tiempoRestanteParaPago.minutos}m ${tiempoRestanteParaPago.segundos}s`;
        }

    } else {
        alert('Por favor, instala MetaMask para utilizar esta aplicación.');
    }
});

// Función para calcular el tiempo restante hasta el próximo pago de dividendos en tiempo real
function calcularTiempoRestanteParaPago(tiempoPrimerDeposito) {
    // Obtener la fecha y hora actuales en UTC
    const ahora = Math.floor(new Date().getTime() / 1000);

    // Calcular el tiempo transcurrido desde el primer depósito
    const tiempoTranscurrido = ahora - tiempoPrimerDeposito;

    // Calcular el tiempo restante hasta el próximo pago de dividendos (24 horas desde el primer depósito)
    const tiempoRestante = 24 * 60 * 60 - tiempoTranscurrido;

    // Convertir el tiempo restante a horas, minutos y segundos
    const horasRestantes = Math.floor(tiempoRestante / 3600);
    const minutosRestantes = Math.floor((tiempoRestante % 3600) / 60);
    const segundosRestantes = tiempoRestante % 60;

    // Retornar el tiempo restante como objeto
    return {
        horas: horasRestantes,
        minutos: minutosRestantes,
        segundos: segundosRestantes
    };
}






