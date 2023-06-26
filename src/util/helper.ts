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
export const formataNumeroEmDinheiro = (numero: number | null): string => {
    return numero ? numero.toLocaleString('pt-br', {minimumFractionDigits: 2}) : '0,00';
};


export const criarElementoHtml = (tag: string, clazz: string[] = [], atributos = [], text: string = ''): HTMLElement => {
    const elemento = document.createElement(tag);
    if (clazz.length) {
        elemento.classList.add(...clazz);
    }
    for (let atributo of atributos) {
        elemento.setAttribute(atributo.nome, atributo.valor);
    }
    if (text) {
        elemento.innerText = text;
    }
    return elemento;
};