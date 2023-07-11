import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {IProduto} from "../../../contratos/entidades/produto";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class CartaoDoProduto implements IFormulario {
    readonly ID: string = 'produto-id';

    constructor(
        public elemento: HTMLElement,
        public produto: IProduto,
        public eventoAdicionarProduto: (event: CustomEvent) => void
    ) {
    }

    preencheDados(quantidade: number): void {
        const produto = this.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.id}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');

        const divProduto = (this.elemento.querySelector(`#${this.ID}-${produto.id} .card`) as HTMLDivElement);
        divProduto.querySelector('.label-item-adicionado')?.remove();
        divProduto.appendChild(this.seloProdutoAdicionado());
    }

    pegaDados(): number {
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${this.produto.id}`) as HTMLInputElement);
        return parseInt(inputQuantidade.value);
    }

    private seloProdutoAdicionado(): HTMLElement {
        return criarElementoHtml('span', ['label-item-adicionado'], [], 'Adicionado ao carrinho');
    }

    esconder(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
    }

    mostrar(): void {
        this.esconder();
        const produto = this.produto;
        let precoFormatado = formataNumeroEmDinheiro(produto.preco);
        const div = criarElementoHtml('div', ['col']);
        div.setAttribute('id', `${this.ID}-${produto.id}`);
        div.innerHTML = `
<div class="card">
    <img height="200" width="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
    <div class="card-body">
        <h2 class="card-title">${produto.nome}</h2>
        <p class="card-text">SKU: ${produto.id}<br />${produto.descricao}</p>
        <div class="card-footer">
            <h3 class="price text-end">R$ ${precoFormatado}</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center needs-validation" autocomplete="off">
                <div class="linha-acao mb-3">
                    <input id="${this.ID}-quantidade-${produto.id}"
                    type="number" step="1" min="1" max="100"
                    aria-label="Quantidade" class="form-control ${produto.situacao ? '' : 'disabled'}"
                    value="1" required />
                    <button type="submit" class="input-group-text botao-adicionar ${produto.situacao ? '' : 'disabled'}">
                        ${produto.situacao ? 'Adicionar' : 'Esgotado :('}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>`;
        div.querySelector('form')
            .addEventListener('submit', (event) => {
                event.preventDefault();
                this.eventoAdicionarProduto(new CustomEvent('botao-adicionar', {detail: this}));
            });
        this.elemento.appendChild(div);
    }
}