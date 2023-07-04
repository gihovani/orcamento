import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {IApiBin} from "../contratos/servicos/apibin";
import {IApiParcelamento} from "../contratos/servicos/apiparcelamento";
import {ICarrinho, ICarrinhoProduto} from "../contratos/carrinho";
import {ICarregando} from "../contratos/componentes/carregando";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {IApiCep} from "../contratos/servicos/apicep";
import {DadosDoCliente} from "./componentes/dadosdocliente";
import {DadosDoEndereco} from "./componentes/dadosdoendereco";
import {DadosDaFormasDeEntrega} from "./componentes/dadosdasformasdeentrega";
import {IApiFormasDeEntrega} from "../contratos/servicos/apiformasdeentrega";
import {FormaDeEntrega} from "../entidades/formadeentrega";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {IApiCarrinho} from "../contratos/servicos/apicarrinho";

export class FormularioPagamento implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiCliente: IApiCliente,
        public apiCep: IApiCep,
        public apiFormasDeEntregaMagento: IApiFormasDeEntrega,
        public apiCarrinho: IApiCarrinho,
        public apiParcelamento: IApiParcelamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        const div = criarElementoHtml('div', ['container']);
        const tituloDescricao = new TituloEDescricaoDaPagina(div);
        tituloDescricao.mostrar('Dados de Pagamento', 'Os dados abaixo serão os mesmos que aparecerão na nota fiscal.');
        main.appendChild(div);
        const row = criarElementoHtml('div', ['row']);
        row.innerHTML = `
        <div class="col-md-4 order-md-2 mb-4">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Carrinho</span>
                <span class="badge badge-secondary badge-pill">3</span>
            </h4>
            <div id="itens-do-carrinho"></div>
            <form id="formulario-de-codigo-promocional" class="card p-2" onsubmit="alert('ainda nao disponivel!');return false" autocomplete="off">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Código Promocional" id="codigo-promocional">
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-secondary">Aplicar</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-md-8 order-md-1" id="formulario-de-pagamento"></div>`;
        row.querySelector('#itens-do-carrinho').appendChild(this.htmlItensCarrinho());
        row.querySelector('#formulario-de-pagamento').appendChild(this.htmlFormularioDePagamento());
        main.appendChild(row);
        return main;
    }

    private htmlItemCarrinho(item: ICarrinhoProduto): HTMLElement {
        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between']);
        li.innerHTML = `<div>
                        <h6 class="my-0">SKU: ${item.produto.id}</h6>
                        <small class="text-muted">${item.produto.nome}</small>
                    </div>
                    <span class="text-muted text-end">${item.quantidade}x R$ ${formataNumeroEmDinheiro(item.preco_unitario)}</span>`
        return li;
    }

    private htmlDescontos(): HTMLElement {

        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between', 'bg-light']);
        if (!this.carrinho.totalizador?.valor_desconto) {
            return li;
        }

        li.innerHTML = `<div class="text-success">
                        <h6 class="my-0">Descontos</h6>
                        <small>xxxx</small>
                    </div>
                    <span class="text-success">R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador?.valor_desconto)}</span>`;
        return li;
    }

    private htmlTotal(): HTMLElement {
        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between']);
        li.innerHTML = `<span>Total</span>
                    <strong>${formataNumeroEmDinheiro(this.carrinho.totalizador?.valor_total)}</strong>`;
        return li;
    }

    private htmlItensCarrinho(): HTMLElement {
        const ul = criarElementoHtml('ul', ['list-group', 'mb-3', 'sticky-top']);
        this.carrinho.produtos.map(item => {
            ul.append(this.htmlItemCarrinho(item));
        });
        ul.append(this.htmlDescontos());
        ul.append(this.htmlTotal());
        return ul;
    }

    htmlFormularioDePagamento(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');

        const dadosDoCliente = new DadosDoCliente(form, this.apiCliente, this.notificacao, this.carregando);
        dadosDoCliente.mostrar();
        form.append(criarElementoHtml('hr', ['mb-4']));

        const dadosDoEndereco = new DadosDoEndereco(form, this.apiCep, this.notificacao, this.carregando);
        dadosDoEndereco.mostrar();
        const button = criarElementoHtml('button', ['btn', 'btn-secondary'], [{
            nome: 'type',
            valor: 'button'
        }], 'Opções de Entrega');
        form.append(button);
        form.append(criarElementoHtml('hr', ['mb-4']));

        const div = criarElementoHtml('div');
        div.setAttribute('id', 'formas-de-entrega');
        const dadosDasFormasDeEntrega = new DadosDaFormasDeEntrega(div, this.apiFormasDeEntregaMagento, this.notificacao);
        form.append(div);
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const endereco = dadosDoEndereco.pegaDados();
                dadosDasFormasDeEntrega.formasDeEntrega = await this.pegaFormasDeEntrega(endereco.cep);
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        });
        form.append(criarElementoHtml('hr', ['mb-4']));
        const submit = criarElementoHtml('button', ['btn', 'btn-primary'], [{
            nome: 'type',
            valor: 'submit'
        }], 'SALVAR PEDIDO');
        form.append(submit);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const cliente = dadosDoCliente.pegaDados();
                this.apiCarrinho.totalizar().then(carrinho => {
                    const valor_total = carrinho.totalizador.valor_total;
                    this.notificacao.mostrar('Sucesso', `O Pedido do Cliente ${cliente.nome} Foi Retotalizado!`, 'success');
                    if (this.carrinho.totalizador.valor_total === valor_total) {
                        this.notificacao.mostrar('Sucesso', `Os valores batem, seu pedido foi salvo!`, 'success');
                    } else {
                        this.notificacao.mostrar('Erro', `Os valores estão diferentes, seu pedido retotalizado esta R$ ${formataNumeroEmDinheiro(valor_total)}!`, 'warning');
                    }
                })
                    .catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
                this.carregando.esconder();
            }
        });
        return form;
    }

    private async pegaFormasDeEntrega(cep: string) {
        let formasDeEntrega = [];
        const configuracoes = ApiConfiguracoes.instancia();
        if (!configuracoes.offline) {
            this.carregando.mostrar();
            try {
                formasDeEntrega = await this.apiFormasDeEntregaMagento.consultar(cep, this.carrinho);
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        }
        if (configuracoes.retirada_permitida) {
            formasDeEntrega.unshift(new FormaDeEntrega('no_evento', 'No Evento', 'Retirada no Local', 0));
        }
        return formasDeEntrega;
    }
}
