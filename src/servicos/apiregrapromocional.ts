import {IRegraPromocional} from "../contratos/regrapromocional";
import {lerArquivoApartirDeUmLink, transformaDinheiroEmNumero} from "../util/helper";
import {IApiRegraPromocional} from "../contratos/servicos/apiregrapromocional";
import {RegraPromocional} from "../entidades/regrapromocional";
import {Produto} from "../entidades/produto";

interface RegraCsv {
    salesrule_id: string;
    prioridade: string;
    tipo_regra: 'desconto_porcentagem' | 'desconto_fixo' | 'valor_unitario' | 'brinde_unico';
    descricao: string;
    atributo: 'id' | 'categorias' | 'marca';
    operacao: 'igual' | 'diferente' | 'maior' | 'menor' | 'maior_igual' | 'menor_igual' | 'e_um_dos' | 'nao_e_um_dos';
    valor_atributo: string;
    valor_produtos: string;
    promocao_imagem?: string;
    sku_acao?: string;
    desconto_acao?: string;
    brinde_sku?: string;
    brinde_nome?: string;
    brinde_imagem?: string;
}

export class ApiRegraPromocional implements IApiRegraPromocional {
    private _regras: IRegraPromocional[] = [];

    private criaRegraBrinde(objeto: RegraCsv): IRegraPromocional {
        const brinde = new Produto(objeto.brinde_sku, 'BRINDE', objeto.brinde_nome, 0, true);
        brinde.imagem = objeto.brinde_imagem;
        brinde.descricao = objeto.descricao;
        return new RegraPromocional(
            objeto.descricao,
            parseInt(objeto.prioridade),
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [
                {'tipo': objeto.atributo, 'operacao': objeto.operacao, 'valor': objeto.valor_atributo},
                {'tipo': 'valor_itens', 'operacao': 'maior_igual', 'valor': String(transformaDinheiroEmNumero(objeto.valor_produtos))}
            ],
            {'tipo': 'brinde_unico', 'valor': 1, 'brindes': [brinde]},
            '',
            objeto.promocao_imagem
        );
    }

    private criaRegraDesconto(objeto: RegraCsv): IRegraPromocional {
        return new RegraPromocional(
            objeto.descricao,
            parseInt(objeto.prioridade),
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [
                {'tipo': objeto.atributo, 'operacao': objeto.operacao, 'valor': objeto.valor_atributo},
                {'tipo': 'valor_itens', 'operacao': 'maior_igual', 'valor': String(transformaDinheiroEmNumero(objeto.valor_produtos))}
            ],
            {'tipo': objeto.tipo_regra, 'valor': parseFloat(objeto.desconto_acao), 'skus': objeto.sku_acao},
            '',
            objeto.promocao_imagem
        );
    }

    listar(): Promise<IRegraPromocional[]> {
        return new Promise<IRegraPromocional[]>(resolve => {
            this._regras = [];
            lerArquivoApartirDeUmLink('dist/assets/csv/promocoes.csv', (data) => {
                const separador = ';';
                const linhas = data.split(/\r\n|\n|\r/);
                const cabecalho = linhas[0].split(separador);

                for (let i = 1; i < linhas.length; i++) {
                    const valores = linhas[i].split(separador);
                    if (valores.length === cabecalho.length) {
                        const objeto = {};
                        for (let j = 0; j < cabecalho.length; j++) {
                            objeto[cabecalho[j]] = valores[j];
                        }
                        let regra: IRegraPromocional;
                        if ((objeto as RegraCsv).tipo_regra === 'brinde_unico') {
                            regra = this.criaRegraBrinde(objeto as RegraCsv);
                        } else {
                            regra = this.criaRegraDesconto(objeto as RegraCsv);
                        }
                        this._regras.push(regra)
                    }
                }
                console.log(this._regras);
                resolve(this._regras);
            });
        });
    }
}
