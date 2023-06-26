export abstract class Tela {
    elemento: HTMLElement;
    abstract html(): HTMLElement;
    renderizar() {
        if (this.elemento.firstChild) {
            this.elemento.firstChild.remove();
        }
        this.elemento.appendChild(this.html());
    }
}