let balance = 1000;
const correctPin = '1234';

function login() {
    const container = document.getElementById('container');
    const pin = document.getElementById('pinInput').value;
    if (pin === correctPin) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('atm').style.display = 'block';
        document.getElementById('loginStatus').textContent = '';
    } else {
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
            playerrorSound();
        }, 300);
        document.getElementById('loginStatus').textContent = 'Incorrect PIN ❌';
    }
}
function checkBalance() {
    document.getElementById('balance').textContent = balance;
    document.getElementById(
        'messeg'
    ).textContent = `Your balance is ✅ ${'$'}${balance}`;
}

function exit() {
    const message = document.getElementById('messeg');

    // Step 1: Show exit message immediately
    message.textContent = 'Thanks for using 🏧';
    message.style.fontSize = '20px';
    setTimeout(function () {
        document.getElementById('atm').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        document.getElementById('pinInput').value = '';
        balance = 1000;
        document.getElementById('balance').textContent = 'Balance: ' + balance;
        exitReceipt();
    }, 1000); // Delay to switch screen
}

// Handle withdraw action
function withdraw() {
    const container = document.getElementById('container');
    const amount = parseInt(document.getElementById('inputamount').value);
    const message = document.getElementById('messeg');

    if (isNaN(amount) || amount <= 0 || amount % 500 !== 0) {
        playerrorSound();
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
        message.textContent =
            '❌ Only 500 and 1000 and 5000 notes can be withdrawn.';
        return;
    }
    if (amount > balance) {
        playerrorSound();
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
        message.textContent = '❌ Insufficient balance!';
        return;
    }
    // Update balance and store withdrawal message
    playSuccessSound();
    balance -= amount;
    document.getElementById('balance').textContent = 'Balance: ' + balance;
    message.textContent = `You withdrew: $${amount}`; // Store withdrawal message
    showReceipt(amount, 'Withdrawn'); // Show receipt with withdrawal message
}
// Handle deposit action
function deposit() {
    const container = document.getElementById('container');
    const amount = parseInt(document.getElementById('inputamount').value);
    const message = document.getElementById('messeg');
    if (isNaN(amount) || amount <= 0) {
        playerrorSound();
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
        message.textContent = '❌ Enter valid amount.';
        return;
    }
    playSuccessSound();
    balance += amount; // increase balance only if amount is valid ✅
    document.getElementById('balance').textContent = 'Balance: ' + balance;
    message.textContent = `You deposited: $${amount}`;
    showReceipt(amount, 'Deposited');
}

function showEnteredAmount() {
    const amount = document.getElementById('inputamount').value;
    const message = document.getElementById('messeg');
    if (!amount) {
        message.textContent = '';
        return;
    }
    message.textContent = `You entered: $${amount}`;
}
function playSuccessSound() {
    const audio = document.getElementById('SuccessSound');
    if (audio) {
        audio.currentTime = 0; // rewind to start
        audio.play();
    }
}
function playerrorSound() {
    const audio = document.getElementById('errorSound');
    if (audio) {
        audio.currentTime = 0; // rewind to start
        audio.play();
    }
}
function showReceipt(amount, type = 'Withdrawn') {
    const receipt = document.getElementById('receipt');
    const receiptAmount = document.getElementById('receiptAmount');
    const receiptBalance = document.getElementById('receiptBalance');
    const receiptDate = document.getElementById('receiptDate');
    receiptAmount.textContent = `${type}: $${amount}`;
    receiptBalance.textContent = `Remaining: $${balance}`;
    receiptDate.textContent = `Date: ${new Date().toLocaleString()}`;
    receipt.style.display = 'block';
}
function downloadReceipt() {
    const text = `
    ✅ Receipt
    --------------------------
    ${document.getElementById('receiptAmount').textContent}
    ${document.getElementById('receiptBalance').textContent}
    ${document.getElementById('receiptDate').textContent}
    --------------------------
    `;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ATM_Receipt.txt';
    a.click();

    URL.revokeObjectURL(url);
}
function shareReceipt() {
    const text = `
    ✅ Receipt
    --------------------------
    ${document.getElementById('receiptAmount').textContent}
    ${document.getElementById('receiptBalance').textContent}
    ${document.getElementById('receiptDate').textContent}
    --------------------------
    `;

    if (navigator.share) {
        navigator
            .share({
                title: 'ATM Receipt',
                text: text,
            })
            .then(() => console.log('Shared successfully!'))
            .catch((err) => console.log('Share failed:', err));
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Receipt copied to clipboard! 📋');
        });
    }
}
async function exitReceipt() {
    document.getElementById('receipt').style.display = 'none';
    document.getElementById('messeg').textContent = '';
}

document
    .getElementById('downloadBtn')
    .addEventListener('click', async function () {
        const receipt = document.getElementById('receipt'); // Or the container that holds the content you want to capture

        try {
            // Use html2canvas to take a snapshot of the container
            const canvas = await html2canvas(receipt);

            // Convert canvas to a data URL (image format)
            const imageUrl = canvas.toDataURL();

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'receipt_and_image.png'; // Specify the download file name
            link.click(); // Trigger the download
        } catch (error) {
            console.error('Error capturing the image: ', error);
        }
    });
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
}
