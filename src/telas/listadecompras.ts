import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {IProduto} from "../contratos/entidades/produto";
import {INotificacao} from "../contratos/componentes/notificacao";
import {BarraDeNavegacao} from "./barradenavegacao";

export class ListaDeCompras implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public barraDeNavegacao: BarraDeNavegacao,
        public notificacao: INotificacao
    ) {
    }

    atualizar(produto: IProduto): void {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.carrinho.adicionarProduto(produto, quantidade, true);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.id} foi atualizado com sucesso!`, 'success');
        this.htmlListaDeProdutos();
    }

    remover(produto: IProduto): void {
        this.carrinho.removerProduto(produto);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.id} foi removido com sucesso!`, 'success');
        this.barraDeNavegacao.atualizarQuantidadeDeItensNoCarrinho();
        this.htmlListaDeProdutos();
    }

    htmlListaDeProdutosComprados(): HTMLElement {
        const div = criarElementoHtml('div');
        const produtos = this.carrinho.produtos;
        produtos.map(item => {
            const produto = item.produto;
            let precoPorFormatado = formataNumeroEmDinheiro(item.preco_unitario);
            let precoDeFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col-12', 'mb-2']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card shadow-sm">
            <div class="row g-0">
                <div class="col-sm-4 col-md-2">
                    <img height="100" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
                </div>
                <div class="col-sm-8 col-md-10">
                    <div class="card-body">
                        <h2 class="card-title">${produto.nome}</h2>
                        <p class="card-text">${item.personalizacao.replace(' | ', '<br/>')}</p>
                        
                        <div class="card-footer">
                            ${`<form class="row row-cols-lg-auto g-3 align-items-center" autocomplete="off">
                                <div class="valor-e-quantidade">
                                    <h3 class="text-center">${(produto.preco > item.preco_unitario) ? 'De: R$ ' + precoDeFormatado + ' / Por:' : ''} R$ ${precoPorFormatado}</h3>
                                    <input id="quantidade-${produto.id}" class="form-control" type="number" step="1" min="1" max="100" value="${item.quantidade}" aria-label="Quantidade" />
                                </div>
                                <div class="mb-3 acoes">
                                    <button class="input-group-text botao-atualizar info sem-estilo"><i class="bi bi-arrow-clockwise" ></i> Atualizar Valores</button>
                                    <button class="input-group-text botao-remover danger sem-estilo"><i class="bi bi-x-lg mr-3" ></i> Remover Item</button>
                                </div>
                            </form>`}
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
    }

    htmlListaDeProdutosBrindes(): HTMLElement {
        const div = criarElementoHtml('div');
        const produtos = this.carrinho.brindes;
        produtos.map(produto => {
            const divProduto = criarElementoHtml('div', ['col-12', 'mb-2']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card shadow-sm brinde">
            <div class="row g-0">
                <div class="col-sm-4 col-md-2">
                    <img height="100" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
                </div>
                <div class="col-sm-8 col-md-10">
                    <div class="card-body">
                    <h2 class="card-title">${produto.nome}</h2>
                    <p class="card-text">${produto.descricao}</p>
                    <div class="card-footer">
                        <h3 class="text-center">BRINDE</h3>
                    </div>
                    </div>
                </div>
            </div>`;
            div.appendChild(divProduto);
        });
        return div;
    }

    htmlListaDeProdutos(): HTMLElement {
        let div = document.getElementById('lista-de-compras');
        if (!div) {
            div = criarElementoHtml(
                'div',
                ['lista-de-compras', 'row'],
                [{nome: 'id', valor: 'lista-de-compras'}]
            );
        } else {
            div.innerHTML = '';
        }
        if (this.carrinho.produtos.length < 1) {
            div.innerHTML = `<div class="bg-body-tertiary p-2 rounded mt-3">
                <h2>Seu carrinho de compras está vazio.</h2>
                <p class="lead">Adicione produtos a sua lista de compras!</p>
            </div>`;
            return div;
        } else {
            div.innerHTML = `<div class="p-5 rounded mt-3">
                <h2>Carrinho</h2>
                <p class="lead">Seus produtos estão listados abaixo:</p>
            </div>`;
        }

        const h2Total = criarElementoHtml('h2', ['text-center', 'col-md-12', 'col-lg-4', 'mt-4']);
        const listaProdutosCarrinho = criarElementoHtml('div', ['col-md-12', 'col-lg-8']);
        h2Total.innerHTML = `Total: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_total)}`;
        listaProdutosCarrinho.appendChild(this.htmlListaDeProdutosBrindes());
        listaProdutosCarrinho.appendChild(this.htmlListaDeProdutosComprados());
        div.appendChild(listaProdutosCarrinho)
        div.appendChild(h2Total);

        return div;
    };

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlListaDeProdutos());
        return main;
    }
}