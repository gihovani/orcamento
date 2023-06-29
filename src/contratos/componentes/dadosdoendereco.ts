import {IEndereco} from "../entidades/endereco";

export interface IDadosDoEndereco {
    elemento: HTMLElement;
    mostrar: () => void;
    preencheDados: (cliente: IEndereco) => void;
    pegaDados: () => IEndereco;
}