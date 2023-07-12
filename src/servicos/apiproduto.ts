import {IProduto} from "../contratos/entidades/produto";
import {
    IApiProduto,
    IApiProdutoCache,
    IApiProdutoFaixaPreco,
    IApiProdutoFiltro
} from "../contratos/servicos/apiproduto";
import {lerArquivoApartirDeUmLink, pegaTextoDoElementoXml, transformaDinheiroEmNumero} from "../util/helper";
import {Produto} from "../entidades/produto";
import {ApiConfiguracoes} from "./apiconfiguracoes";

export class ApiProduto implements IApiProduto {
    static CACHE: IApiProdutoCache = {
        produtos: [],
        filtros: new Map<string, string[]>()
    };
    private _produtos: IProduto[] = [];
    private _precos: IApiProdutoFaixaPreco = {minimo: 0, maximo: 0};

    listar(limparCache: boolean = false): Promise<IProduto[]> {
        if (limparCache) {
            ApiProduto.CACHE.produtos = [];
        }

        return new Promise<IProduto[]>(resolve => {
            if (ApiProduto.CACHE.produtos.length > 0) {
                this._produtos = ApiProduto.CACHE.produtos;
                resolve(this._produtos);
                return;
            }
            this._produtos = [];
            const config = ApiConfiguracoes.instancia().loja;
            lerArquivoApartirDeUmLink(config.google_merchant.url, (data) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'text/xml');
                Array.from(xmlDoc.querySelectorAll('item')).forEach(item => {
                    const price = pegaTextoDoElementoXml(item, 'price');
                    const sale_price = pegaTextoDoElementoXml(item, 'sale_price');
                    const produto = new Produto(
                        pegaTextoDoElementoXml(item, 'id'),
                        pegaTextoDoElementoXml(item, 'item_group_id'),
                        pegaTextoDoElementoXml(item, 'title'),
                        transformaDinheiroEmNumero(price),
                        pegaTextoDoElementoXml(item, 'availability') === 'In Stock',
                        pegaTextoDoElementoXml(item, 'title'),
                        transformaDinheiroEmNumero(sale_price),
                        pegaTextoDoElementoXml(item, 'image_link'),
                        pegaTextoDoElementoXml(item, 'link'),
                        pegaTextoDoElementoXml(item, 'product_type').split(',')[0],
                        pegaTextoDoElementoXml(item, 'brand'),
                        pegaTextoDoElementoXml(item, 'gtin')
                    );
                    if (config.google_merchant.filtros) {
                        const [chave, valor] = config.google_merchant.filtros.split('=');
                        if (produto[chave] == valor) {
                            this._produtos.push(produto);
                        }
                    } else {
                        this._produtos.push(produto);
                    }
                });
                if (this._produtos.length) {
                    ApiProduto.CACHE.produtos = this._produtos;
                }
                resolve(this._produtos);
            });
        });
    }

    set produtos(produtos: IProduto[]) {
        this._produtos = produtos;
    }

    get produtos(): IProduto[] {
        return this._produtos;
    }

    get faixaDePrecos(): IApiProdutoFaixaPreco {
        return this._precos;
    }

    private adicionarFiltro(filtros: IApiProdutoFiltro, atributo: string, valor: string) {
        if (!valor) return;
        if (filtros.has(atributo)) {
            const filtro = filtros.get(atributo);
            const item = filtro.find(filtroValor => filtroValor === valor);
            if (!item) {
                filtro.push(valor);
            }
        } else {
            filtros.set(atributo, [valor]);
        }
    }

    private filtraProdutos(atributo: string, valor: any, operacao: string): IProduto[] {
        return this.produtos.filter(item => {
            if (operacao === '===') {
                return item[atributo] === valor;
            }
            if (operacao === 'contem') {
                return item[atributo].toLowerCase().includes(valor.toLowerCase());
            }
            return false;
        });
    }

    filtrarPorCategoria(nome: string): IProduto[] {
        return this.filtraProdutos('categorias', nome, '===');
    }

    filtrarPorMarca(nome: string): IProduto[] {
        return this.filtraProdutos('marca', nome, '===');
    }

    filtrarPorAgrupador(agrupador: string): IProduto[] {
        return this.filtraProdutos('agrupador', agrupador, '===');
    }

    filtrarPorCodigoBarra(codigoBarra: string): IProduto[] {
        return this.filtraProdutos('codigo_barras', codigoBarra, '===');
    }

    filtrarPorSku(sku: string): IProduto[] {
        return this.filtraProdutos('id', sku, 'contem');
    }

    filtrarPorNome(nome: string): IProduto[] {
        return this.filtraProdutos('nome', nome, 'contem');
    }

    filtrarPorPreco(valorMinimo: number, valorMaximo: number): IProduto[] {
        return this.produtos.filter(item => item.preco >= valorMinimo && item.preco <= valorMaximo);
    }

    filtrarPorSituacao(situacao: boolean): IProduto[] {
        return this.filtraProdutos('situacao', situacao, '===');
    }

    consultar(id: string): IProduto | undefined {
        return ApiProduto.CACHE.produtos.find(produto => produto.id === id);
    }

    filtros(): IApiProdutoFiltro {
        const filtros = new Map<string, string[]>;
        for (const produto of ApiProduto.CACHE.produtos) {
            this.adicionarFiltro(filtros, 'categorias', produto.categorias);
            this.adicionarFiltro(filtros, 'marca', produto.marca);
            if (this._precos.minimo > produto.preco) {
                this._precos.minimo = produto.preco
            }
            if (this._precos.maximo < produto.preco) {
                this._precos.maximo = produto.preco
            }
        }
        ApiProduto.CACHE.filtros = filtros;
        return filtros;
    }
}
