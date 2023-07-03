export interface ITituloEDescricaoDaPagina {
    elemento: HTMLElement;
    mostrar: (titulo: string, descricao?: string) => void;
    esconder: () => void;
}