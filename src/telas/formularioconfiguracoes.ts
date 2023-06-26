import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IConfiguracoes} from "../contratos/entidades/configuracoes";
import {IApiProduto} from "../contratos/servicos/apiproduto";

export class FormularioConfiguracoes implements ITela {
    constructor(public configuracoes: IConfiguracoes, public apiProduto: IApiProduto) {}

    public pegaDadosDoFormulario(form: HTMLFormElement): IConfiguracoes {
        this.configuracoes.url_google_merchant = (form.querySelector('#url_google_merchant') as HTMLInputElement)?.value;
        this.configuracoes.nome_loja = (form.querySelector('#nome_loja') as HTMLInputElement)?.value;
        this.configuracoes.versao = (form.querySelector('#versao') as HTMLInputElement)?.value;
        return this.configuracoes;
    }

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div', ['row']);
        div.innerHTML = `
            <form class="bg-body-tertiary p-5 rounded mt-3 m-auto">
                <h1 class="h3 mb-3 fw-normal">Configurações do Sistema</h1>
                <div class="mb-3">
                    <label class="form-label" for="url_google_merchant">URL Google Merchant</label>
                    <input class="form-control" type="text" id="url_google_merchant" value="${this.configuracoes.url_google_merchant}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="nome_loja">Nome da Loja</label>
                    <input class="form-control" type="text" id="nome_loja" value="${this.configuracoes.nome_loja}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="versao">Versão</label>
                    <input class="form-control" type="text" id="versao" maxlength="10" value="${this.configuracoes.versao}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const form = div.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.pegaDadosDoFormulario(form);
            this.apiProduto.listar(true).then(() => {
                alert('Suas Confiruações Foram Atualizadas!');
                document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
            });
        });
        return div;
    }
}