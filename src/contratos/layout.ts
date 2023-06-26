import {ITela} from "./tela";
import {criarElementoHtml} from "../util/helper";

export abstract class ILayout implements ITela {
    elemento: HTMLElement;
    abstract cabecalho(): HTMLElement;
    abstract conteudo(): HTMLElement;
    abstract rodape(): HTMLElement;
    renderizar() {
        if (this.elemento.firstChild) {
            this.elemento.firstChild.remove();
        }
        const app = criarElementoHtml('div', ['d-flex', 'flex-column', 'h-100', 'container']);
        app.appendChild(this.cabecalho());
        app.appendChild(this.conteudo());
        app.appendChild(this.rodape());
        this.elemento.appendChild(app);
    }
}