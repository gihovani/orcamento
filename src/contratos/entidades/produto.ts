export interface IProduto {
    id: string;
    nome: string;
    preco: number;
    situacao: boolean;
    preco_promocional?: number;
    descricao?: string;
    imagem?: string;
    link?: string;
    categorias?: string;
    marca?: string;
    codigo_barras?: string;
    personalizado?: boolean;
}