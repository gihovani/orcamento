import {IApiParcelamento} from "../contratos/servicos/apiparcelamento";
import {ICarrinho} from "../contratos/carrinho";

export class ApiParcelamento implements IApiParcelamento {
    consultar(tipo: string, carrinho: ICarrinho): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const max = Math.floor(carrinho.totalizador?.valor_total/200);
            if (max < 1) {
                resolve(1);
                return;
            }
            if (tipo === 'boleto') {
                resolve(max > 6 ? 6 : max);
                return;
            }
            if (tipo === 'cartaodecredito') {
                resolve(max > 12 ? 12 : max);
                return;
            }
            if (tipo === 'cartaodecreditomaquineta') {
                resolve(max > 24 ? 24 : max);
                return;
            }
            resolve(1);
        });
    }
}