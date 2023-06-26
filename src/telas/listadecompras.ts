import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {Tela} from "../contratos/tela";
import {IProduto} from "../contratos/entidades/produto";

export class ListaDeCompras extends Tela {
    constructor(public elemento: HTMLElement, public carrinho: ICarrinho) {
        super();
    }

    adicionar(produto: IProduto) {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.carrinho.adicionarProduto(produto, quantidade);
        alert(`Produto ${produto.id} foi adicionado com sucesso!`);
        this.carrinho.totalizar(true);
        this.renderizar();
    }

    remover(produto: IProduto) {
        this.carrinho.removerProduto(produto);
        alert(`Produto ${produto.id} foi removido do carrinho!`);
        this.carrinho.totalizar(true);
        this.renderizar();
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
          <h2 class="card-title">${produto.nome}</h2>
          <p class="card-text">${produto.descricao}</p>
          <div class="card-footer">
            <h3 class="text-center">${(produto.preco > item.preco_unitario) ? 'De: R$ ' + precoDeFormatado + ' Por:' : ''}R$ ${precoPorFormatado}</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center">
            <div class="input-group mb-3">
              <input id="quantidade-${produto.id}" class="form-control" type="number" step="1" min="1" max="100" value="1" aria-label="Quantidade" />
              <button class="input-group-text botao-adicionar"><i class="bi bi-plus-lg"></i></button>
              <button class="input-group-text botao-remover"><i class="bi bi-x-lg"></i></button>
            </div>
            </form>
          </div>
        </div>
    </div>
</div>`;
            divProduto.querySelector('.botao-adicionar')
                .addEventListener('click', () => this.adicionar(produto));
            divProduto.querySelector('.botao-remover')
                .addEventListener('click', () => this.remover(produto));
            div.appendChild(divProduto);
        });
        return div;
    };

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div');
        div.appendChild(this.htmlListaDeProdutos());
        return div;
    }
}