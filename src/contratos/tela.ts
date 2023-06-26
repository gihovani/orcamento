export abstract class Tela {
    elemento: HTMLElement;
    abstract conteudo(): HTMLElement;
    renderizar() {
        if (this.elemento.firstChild) {
            this.elemento.firstChild.remove();
        }
        this.elemento.appendChild(this.conteudo());
    }
}