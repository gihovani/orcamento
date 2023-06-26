import {INotificacao} from "../../contratos/componentes/notificacao";
import {criarElementoHtml} from "../../util/helper";

export class Notificacao implements INotificacao {
    readonly ID: string = 'mensagens-de-notificacao';
    constructor(public elemento: HTMLElement) {
    }

    mostrar(titulo?: string, mensagem?: string, tipo?: string) {
        const div = criarElementoHtml('div', ['toast-container', 'position-fixed', 'top-0', 'end-0', 'p-3'], [{nome: 'id', valor: this.ID}]);
        div.innerHTML = `
  <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">${titulo}</strong>
      <small>1 sec ago</small>
    </div>
    <div class="toast-body">
      ${mensagem}
    </div>
  </div>`;
        this.elemento.appendChild(div);
        setTimeout(() => {
            this.esconder();
        }, 3000);
    }

    esconder() {
        const div = this.elemento.querySelector(`#${this.ID}`);
        if (div) {
            div.remove();
        }
    }
}
