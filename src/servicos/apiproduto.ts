import {IProduto} from "../contratos/entidades/produto";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {pegaDadosGoogleMerchant, pegaTextoDoElementoXml, transformaDinheiroEmNumero} from "../util/helper";
import {Produto} from "../entidades/produto";

type IApiProdutoFiltro = Map<string, string[]>;

export class ApiProduto implements IApiProduto {
    private _cached: { produtos: IProduto[], filtros: IApiProdutoFiltro } = {
        produtos: [],
        filtros: new Map<string, string[]>()
    };
    private _produtos: IProduto[];

    listar(): Promise<IProduto[]> {
        return new Promise<IProduto[]>(resolve => {
            if (this._cached.produtos.length > 0) {
                this._produtos = this._cached.produtos;
                resolve(this._produtos);
                return;
            }
            pegaDadosGoogleMerchant('xml/google.xml', (data) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'text/xml');
                this._produtos = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
                    const price = pegaTextoDoElementoXml(item, 'price');
                    const sale_price = pegaTextoDoElementoXml(item, 'sale_price');
                    return new Produto(
                        pegaTextoDoElementoXml(item, 'id'),
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
                });
                if (this._produtos.length) {
                    this._cached.produtos = this._produtos;
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

    private filtraProdutos(atributo: string, valor: string): IProduto[] {
        return this.produtos.filter(item => item[atributo] === valor);
    }

    filtrarPorCategoria(nome: string): IProduto[] {
        return this.filtraProdutos('categorias', nome);
    }

    filtrarPorMarca(nome: string): IProduto[] {
        return this.filtraProdutos('marca', nome);
    }

    filtrarPorCodigoBarra(codigoBarra: string): IProduto[] {
        return this.filtraProdutos('codigo_barras', codigoBarra);
    }

    filtrarPorPreco(valorMinimo: number, valorMaximo: number): IProduto[] {
        return this.produtos.filter(item => item.preco >= valorMinimo && item.preco <= valorMaximo);
    }

    consultar(id: string): IProduto | undefined {
        return this._cached.produtos.find(produto => produto.id === id);
    }

    filtros(): IApiProdutoFiltro {
        const filtros = new Map<string, string[]>;
        for (const produto of this._cached.produtos) {
            this.adicionarFiltro(filtros, 'categorias', produto.categorias);
            this.adicionarFiltro(filtros, 'marca', produto.marca);
        }
        this._cached.filtros = filtros;
        return filtros;
    }
}
