import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {BarraDeNavegacao} from "./barradenavegacao";
import {CartaoDoProdutoNoCarrinho} from "./componentes/cartaodoprodutonocarrinho";
import {ICartaoDoProdutoNoCarrinho} from "../contratos/componentes/cartaodoprodutonocarrinho";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";

export class ListaDeCompras implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public barraDeNavegacao: BarraDeNavegacao,
        public notificacao: INotificacao
    ) {
    }

    atualizar(cartao: ICartaoDoProdutoNoCarrinho): void {
        const produto = cartao.item.produto;
        const quantidade = cartao.pegaQuantidade();
        this.carrinho.adicionarProduto(produto, quantidade, true);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.id} foi atualizado com sucesso!`, 'success');
        this.htmlListaDeProdutos();
    }

    remover(cartao: ICartaoDoProdutoNoCarrinho): void {
        const produto = cartao.item.produto;
        this.carrinho.removerProduto(produto);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.id} foi removido com sucesso!`, 'success');
        this.barraDeNavegacao.atualizarQuantidadeDeItensNoCarrinho();
        this.htmlListaDeProdutos();
    }

    htmlListaDeProdutosComprados(): HTMLElement {
        const div = criarElementoHtml('div');
        const produtos = this.carrinho.produtos;
        produtos.map(item => {
            const cartao = new CartaoDoProdutoNoCarrinho(div, item);
            cartao.mostrar((event) => {
                event.preventDefault();
                this.atualizar(cartao);
            }, (event) => {
                event.preventDefault();
                this.remover(cartao);
            });
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
            div = criarElementoHtml('div',['lista-de-compras', 'row']);
            div.setAttribute('id', 'lista-de-compras');
        } else {
            div.innerHTML = '';
        }

        const tituloDescricao = new TituloEDescricaoDaPagina(div);
        if (this.carrinho.produtos.length < 1) {
            tituloDescricao.mostrar('Lista de Compras', 'Seu carrinho está vazio!');
            return div;
        } else {
            tituloDescricao.mostrar('Carrinho', 'Seus produtos estão listados abaixo:');
        }

        const h2Total = criarElementoHtml('h2', ['text-center', 'col-md-12', 'col-lg-4', 'mt-4']);
        h2Total.innerHTML = `Total: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_total)}`;
        div.appendChild(h2Total);

        const listaDeProdutosNoCarrinho = criarElementoHtml('div', ['col-md-12', 'col-lg-8']);
        listaDeProdutosNoCarrinho.appendChild(this.htmlListaDeProdutosBrindes());
        listaDeProdutosNoCarrinho.appendChild(this.htmlListaDeProdutosComprados());
        div.appendChild(listaDeProdutosNoCarrinho);
        return div;
    };

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlListaDeProdutos());
        return main;
    }
}