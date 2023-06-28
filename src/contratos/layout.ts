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
        this.toggleMenu();
    }

    toggleMenu() {
        const button = document.querySelector('button.navbar-toggler');
        button.addEventListener('click', function(e) {
            const menuMobile = document.querySelector(this.getAttribute('data-bs-target'));
            menuMobile.classList.toggle('show');
        })
    }
}