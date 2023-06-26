import {IVendedor} from "../contratos/entidades/vendedor";

export class Vendedor implements IVendedor {
    constructor(public nome: string, public login: string, public senha?: string, public estaAtivo?: boolean) {}
}
