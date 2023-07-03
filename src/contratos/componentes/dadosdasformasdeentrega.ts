import {IFormaDeEntrega} from "../entidades/formadeentrega";

export interface IDadosDaFormasDeEntrega {
    elemento: HTMLElement;
    formasDeEntrega: IFormaDeEntrega[];
    mostrar: () => void;
    preencheDados: (formaDeEntrega: IFormaDeEntrega) => void;
    pegaDados: () => IFormaDeEntrega;
}
