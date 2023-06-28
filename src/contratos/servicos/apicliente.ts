import {ICliente} from "../entidades/cliente";

export interface IApiCliente {
    dados: ICliente;
    salvar(cliente: ICliente): Promise<ICliente>;
    consultar(documento: string): Promise<ICliente>;
}