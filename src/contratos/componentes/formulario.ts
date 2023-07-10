export interface IFormulario {
    elemento: HTMLElement;
    mostrar: () => void;
    preencheDados: (dados: any) => void;
    pegaDados: () => any;
}