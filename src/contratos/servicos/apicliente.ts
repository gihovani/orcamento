import {ICliente} from "../entidades/cliente";

export interface IApiCliente {
    salvar(cliente: ICliente): Promise<ICliente>;
    consultar(documento: string): Promise<ICliente>;
}