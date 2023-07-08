import {criarElementoHtml, formataNumeroEmDinheiro} from "../../util/helper";
import {IProduto} from "../../contratos/entidades/produto";
import {ICartaoDoProduto} from "../../contratos/componentes/cartaodoproduto";

export class CartaoDoProduto implements ICartaoDoProduto {
    readonly ID: string = 'produto-id-';

    constructor(
        public elemento: HTMLElement,
        public produto: IProduto,
    ) {
    }

    public preencheQuantidade(quantidade: number): void {
        const produto = this.produto;
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}quantidade-${produto.id}`) as HTMLInputElement);
        inputQuantidade.value = String(quantidade ?? '1');

        const divProduto = (this.elemento.querySelector(`#produto-id-${produto.id} .card`) as HTMLDivElement);
        divProduto.querySelector('.label-item-adicionado')?.remove();
        divProduto.appendChild(this.seloProdutoAdicionado());
    }

    public pegaQuantidade(): number {
        const inputQuantidade = (this.elemento.querySelector(`#${this.ID}quantidade-${this.produto.id}`) as HTMLInputElement);
        return parseInt(inputQuantidade.value);
    }

    private seloProdutoAdicionado(): HTMLElement {
        return criarElementoHtml('span', ['label-item-adicionado'], [], 'Adicionado ao carrinho');
    }

    mostrar(eventoAdicionarProduto: (event: Event) => void): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const produto = this.produto;
        let precoFormatado = formataNumeroEmDinheiro(produto.preco);
        const div = criarElementoHtml('div', ['col']);
        div.setAttribute('id', `${this.ID}${produto.id}`);
        div.innerHTML = `<div class="card">
        <img height="200" width="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
        <div class="card-body">
          <h2 class="card-title">${produto.nome}</h2>
          <p class="card-text">
            SKU: ${produto.id}<br/>${produto.descricao}
          </p>
          <div class="card-footer">
            <h3 class="price text-end">R$ ${precoFormatado} </h3>
            <form class="row row-cols-lg-auto g-3 align-items-center" autocomplete="off">
                <div class="linha-acao mb-3">
                    <input id="${this.ID}quantidade-${produto.id}"
                        type="number" step="1" min="1" max="100"
                        aria-label="Quantidade" class="form-control ${produto.situacao ? '' : 'disabled'}"
                        value="1" />
                    <button class="input-group-text botao-adicionar ${produto.situacao ? '' : 'disabled'}">
                        ${produto.situacao ? 'Adicionar' : 'Esgotado :('}
                    </button>
                </div>
            </form>
          </div>
        </div>
    </div>`;
        div.querySelector('.botao-adicionar')
            .addEventListener('click', eventoAdicionarProduto);
        this.elemento.appendChild(div);
    }
}