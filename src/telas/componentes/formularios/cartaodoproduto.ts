import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {IProduto} from "../../../contratos/entidades/produto";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class CartaoDoProduto implements IFormulario {
    readonly ID: string = 'produto-id';

    constructor(
        public elemento: HTMLElement,
        public produto: IProduto,
        public eventoAdicionarProduto: (event: CustomEvent) => void,
        public eventoProdutosSimilares: (event: CustomEvent) => void
    ) {
    }

    preencheDados(quantidade: number): void {
        const produto = this.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.sku}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');

        const divProduto = (this.elemento.querySelector(`#${this.ID}-${produto.sku} .card`) as HTMLDivElement);
        divProduto.querySelector('.label-item-adicionado')?.remove();
        divProduto.appendChild(this.seloProdutoAdicionado());
    }

    pegaDados(): number {
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${this.produto.sku}`) as HTMLInputElement);
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
        div.setAttribute('id', `${this.ID}-${produto.sku}`);
        div.innerHTML = `
<div class="card">
    <figure class="figure">
        <img height="200" width="200" src="${produto.imagem}" alt="${produto.nome}" loading="lazy" class="figure-img card-img-top img-fluid" />
        <figcaption class="figure-caption">${produto.marca}</figcaption>
    </figure>
    <div class="card-body">
        <h2 class="card-title">${produto.nome}</h2>
        <p class="card-text">SKU: ${produto.sku}<br />${produto.descricao}</p>
        <div class="card-footer">
            <h3 class="price text-end">R$ ${precoFormatado}</h3>
            <form class="row row-cols-lg-auto g-3 align-items-center needs-validation" autocomplete="off">
                <div class="linha-acao mb-3">
                    <input id="${this.ID}-quantidade-${produto.sku}"
                    type="number" step="1" min="1" max="100"
                    aria-label="Quantidade" class="form-control ${produto.situacao ? '' : 'disabled'}"
                    value="1" required />
                    <button type="submit" class="input-group-text botao-adicionar ${produto.situacao ? '' : 'disabled'}">
                        ${produto.situacao ? 'Adicionar' : 'Esgotado :('}
                    </button>
                </div>
            </form>
            <div class="btn-group w-100" role="group" aria-label="Mais informações:">
              <a href="#${produto.agrupador}" class="btn btn-sm btn-outline-warning botao-similares">+ similares</a>
              <a rel="external" target="_blank" href="${produto.link}" class="btn btn-sm btn-outline-info">- site</a>
            </div>
        </div>
    </div>
</div>`;
        div.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.eventoAdicionarProduto(new CustomEvent('botao-adicionar', {detail: this}));
        });
        div.querySelector('.botao-similares').addEventListener('click', (event) => {
            event.preventDefault();
            this.eventoProdutosSimilares(new CustomEvent('botao-similares', {detail: this}));
        });
        div.querySelector('img').addEventListener('error', (event) => {
            (event.target as HTMLImageElement).src = 'dist/assets/img/placeholder.webp';
        });
        this.elemento.appendChild(div);
    }
}