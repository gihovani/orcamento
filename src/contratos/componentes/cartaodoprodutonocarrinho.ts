import {ICarrinhoProduto} from "../carrinho";

export interface ICartaoDoProdutoNoCarrinho {
    item: ICarrinhoProduto;
    elemento: HTMLElement;
    mostrar: (eventoAtualizarProduto: (event: Event) => void, eventoRemoverProduto: (event: Event) => void) => void;
    preencheQuantidade: (quantidade: number) => void;
    pegaQuantidade: () => number;
}