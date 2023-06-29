import {ICliente} from "../entidades/cliente";

export interface IDadosDoCliente {
    elemento: HTMLElement;
    mostrar: () => void;
    preencheDados: (cliente: ICliente) => void;
    pegaDados: () => ICliente;
}