import {criarElementoHtml, formataNumeroEmDinheiro} from "../../util/helper";
import {ICarrinhoProduto} from "../../contratos/carrinho";
import {ICartaoDoProdutoNoCarrinho} from "../../contratos/componentes/cartaodoprodutonocarrinho";

export class CartaoDoProdutoNoCarrinho implements ICartaoDoProdutoNoCarrinho {
    readonly ID: string = 'produto-no-carrinho-id-';

    constructor(
        public elemento: HTMLElement,
        public item: ICarrinhoProduto,
    ) {
    }

    public preencheQuantidade(quantidade: number): void {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}quantidade-${produto.id}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');
    }

    public pegaQuantidade(): number {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}quantidade-${produto.id}`) as HTMLInputElement);
        return parseInt(inputQuantidade.value);
    }

    mostrar(eventoAtualizarProduto: (event: Event) => void, eventoRemoverProduto: (event: Event) => void): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const produto = this.item.produto;
        let precoDeFormatado = formataNumeroEmDinheiro(produto.preco);
        let precoPorFormatado = formataNumeroEmDinheiro(this.item.preco_unitario);
        const div = criarElementoHtml('div', ['col-12', 'mb-2']);
        div.setAttribute('id', `${this.ID}${produto.id}`);
        div.innerHTML = `<div class="card shadow-sm">
            <div class="row g-0">
                <div class="col-sm-4 col-md-2">
                    <img height="100" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
                </div>
                <div class="col-sm-8 col-md-10">
                    <div class="card-body">
                        <h2 class="card-title">${produto.nome}</h2>
                        <p class="card-text">${this.item.personalizacao.replace(' | ', '<br/>')}</p>
                        <div class="card-footer">
                            ${`<form class="row row-cols-lg-auto g-3 align-items-center" autocomplete="off">
                                <div class="valor-e-quantidade">
                                    <h3 class="text-center">
                                        ${(produto.preco > this.item.preco_unitario) ? 'De: R$ ' + precoDeFormatado + ' <br/>Por:' : ''} 
                                        R$ ${precoPorFormatado}
                                    </h3>
                                    <input id="${this.ID}quantidade-${produto.id}"
                                        class="form-control" type="number"
                                        step="1" min="1" max="100"
                                        value="${this.item.quantidade}" aria-label="Quantidade" />
                                </div>
                                <div class="mb-3 acoes">
                                    <button class="input-group-text botao-atualizar info sem-estilo">
                                        <i class="bi bi-arrow-clockwise" ></i> Atualizar Valores
                                    </button>
                                    <button class="input-group-text botao-remover danger sem-estilo">
                                        <i class="bi bi-x-lg mr-3" ></i> Remover Item
                                    </button>
                                </div>
                            </form>`}
                        </div>
                    </div>
                </div>
            </div>`;
        div.querySelector('.botao-atualizar')
            .addEventListener('click', eventoAtualizarProduto);
        div.querySelector('.botao-remover')
            .addEventListener('click', eventoRemoverProduto);
        this.elemento.appendChild(div);
    }
}