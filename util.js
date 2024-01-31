async function init() {
    if (window.ethereum == null) {

        console.log("MetaMask not installed; using read-only defaults");
        provider = new ethers.InfuraProvider("sepolia");
        network = await provider.getNetwork();
        contract = new ethers.Contract("0x11024cDa655EAC1ae74bDd299201BeE84d7d7E99", abi, provider);
        console.log("selected provider: ", provider);
        console.log("network:", network);
        const divImg = document.getElementById("mainDiv");
        divImg.style.display = "none";

        const inputMetadados = document.getElementById("inputMetadados");
        const inputAddress = document.getElementById("inputAddress");
        const btnSubmit = document.getElementById("btnSubmit");
        const txtWarning = document.getElementById("txtWarning");

        inputMetadados.disabled = true;
        inputAddress.disabled = true;
        btnSubmit.disabled = true;
        txtWarning.innerHTML = "Conecte com o Metamask para interagir";
    } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        alert("O Metamask irá pedir aprovação para acessar essa página.\nPor favor, aceite.");
        signer = await provider.getSigner();
        network = await provider.getNetwork();
        contract = new ethers.Contract("0x11024cDa655EAC1ae74bDd299201BeE84d7d7E99", abi, signer);
        console.log("selected provider: ", provider);
        console.log("network:", network);
        console.log("signer: ", signer);
        console.log("contract: ", contract);

        const networkAccount = document.getElementById("navAddress");
        networkAccount.innerHTML = "Bem-vindo(a) " + signer.address + "! ";
        
        console.log("passou 1");

        try {
            const autorizado = await contract.hasRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", signer.address);
            console.log("passou 2");
            if (autorizado) {
                console.log("passou 3");
                const inputMetadados = document.getElementById("inputMetadados");
                const inputAddress = document.getElementById("inputAddress");
                const btnSubmit = document.getElementById("btnSubmit");
                const txtWarning = document.getElementById("txtWarning");

                inputMetadados.disabled = false;
                inputAddress.disabled = false;
                btnSubmit.disabled = false;
                txtWarning.innerHTML = "";
            }
        } catch (error) {
            console.log("entrou no catch 1");
            console.error(error);
        }
        // Create a contract
        try {
            console.log("passou 4");
            const nftNomeObj = await contract.name();
            console.log("nftNomeObj: ", nftNomeObj);
            const nftNome = document.getElementById("nftNome");
            console.log("nftNome: ", nftNome);
            nftNome.innerHTML = nftNomeObj;
            console.log("passou 4.5");
            const metadadosURL = await contract.tokenURI(0);
            console.log("passou 5");

            console.log("metadadosURL: ", metadadosURL);
            const metadadadosResp = await fetch(metadadosURL);
            console.log("metadadadosResp: ", metadadadosResp);
            const metadados = await metadadadosResp.json();
            console.log("metadadadosResp Body: ", metadados);
            const nftDesc = document.getElementById("nftDesc");
            nftDesc.innerHTML = metadados.description;
            const imgNFT = document.getElementById("imgNFT");
            imgNFT.src = metadados.image;
            const divImg = document.getElementById("divImg");
            divImg.style.display = "grid";
        } catch (error) {
            console.log("entrou no catch 2");
            console.error(error);
        }
    }
}
document.getElementById('formMint').addEventListener('submit', async () => {
    event.preventDefault();
    const form = document.getElementById("formMint");
    alert("Aguarde e confirme a transação no Metamask");
    const tx = await contract.safeMint(form.inputAddress.value, form.inputMetadados.value);
    console.log("tx enviada: ", tx);
    alert("Transação enviada a Blockchain. Aguarde.\nTx ID:" + tx.hash);
    const txReceipt = await tx.wait();
    console.log("txReceipt: ", txReceipt);
    if (txReceipt.status === 1) {
        alert("Parabéns! Novo NFT gerado");
        form.reset();
    }
})
let signer = null;
let provider;
let network;
let contract;
init();