export const numToWords = (amount) => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount)
    }

    if (isNaN(amount)) {
        return 'Invalid Amount'
    }

    const ones = [
        '',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
    ]

    const tens = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
    ]

    const numToWordsIndian = (num) => {
        if (num === 0) {
            return 'Zero'
        }

        let str = ''

        const getBelowHundred = (n) => {
            if (n < 20) {
                return ones[n]
            }

            const t = Math.floor(n / 10)
            const o = n % 10

            return (
                tens[t] +
                (o ? ` ${ones[o]}` : '')
            )
        }

        const crore = Math.floor(
            num / 10000000,
        )

        const lakh = Math.floor(
            (num / 100000) % 100,
        )

        const thousand = Math.floor(
            (num / 1000) % 100,
        )

        const hundred = Math.floor(
            (num / 100) % 10,
        )

        const rest = num % 100

        if (crore) {
            str += `${getBelowHundred(crore)} Crore `
        }

        if (lakh) {
            str += `${getBelowHundred(lakh)} Lakh `
        }

        if (thousand) {
            str += `${getBelowHundred(thousand)} Thousand `
        }

        if (hundred) {
            str += `${ones[hundred]} Hundred `
        }

        if (rest) {
            str += `${getBelowHundred(rest)} `
        }

        return str.trim()
    }

    const rupees = Math.floor(amount)

    const paise = Math.round(
        (amount - rupees) * 100,
    )

    let result = `INR ${numToWordsIndian(rupees)}`

    if (paise > 0) {
        result += ` and ${numToWordsIndian(paise)} Paise`
    }

    result += ' Only'

    return result
}