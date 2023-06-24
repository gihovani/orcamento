import {IProduto} from "./produto";
import {IRegraPromocional} from "./regrapromocional";

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

export interface ICarrinho {
    produtos: ICarrinhoProduto[];
    promocoes: IRegraPromocional[];
    totalizador: ICarrinhoTotalizador;
    adicionarProduto: (produto: IProduto, quantidade?: number) => void;
    removerProduto: (produto: IProduto) => void;
    aplicarPromocoes: () => void;
    totalizar: () => void;
}