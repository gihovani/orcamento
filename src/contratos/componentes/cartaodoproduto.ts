import {IProduto} from "../entidades/produto";

export interface ICartaoDoProduto {
    produto: IProduto;
    elemento: HTMLElement;
    mostrar: (eventoAdicionarProduto: (event: Event) => void) => void;
    preencheQuantidade: (quantidade: number) => void;
    pegaQuantidade: () => number;
}