export const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
        return false;
    }
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    const digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    const digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    return parseInt(cpf.charAt(10)) === digitoVerificador2;
};
export const validarDataDeNascimento = (data: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) {
        return false;
    }

    const [, dia, mes, ano] = data.match(regex);
    const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    if (dataNascimento.getDate() !== parseInt(dia) || dataNascimento.getMonth() !== parseInt(mes) - 1 || dataNascimento.getFullYear() !== parseInt(ano)) {
        return false;
    }
    const dataAtual = new Date();
    return dataNascimento <= dataAtual;
};
export const validarTelefone = (numero: string): boolean => {
    const numeroLimpo = numero.replace(/\D/g, '');
    const regexFormato = /^\d{10,11}$/;
    return regexFormato.test(numeroLimpo);
};
export const validarEmail = (email: string): boolean => {
    const regexFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexFormato.test(email);
};
export const validarCEP = (cep: string): boolean => {
    cep = cep.replace(/\D/g, '');
    return (cep.length === 8)
}
export const validarUF = (uf: string): boolean => {
    if (uf.length !== 2) {
        return false;
    }
    const ufs = [
        'RO', 'AC', 'AM', 'RR', 'PA', 'AP', 'TO',
        'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL',
        'SE', 'BA', 'MG', 'ES', 'RJ', 'SP', 'PR',
        'SC', 'RS', 'MS', 'MT', 'GO', 'DF'
    ];
    return (ufs.indexOf(uf.toUpperCase()) >= 0);
}

export const validarBandeiraCartaoDeCredito = (nome: string): boolean => {
    // const bandeiras = ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DINERS CLUB', 'DISCOVER', 'JCB', 'HIPERCARD', 'ELO', 'AURA'];
    const bandeiras = ['VISA', 'MASTERCARD', 'ELO', 'HIPERCARD', 'AMEX'];
    return bandeiras.indexOf(nome.toUpperCase()) >= 0;
}

export const validarCartaoDeCredito = (numero: string): boolean => {
    numero = numero.replace(/\s/g, '');
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(numero)) {
        return false;
    }

    return luhnCheck(numero);
}

const luhnCheck = val => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        j = (j === 1) ? 2 : 1;
    }
    return (checksum % 10) == 0;
}