let carrinho = [];
let total = 0;
let frete = 0;

function adicionarCarrinho(nome, preco) {
  carrinho.push({nome, preco});
  total += preco;
  atualizarCarrinho();
}

function removerItem(index) {
  total -= carrinho[index].preco;
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const totalEl = document.getElementById("carrinho-total");
  const icon = document.getElementById("carrinho-icon");
  const freteEl = document.getElementById("frete-valor");

  lista.innerHTML = "";
  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco}`;
    
    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.classList.add("remove-btn");
    btn.onclick = () => removerItem(index);

    li.appendChild(btn);
    lista.appendChild(li);
  });

  totalEl.textContent = "Total: R$ " + (total + frete);
  freteEl.textContent = "Frete: R$ " + frete;
  icon.textContent = "Carrinho (" + carrinho.length + ")";
}

function calcularFrete() {
  const cep = document.getElementById("cep").value;

  if (!cep.match(/^[0-9]{8}$/)) {
    alert("Digite um CEP válido (somente números).");
    return;
  }

  // Exemplo simplificado de regra de frete
  if (cep >= "60000000" && cep <= "60999999") {
    frete = 50;
  } else {
    frete = 120;
  }

  atualizarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá, Vim do site e gostaria de finalizar a compra:\n\n";
  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco})\n`;
  });
  mensagem += `\nFrete: R$ ${frete}`;
  mensagem += `\nTotal: R$ ${total + frete}`;

  // Troque pelo seu número do WhatsApp
  let telefone = "5585987431390";
  let url = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);

  window.open(url, "_blank");
}

