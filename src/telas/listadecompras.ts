import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {IProduto} from "../contratos/entidades/produto";

export class ListaDeCompras implements ITela {
    constructor(public carrinho: ICarrinho) {}

    atualizar(produto: IProduto) {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.carrinho.adicionarProduto(produto, quantidade, true);
        this.carrinho.totalizar(true);
        alert(`Produto ${produto.id} foi adicionado com sucesso!`);
        document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
    }

    remover(produto: IProduto) {
        this.carrinho.removerProduto(produto);
        this.carrinho.totalizar(true);
        alert(`Produto ${produto.id} foi removido do carrinho!`);
        document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
    }

    htmlListaDeProdutos(): HTMLElement {
        const produtos = this.carrinho.produtos;
        const div = criarElementoHtml('div', ['lista-de-produtos', 'row']);
        if (produtos.length < 1) {
            div.innerHTML = `<div class="bg-body-tertiary p-5 rounded mt-3">
    <h2>Seu carrinho de compras está vazio.</h2>
    <p class="lead">Adicione produtos a sua lista de compras!</p>
  </div>`;
            return div;
        }
        const h1Total = criarElementoHtml('h1', ['text-center', 'col-12']);
        h1Total.innerHTML = `Total: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_total)}`;
        div.appendChild(h1Total);
        produtos.map(item => {
            const produto = item.produto;
            // let search = basket.find((x) => x.id === id) || [];
            let precoPorFormatado = formataNumeroEmDinheiro(item.preco_unitario);
            let precoDeFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col-12']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card shadow-sm">
<div class="row g-0">
    <div class="col-sm-4 col-md-2">
        <img height="100" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
    </div>
    <div class="col-sm-8 col-md-10">
        <div class="card-body">
          <h2 class="card-title fs-5">${produto.nome}</h2>
          <p class="card-text fs-6">${produto.descricao}</p>
          <div class="card-footer">
            <h3 class="text-center fs-5">${(produto.preco > item.preco_unitario) ? 'De: R$ ' + precoDeFormatado + ' / Por:' : ''} R$ ${precoPorFormatado}</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center">
            <div class="input-group mb-3">
              <input id="quantidade-${produto.id}" class="form-control" type="number" step="1" min="1" max="100" value="${item.quantidade}" aria-label="Quantidade" />
              <button class="input-group-text botao-atualizar"><i class="bi bi-arrow-clockwise"></i></button>
              <button class="input-group-text botao-remover"><i class="bi bi-x-lg"></i></button>
            </div>
            </form>
          </div>
        </div>
    </div>
</div>`;
            divProduto.querySelector('.botao-atualizar')
                .addEventListener('click', () => this.atualizar(produto));
            divProduto.querySelector('.botao-remover')
                .addEventListener('click', () => this.remover(produto));
            div.appendChild(divProduto);
        });
        return div;
    };

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlListaDeProdutos());
        return main;
    }
}