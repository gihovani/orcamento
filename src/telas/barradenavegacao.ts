import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";

export class BarraDeNavegacao implements ITela {
    private menus: HTMLElement[] = [];

    adicionaMenu(titulo: string, callback: () => void) {
        const a = criarElementoHtml('a', ['nav-link'], [{nome: 'href', valor: '#'}], titulo);
        a.addEventListener('click', callback);
        const li = criarElementoHtml('li', ['nav-item']);
        li.appendChild(a);
        this.menus.push(li);
    };

    conteudo(): HTMLElement {
        const nav = criarElementoHtml('nav', ['navbar', 'navbar-expand-lg', 'bg-body-tertiary']);
        nav.innerHTML = `<div class="container">
        <a class="navbar-brand" href="#">Loja do GG2</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
        </div>
    </div>`;
        const ul = nav.querySelector('#navbarSupportedContent ul');
        for (const menu of this.menus) {
            ul.appendChild(menu);
        }
        return nav;
    }
}