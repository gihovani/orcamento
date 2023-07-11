import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {IApiBin} from "../contratos/servicos/apibin";
import {ICarrinho, ICarrinhoProduto} from "../contratos/carrinho";
import {ICarregando} from "../contratos/componentes/carregando";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {IApiCep} from "../contratos/servicos/apicep";
import {IApiFormasDeEntrega} from "../contratos/servicos/apiformasdeentrega";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";
import {IApiCarrinho} from "../contratos/servicos/apicarrinho";
import {IApiFormasDePagamento} from "../contratos/servicos/apiformasdepagamento";
import {DadosDoCliente} from "./componentes/formularios/dadosdocliente";
import {DadosDaFormasDeEntrega} from "./componentes/formularios/dadosdasformasdeentrega";
import {DadosDaFormasDePagamento} from "./componentes/formularios/dadosdasformasdepagamento";

export class FormularioPagamento implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiCliente: IApiCliente,
        public apiCep: IApiCep,
        public apiFormasDeEntrega: IApiFormasDeEntrega,
        public apiCarrinho: IApiCarrinho,
        public apiFormasDePagamento: IApiFormasDePagamento,
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
            ul.appendChild(this.htmlItemCarrinho(item));
        });
        ul.appendChild(this.htmlDescontos());
        ul.appendChild(this.htmlTotal());
        return ul;
    }

    htmlFormularioDePagamento(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');

        const dadosDoCliente = new DadosDoCliente(form, this.apiCliente, this.notificacao, this.carregando);
        dadosDoCliente.mostrar();
        form.appendChild(criarElementoHtml('hr', ['mb-4']));

        const dadosDasFormasDeEntrega = new DadosDaFormasDeEntrega(form, this.carrinho, this.apiFormasDeEntrega, this.apiCep, this.notificacao, this.carregando);
        dadosDasFormasDeEntrega.mostrar();
        form.appendChild(criarElementoHtml('hr', ['mb-4']));

        const dadosDasFormasDePagamento = new DadosDaFormasDePagamento(form, this.carrinho, this.apiFormasDePagamento, this.apiBin, this.notificacao, this.carregando);
        dadosDasFormasDePagamento.mostrar();
        form.appendChild(criarElementoHtml('hr', ['mb-4']));

        const submit = criarElementoHtml('button', ['btn', 'btn-primary'], [{
            nome: 'type',
            valor: 'submit'
        }], 'SALVAR PEDIDO');
        form.appendChild(submit);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const cliente = dadosDoCliente.pegaDados();
                const entrega = dadosDasFormasDeEntrega.pegaDados();
                const pagamento = dadosDasFormasDePagamento.pegaDados();
                const params = {
                    cliente, entrega, pagamento
                };
                console.log(params);

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
}
