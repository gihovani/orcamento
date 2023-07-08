import {IFormaDePagamento} from "../contratos/entidades/formadepagamento";

export class Boleto implements IFormaDePagamento {
    tipo: string = 'Boleto';

    constructor(public parcelamento: number) {
    }
}

export class CartaoDeCredito implements IFormaDePagamento {
    tipo: string = 'Cartão De Crédito';

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

export class CartaoDeCreditoMaquineta implements IFormaDePagamento {
    tipo: string = 'Cartão Maquineta';

    constructor(
        public parcelamento: number,
        public bandeira: string,
        public codigo_nsu: string,
        public codigo_autorizacao: string
    ) {
    }
}