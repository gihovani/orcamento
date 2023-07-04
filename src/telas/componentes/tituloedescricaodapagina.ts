import {criarElementoHtml} from "../../util/helper";
import {ITituloEDescricaoDaPagina} from "../../contratos/componentes/tituloedescricaodapagina";

export class TituloEDescricaoDaPagina implements ITituloEDescricaoDaPagina {
    readonly ID: string = 'titulo-e-descricao-da-pagina';

    constructor(public elemento: HTMLElement) {
    }

    mostrar(titulo: string, descricao?: string): void {
        const div = criarElementoHtml('div', ['bg-body-tertiary', 'p-3', 'rounded', 'mt-3', 'mb-3']);
        div.setAttribute('id', this.ID);
        div.innerHTML = `<h2>${titulo}</h2>${descricao ? '<p class="lead">' + descricao + '</p>' : ''}`;
        this.elemento.appendChild(div);
    }

    esconder(): void {
        this.elemento.querySelector(`#${this.ID}`)?.remove();
    }
}
