import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {BarraDeNavegacao} from "./barradenavegacao";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";
import {CartaoDoProdutoNoCarrinho} from "./componentes/formularios/cartaodoprodutonocarrinho";
import {CartaoDeBrindeNoCarrinho} from "./componentes/formularios/cartaodebrindenocarrinho";

export class ListaDeCompras implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public barraDeNavegacao: BarraDeNavegacao,
        public notificacao: INotificacao
    ) {
    }

    private atualizar(event: CustomEvent): void {
        const cartao = (event.detail as CartaoDoProdutoNoCarrinho);
        const produto = cartao.item.produto;
        const quantidade = cartao.pegaDados();
        this.carrinho.adicionarProduto(produto, quantidade, true);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.sku} foi atualizado com sucesso!`, 'success');
        this.htmlListaDeProdutos();
    }

    private remover(event: CustomEvent): void {
        const cartao = (event.detail as CartaoDoProdutoNoCarrinho);
        const produto = cartao.item.produto;
        this.carrinho.removerProduto(produto);
        this.notificacao.mostrar('Sucesso', `Produto ${produto.sku} foi removido com sucesso!`, 'success');
        this.barraDeNavegacao.atualizarQuantidadeDeItensNoCarrinho();
        this.htmlListaDeProdutos();
    }

    private htmlListaDeProdutosComprados(): HTMLElement {
        const div = criarElementoHtml('div');
        const produtos = this.carrinho.produtos;
        produtos.map(item => {
            const cartao = new CartaoDoProdutoNoCarrinho(div, item, (event: CustomEvent) => {
                this.atualizar(event);
            }, (event: CustomEvent) => {
                this.remover(event);
            });
            cartao.mostrar();
        });
        return div;
    }

    private htmlListaDeProdutosBrindes(): HTMLElement {
        const div = criarElementoHtml('div');
        const produtos = this.carrinho.brindes;
        produtos.map(item => {
            const cartao = new CartaoDeBrindeNoCarrinho(div, item);
            cartao.mostrar();
        });
        return div;
    }

    private htmlListaDeProdutos(): HTMLElement {
        let div = document.getElementById('lista-de-compras');
        if (div) {
            div.innerHTML = '';
        } else {
            div = criarElementoHtml('div', ['lista-de-compras', 'row']);
            div.setAttribute('id', 'lista-de-compras');
        }

        const tituloDescricao = new TituloEDescricaoDaPagina(div);
        if (this.carrinho.produtos.length < 1) {
            tituloDescricao.mostrar('Lista de Compras', 'Seu carrinho está vazio!');
            return div;
        }

        tituloDescricao.mostrar('Carrinho', 'Seus produtos estão listados abaixo:');
        const total = criarElementoHtml('div', ['text-end', 'col-md-12', 'col-lg-4', 'mt-4']);
        const h2Subtotal = criarElementoHtml('h2', ['h3']);
        h2Subtotal.innerHTML = `Subtotal: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_total)}`;
        total.appendChild(h2Subtotal);

        const h2Descontos = criarElementoHtml('h2', ['h3']);
        h2Descontos.innerHTML = `Descontos: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_desconto)}`;
        total.appendChild(h2Descontos);

        const h2Total = criarElementoHtml('h2', ['h2']);
        h2Total.innerHTML = `Total: R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador.valor_total)}`;
        total.appendChild(h2Total);
        div.appendChild(total);

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