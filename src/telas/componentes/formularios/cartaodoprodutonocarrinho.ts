import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {ICarrinhoProduto} from "../../../contratos/carrinho";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class CartaoDoProdutoNoCarrinho implements IFormulario {
    readonly ID: string = 'produto-no-carrinho-id';

    constructor(
        public elemento: HTMLElement,
        public item: ICarrinhoProduto,
        public eventoAtualizarProduto: (event: CustomEvent) => void,
        public eventoRemoverProduto: (event: CustomEvent) => void
    ) {
    }

    preencheDados(quantidade: number): void {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.id}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');
    }

    pegaDados(): number {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.id}`) as HTMLInputElement);
        return parseInt(inputQuantidade.value);
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const produto = this.item.produto;
        let precoDeFormatado = formataNumeroEmDinheiro(produto.preco);
        let precoPorFormatado = formataNumeroEmDinheiro(this.item.preco_unitario);
        const div = criarElementoHtml('div', ['col-12', 'mb-2']);
        div.setAttribute('id', `${this.ID}-${produto.id}`);
        div.innerHTML = `
<div class="card shadow-sm">
    <div class="row g-0">
        <div class="col-sm-4 col-md-2">
            <img height="100" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
        </div>
        <div class="col-sm-8 col-md-10">
            <div class="card-body">
                <h2 class="card-title">${produto.nome}</h2>
                <p class="card-text">${this.item.personalizacao.replace(' | ', '<br/>')}</p>
                <div class="card-footer">
                    <form class="row row-cols-lg-auto g-3 align-items-center needs-validation" autocomplete="off">
                        <div class="valor-e-quantidade">
                            <h3 class="text-end h5">
                                ${(produto.preco > this.item.preco_unitario) ? 'De: R$ ' + precoDeFormatado + ' <br/>Por:' : ''} 
                                R$ ${precoPorFormatado}
                            </h3>
                            <input id="${this.ID}-quantidade-${produto.id}"
                            class="form-control" type="number"
                            step="1" min="1" max="100"
                            value="${this.item.quantidade}" aria-label="Quantidade" required />
                        </div>
                        <div class="mb-3 acoes">
                            <button type="submit" class="input-group-text botao-atualizar info sem-estilo">
                                <i class="bi bi-arrow-clockwise" ></i> Atualizar Valores
                            </button>
                            <button class="input-group-text botao-remover danger sem-estilo">
                                <i class="bi bi-x-lg mr-3" ></i> Remover Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>`;
        div.querySelector('form')
            .addEventListener('submit', (event) => {
                event.preventDefault();
                this.eventoAtualizarProduto(new CustomEvent('botao-atualizar', {detail: this}));
            });
        div.querySelector('.botao-remover')
            .addEventListener('click', (event) => {
                event.preventDefault();
                this.eventoRemoverProduto(new CustomEvent('botao-remover', {detail: this}));
            });
        this.elemento.appendChild(div);
    }
}