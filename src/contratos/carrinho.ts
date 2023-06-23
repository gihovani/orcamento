import {IProduto} from "./produto";
export interface ICarrinhoTotalizador {
    quantidade_produtos: number;
    valor_total: number;
    valor_subtotal: number;
    valor_desconto: number;
    detalhes_decontos: string[];
}

export interface ICarrinhoProduto {
    quantidade: number;
    preco_unitario: number;
    desconto: number;
    produto: IProduto;
}