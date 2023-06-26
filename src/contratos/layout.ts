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
        const div = criarElementoHtml('div');
        div.appendChild(this.cabecalho());
        div.appendChild(this.conteudo());
        div.appendChild(this.rodape());
        this.elemento.appendChild(div);
    }
}