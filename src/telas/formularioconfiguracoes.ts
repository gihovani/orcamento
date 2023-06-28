import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {INotificacao} from "../contratos/componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {IApiConfiguracoes} from "../contratos/servicos/apiconfiguracoes";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

export class FormularioConfiguracoes implements ITela {
    private _configuracoes: IApiConfiguracoes;

    constructor(
        public apiProduto: IApiProduto,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        this._configuracoes = ApiConfiguracoes.instancia();
    }

    public pegaDadosDoFormulario(form: HTMLFormElement): IApiConfiguracoes {
        const lojaSelecionada = (form.querySelector('#loja') as HTMLInputElement)?.value
        this._configuracoes.loja = this._configuracoes.disponiveis()[lojaSelecionada];
        this._configuracoes.versao = (form.querySelector('#versao') as HTMLInputElement)?.value;
        return this._configuracoes;
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `
            <form class="bg-body-tertiary p-5 rounded mt-3 mb-3 m-auto">
                <h1 class="h3 mb-3 fw-normal">Configurações do Sistema</h1>
                <div class="mb-3">
                    <label class="form-label" for="loja">Loja</label>
                    <select id="loja" class="form-select"></select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="versao">Versão</label>
                    <input class="form-control" type="text" id="versao" maxlength="10" value="${this._configuracoes.versao}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const seletorLoja = main.querySelector('#loja');
        this._configuracoes.disponiveis().forEach((loja, index) => {
            const options = criarElementoHtml('option', [], [{
                nome: 'value', valor: String(index)
            }, {
                nome: 'label', valor: loja.titulo
            }]);
            seletorLoja.appendChild(options)
        });

        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.pegaDadosDoFormulario(form);
            this.carregando.mostrar();
            this.apiProduto.listar(true).then(() => {
                this.notificacao.mostrar('Sucesso', 'Suas Confiruações Foram Atualizadas!');
            }).finally(() => this.carregando.esconder());
        });
        return main;
    }
}