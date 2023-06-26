import {IVendedor} from "../entidades/vendedor";

export interface IApiVendedor {
    autenticar(login: string, senha: string): Promise<IVendedor>;
    estaLogado() : boolean;
}