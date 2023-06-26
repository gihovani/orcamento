import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IVendedor} from "../contratos/entidades/vendedor";

export class MensagemBoasVindas implements ITela {
    constructor(public vendedor: IVendedor) {}

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.innerHTML = `<form class="bg-body-tertiary p-5 rounded mt-3 mb-3 m-auto">
    <h2>Bem vindo ${this.vendedor?.nome}!</h2>
    <p class="lead">Adicione produtos a sua lista de compras!</p>
  </div>`;
        return main;
    }
}