export const arredondarValor = (valor: number | null): number => {
    if (isNaN(valor)) {
        return 0;
    }
    return Math.round(valor * 100) / 100;
};
export const transformaDinheiroEmNumero = (dinheiro: string | null): number => {
    dinheiro = dinheiro.replace(',', '.').replace(/[^0-9.-]+/, '');
    return arredondarValor(parseFloat(dinheiro));
};
export const pegaTextoDoElementoXml = (elemento: Element | null, atributo: string): string => {
    const el = elemento.querySelector(atributo);
    if (el) {
        return el.textContent.trim();
    }
    return '';
};
export const pegaDadosGoogleMerchant = (arquivo: string, callback: (data: string) => void) => {
    fetch(arquivo)
        .then(response => response.text())
        .then(callback)
        .catch(error => console.error('Erro ao carregar o arquivo XML:', error));
};
