import {IBoletoParcelado} from "../contratos/entidades/boletoparcelado";

export class BoletoParcelado implements IBoletoParcelado {
    constructor(public parcelamento: number) {
    }
}