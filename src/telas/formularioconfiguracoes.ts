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
        const main = criarElementoHtml('main');
        main.innerHTML = `
            <form class="p-5 rounded mt-3 mb-3 row" autocomplete="off">
                <h1 class="h3 mb-3 fw-normal">Configurações do Sistema</h1>
                <div class="mb-3 col-6">
                    <label class="form-label" for="loja">Loja</label>
                    <select id="loja" class="form-select"></select>
                </div>
                <div class="mb-3 col-6">
                    <label class="form-label" for="versao">Versão</label>
                    <input class="form-control" type="text" id="versao" maxlength="10" value="${this._configuracoes.versao}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const seletorLoja = main.querySelector('#loja');
        const lojaSelecionada = this._configuracoes.loja;
        this._configuracoes.disponiveis().forEach((loja, index) => {
            const atributos = [{
                nome: 'value', valor: String(index)
            }, {
                nome: 'label', valor: loja.titulo
            }];
            const options = criarElementoHtml('option', [], atributos);
            if (lojaSelecionada.titulo === loja.titulo) {
                options.setAttribute('selected', 'selected')
            }
            seletorLoja.appendChild(options);
        });

        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                this.pegaDadosDoFormulario(form);

                this.apiProduto.listar(true).then(() => {
                    this.notificacao.mostrar('Sucesso', 'Suas Confiruações Foram Atualizadas!', 'success');
                }).finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', `Não foi possivel salvar a configuração! ${error}`, 'danger');
                this.carregando.esconder();
            }
        });
        return main;
    }
}