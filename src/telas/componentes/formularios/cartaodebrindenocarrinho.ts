import {criarElementoHtml} from "../../../util/helper";
import {IFormulario} from "../../../contratos/componentes/formulario";
import {ICarrinhoProduto} from "../../../contratos/carrinho";

export class CartaoDeBrindeNoCarrinho implements IFormulario {
    readonly ID: string = 'brinde-no-carrinho-id';

    constructor(
        public elemento: HTMLElement,
        public item: ICarrinhoProduto
    ) {
    }

    preencheDados(quantidade: number): void {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.sku}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');
    }

    pegaDados(): number {
        const produto = this.item.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}-quantidade-${produto.sku}`) as HTMLInputElement);
        return parseInt(inputQuantidade.value);
    }

    esconder(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
    }

    mostrar(): void {
        this.esconder();
        const produto = this.item.produto;
        const div = criarElementoHtml('div', ['col-12', 'mb-2']);
        div.setAttribute('id', `${this.ID}-${produto.sku}`);
        div.innerHTML = `<div class="card shadow-sm brinde">
    <div class="row g-0">
        <div class="col-sm-4 col-md-2">
            <figure class="figure">
                <img height="100" width="100" src="${produto.imagem}" alt="${produto.nome}" loading="lazy" class="figure-img card-img-top img-fluid" />
            </figure>
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
    </div>
</div>`;
        div.querySelector('img').addEventListener('error', (event) => {
            (event.target as HTMLImageElement).src = 'dist/assets/img/placeholder.webp';
        });
        this.elemento.appendChild(div);
    }
}