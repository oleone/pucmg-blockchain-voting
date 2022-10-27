const tableElem = document.getElementById("table-body");
const tableVotorsElem = document.getElementById("table-body-votors");
const candidateOptions = document.getElementById("candidate-options");
const txtVotacao = document.getElementById("txtVotacao");

var votacaoEncerrada;
var proposals = [];
var usersVoted = [];
var myAddress;
var isEncerrado = false;
var eleicao;
const CONTRACT_ADDRESS = "0x3DD13C38F8833488c735B6B0930a71699643f05C";

const ethEnabled = () => {
	if (window.ethereum) {
		window.web3 = new Web3(window.ethereum);
		window.ethereum.enable();
		return true;
	}
	return false;
}

const getMyAccounts = accounts => {
	try {
		if (accounts.length == 0) {
			alert("Você não tem contas habilitadas no Metamask!");
		} else {
			myAddress = accounts[0];
			accounts.forEach(async myAddress => {
				console.log(myAddress + " : " + await window.web3.eth.getBalance(myAddress));
			});
		}
	} catch (error) {
		console.log("Erro ao obter contas...");
	}
};

window.addEventListener('load', async function () {

	if (!ethEnabled()) {
		alert("Por favor, instale um navegador compatível com Ethereum ou uma extensão como o MetaMask para utilizar esse dApp!");
	}
	else {
		getMyAccounts(await web3.eth.getAccounts());

		eleicao = new web3.eth.Contract(VotingContractInterface, CONTRACT_ADDRESS);
		getCandidatos(eleicao, populaCandidatos);
		popularVoters(eleicao);
	}
});

function getCandidatos(contractRef, callback) {

	contractRef.methods.getProposalsCount().call(async function (error, count) {
		for (i = 0; i < count; i++) {
			await contractRef.methods.getProposal(i).call().then((data) => {
				var proposal = {
					name: web3.utils.toUtf8(data[0]),
					voteCount: data[1]
				};
				proposals.push(proposal);
			});
		}
		if (callback) {
			callback(proposals);
		}
	});
}

function populaCandidatos(candidatos) {
	candidatos.forEach((candidato, index) => {
		// Creates a row element.
		const rowElem = document.createElement("tr");

		// Creates a cell element for the name.
		const nameCell = document.createElement("td");
		nameCell.innerText = candidato.name;
		rowElem.appendChild(nameCell);

		// Creates a cell element for the votes.
		const voteCell = document.createElement("td");
		voteCell.id = "vote-" + candidato.name;
		voteCell.innerText = candidato.voteCount;
		rowElem.appendChild(voteCell);

		// Adds the new row to the voting table.
		tableElem.appendChild(rowElem);

		// Creates an option for each candidate
		const candidateOption = document.createElement("option");
		candidateOption.value = index;
		candidateOption.innerText = candidato.name;
		candidateOptions.appendChild(candidateOption);
	});
}

function popularVoters() {
	contractRef.methods.retornaVoters().call(async function (error, voters) {
		for (i = 0; i < voters.length; i++) {
			const rowElem = document.createElement("tr");

			const nameCell = document.createElement("td");
			nameCell.innerText = voters.name;
			rowElem.appendChild(nameCell);

			const isVote = document.createElement("td");
			isVote.innerText = voters.voted;
			rowElem.appendChild(isVote);

			const delegateCount = document.createElement("td");
			delegateCount.innerText = voters.weight;
			rowElem.appendChild(delegateCount);

			const vote = document.createElement("td");
			vote.innerText = voters.vote;
			rowElem.appendChild(vote);

			const delegate = document.createElement("td");
			delegate.innerText = voters.delegate;
			rowElem.appendChild(delegate);
			tableVotorsElem.appendChild(rowElem);
		}
	});
}

$("#btnVote").on('click', function () {
	candidato = $("#candidate-options").children("option:selected").val();

	eleicao.methods.vote(candidato).send({ from: myAddress })
		.on('receipt', function (receipt) {
			//getCandidatos(eleicao, populaCandidatos);
			windows.location.reaload(true);
		})
		.on('error', function (error) {
			console.log(error.message);
			return;
		});

});

$("#btnDelegate").on('click', function () {
	const para = document.getElementById("delegar").value;

	eleicao.methods.delegate(para).send({ from: myAddress })
		.on('receipt', function (receipt) {
			console.log("Voto delegado");
			window.location.reload();
		})
		.on('error', function (error) {
			console.log(error.message);
			return;
		});

});

$("#btnGiveRightToVote").on('click', function () {
	const address = document.getElementById("rightToVoteAddress").value;
	const name = document.rightToVoteName("delegar").value;

	eleicao.methods.giveRightToVote(address, name).send({ from: myAddress })
		.on('receipt', function (receipt) {
			console.log("Voto delegado");
		})
		.on('error', function (error) {
			console.log(error.message);
			return;
		});
});

$("#btnEncerrar").on('click', function () {
	eleicao.methods.encerrar().send({ from: myAddress })
		.on('receipt', function (receipt) {
			console.log("Votacao encerrada");

			txtVotacao.innerText = "Votação encerrada";
			document.querySelector('#btnVote').disabled = true;

			window.location.reload();
		})
		.on('error', function (error) {
			console.log(error.message);
			return;
		});

});