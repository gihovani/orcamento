import {INotificacao} from "../../contratos/componentes/notificacao";
import {criarElementoHtml} from "../../util/helper";

export class Notificacao implements INotificacao {
    readonly ID: string = 'mensagens-de-notificacao';
    constructor(public elemento: HTMLElement) {
    }

    mostrar(titulo?: string, mensagem?: string, tipo?: string) {
        const div = criarElementoHtml('div', ['toast-container', 'position-fixed', 'toast-h-center', 'p-3'], [{nome: 'id', valor: this.ID}]);
        div.innerHTML = `
          <div class="toast show ${tipo}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
              ${mensagem}
            </div>
          </div>`;
        this.elemento.appendChild(div);
        setTimeout(() => {
            this.esconder();
        }, 4000);
    }

    esconder() {
        this.elemento.querySelector(`#${this.ID}`)?.remove();
    }
}
