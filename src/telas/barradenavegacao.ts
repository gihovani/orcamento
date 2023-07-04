import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {ICarrinho} from "../contratos/carrinho";

export class BarraDeNavegacao implements ITela {
    private menus: HTMLElement[] = [];
    private nav = criarElementoHtml('nav', ['navbar', 'navbar-expand-lg', 'bg-body-tertiary', 'row']);

    constructor(readonly carrinho: ICarrinho) {
    }

    adicionaMenu(id: string, titulo: string, callback: () => void): void {
        const a = criarElementoHtml('a', ['nav-link'], [{nome: 'href', valor: '#'}], titulo);
        this.adicionaEventoNoMenu(a, callback);
        const li = criarElementoHtml('li', ['nav-item', `item-${id}`], [{nome: 'id', valor: id}]);
        li.appendChild(a);
        this.menus.push(li);
    };

    private adicionaEventoNoMenu(a: HTMLElement, callback: () => void): void {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            this.nav.querySelector('.active')?.classList.remove('active');
            (e.target as HTMLElement).classList.add('active');
            callback();
            document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
        });
    }

    conteudo(): HTMLElement {
        const titulo = ApiConfiguracoes.instancia().loja.titulo;
        this.nav.innerHTML = `<div class="container">
        <a class="navbar-brand" href="#" id="nome-da-loja">${titulo}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav nav-underline nav-justified w-100"></ul>
        </div>
    </div>`;
        const ul = this.nav.querySelector('#navbarSupportedContent ul');
        for (const menu of this.menus) {
            ul.appendChild(menu);
        }
        this.mostraEscondeMenu();
        this.atualizarQuantidadeDeItensNoCarrinho();
        return this.nav;
    }

    private mostraEscondeMenu(): void {
        const button = this.nav.querySelector('button.navbar-toggler');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const menuMobile = this.nav.querySelector(button.getAttribute('data-bs-target'));
            menuMobile.classList.toggle('show');
        });
    }

    atualizarQuantidadeDeItensNoCarrinho(): void {
        const menuCarrinho = this.nav.querySelector('#menu-carrinho');
        if (!menuCarrinho) {
            return;
        }
        const span = criarElementoHtml(
            'span',
            ['label-quantidade'],
            [],
            String(this.carrinho.produtos.length)
        );
        menuCarrinho.querySelector('.label-quantidade')?.remove();
        menuCarrinho.appendChild(span);
    }
}