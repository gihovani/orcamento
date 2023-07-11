export interface IFormulario {
    elemento: HTMLElement;
    mostrar: () => void;
    esconder: () => void;
    preencheDados: (dados: any) => void;
    pegaDados: () => any;
}