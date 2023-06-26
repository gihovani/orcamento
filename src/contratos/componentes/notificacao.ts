export interface INotificacao {
    elemento: HTMLElement;
    mostrar: (titulo?: string, mensagem?: string, tipo?: string) => void;
    esconder: () => void;
}