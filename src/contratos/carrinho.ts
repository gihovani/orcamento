import {IProduto} from "./entidades/produto";
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
    e_brinde: boolean;
}

export interface ICarrinho {
    produtos: ICarrinhoProduto[];
    promocoes: IRegraPromocional[];
    totalizador: ICarrinhoTotalizador;
    adicionarProduto: (produto: IProduto, quantidade?: number, update?: boolean) => void;
    removerProduto: (produto: IProduto) => void;
    aplicarPromocoes: () => void;
    totalizar: (calcular_promocoes: boolean) => void;
}