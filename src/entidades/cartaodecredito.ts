import {ICartaoDeCredito} from "../contratos/entidades/cartaodecredito";

export class CartaoDeCredito implements ICartaoDeCredito {
    constructor(
        public parcelamento: number,
        public bandeira: string,
        public nome: string,
        public numero: string,
        public data_expiracao: string,
        public codigo_verificacao: string
    ) {
    }
}