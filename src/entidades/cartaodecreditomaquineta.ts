import {ICartaoDeCreditoMaquineta} from "../contratos/entidades/cartaodecreditomaquineta";

export class CartaoDeCreditoMaquineta implements ICartaoDeCreditoMaquineta {
    constructor(
        public parcelamento: number,
        public bandeira: string,
        public codigo_nsu: string,
        public codigo_autorizacao: string
    ) {
    }
}