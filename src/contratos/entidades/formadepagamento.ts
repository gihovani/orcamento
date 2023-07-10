export interface IFormaDePagamento {
    numero_maximo_parcelas: number;
    valor_minimo_parcela: number;
    parcelamento?: number;
    tipo: string;
}