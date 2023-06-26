import {Tela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IApiVendedor} from "../contratos/servicos/apivendedor";

export class FormularioLogin extends Tela {
    constructor(public elemento: HTMLElement, public apiVendedor: IApiVendedor) {
        super();
    }

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div', ['row']);
        div.innerHTML = `<form class="col-12">
    <h1 class="h3 mb-3 fw-normal">Por Favor Faça o Login</h1>
    <div class="form-floating">
      <input type="text" class="form-control" id="login" placeholder="Login">
      <label for="login">Login</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="senha" placeholder="Senha">
      <label for="senha">Senha</label>
    </div>

    <div class="form-check text-start my-3">
      <input class="form-check-input" type="checkbox" value="lembrar-senha" id="lembrar-senha">
      <label class="form-check-label" for="lembrar-senha">Salvar senha</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">ENTRAR</button>
  </form>`;
        const form = div.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = (form.querySelector('#login') as HTMLInputElement)?.value;
            const senha = (form.querySelector('#senha') as HTMLInputElement)?.value;
            if (login.length && senha.length) {
                this.apiVendedor.autenticar(login, senha).then((vendedor) => {
                    this.elemento.dispatchEvent(new CustomEvent('autenticacao',  { detail: vendedor }));
                });
            }
        });
        return div;
    }
}