import {ITela} from "./tela";
import {criarElementoHtml} from "../util/helper";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

export abstract class ILayout implements ITela {
    elemento: HTMLElement;
    abstract cabecalho(): HTMLElement;
    abstract conteudo(): HTMLElement;
    abstract rodape(): HTMLElement;
    renderizar(): void {
        if (this.elemento.firstChild) {
            this.elemento.firstChild.remove();
        }
        const app = criarElementoHtml('div', ['d-flex', 'flex-column', 'h-100', 'container']);
        app.appendChild(this.cabecalho());
        app.appendChild(this.conteudo());
        app.appendChild(this.rodape());
        this.ajustarTema();
        this.elemento.appendChild(app);
    }

    private ajustarTema(): void {
        const config = ApiConfiguracoes.instancia().loja;
        const link_css = document.getElementById('tema-css');
        if (link_css && link_css.getAttribute('href') !== config.estilos) {
            const body = document.querySelector('body');
            const nome_tema_antigo = this.pegaNomeDoTema(link_css.getAttribute('href'));
            body.classList.remove(nome_tema_antigo);
            body.classList.add(this.pegaNomeDoTema(config.estilos));

            link_css.setAttribute('href', config.estilos);
        }
    }

    private pegaNomeDoTema(estilo_css: string): string {
        return estilo_css.split(/[\\/]/g).pop().split('.')[0];
    }
}