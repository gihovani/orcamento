import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IVendedor} from "../contratos/entidades/vendedor";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";

export class MensagemBoasVindas implements ITela {
    constructor(public vendedor: IVendedor) {}

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        const tituloDescricao = new TituloEDescricaoDaPagina(main);
        tituloDescricao.mostrar(`Bem vindo ${this.vendedor?.nome}!`, 'Adicione produtos a sua lista de compras!');
        return main;
    }
}
